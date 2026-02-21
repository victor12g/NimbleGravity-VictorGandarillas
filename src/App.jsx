import { useMemo, useState } from 'react';
import JobCard from './components/JobCard.jsx';
import {
  applyToJob,
  getCandidateByEmail,
  getJobs,
  isValidGithubRepoUrl,
} from './services/api.js';

function App() {
  const [email, setEmail] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [repoByJob, setRepoByJob] = useState({});

  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [formError, setFormError] = useState('');

  const [submitStateByJob, setSubmitStateByJob] = useState({});

  const canSubmitAny = useMemo(() => candidate && jobs.length > 0, [candidate, jobs]);

  const handleLoadData = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setFormError('Ingresá tu email para cargar tus datos de candidato.');
      return;
    }

    setFormError('');
    setIsLoadingCandidate(true);
    setIsLoadingJobs(true);

    try {
      const [candidateResponse, jobsResponse] = await Promise.all([
        getCandidateByEmail(normalizedEmail),
        getJobs(),
      ]);

      setCandidate(candidateResponse);
      setJobs(jobsResponse);
      setSubmitStateByJob({});
    } catch (error) {
      setCandidate(null);
      setJobs([]);
      setFormError(error.message || 'No se pudieron cargar los datos.');
    } finally {
      setIsLoadingCandidate(false);
      setIsLoadingJobs(false);
    }
  };

  const handleRepoChange = (jobId, value) => {
    setRepoByJob((previous) => ({
      ...previous,
      [jobId]: value,
    }));

    setSubmitStateByJob((previous) => ({
      ...previous,
      [jobId]: {
        ...previous[jobId],
        error: '',
        success: '',
      },
    }));
  };

  const handleSubmit = async (jobId) => {
    if (!candidate) {
      setFormError('Primero cargá los datos del candidato con tu email.');
      return;
    }

    const repoUrl = (repoByJob[jobId] || '').trim();
    if (!isValidGithubRepoUrl(repoUrl)) {
      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: 'Ingresá una URL válida de GitHub (https://github.com/usuario/repo).',
          success: '',
        },
      }));
      return;
    }

    setSubmitStateByJob((previous) => ({
      ...previous,
      [jobId]: {
        loading: true,
        error: '',
        success: '',
      },
    }));

    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        repoUrl,
      });

      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: '',
          success: 'Postulación enviada correctamente.',
        },
      }));
    } catch (error) {
      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: error.message || 'No se pudo enviar la postulación.',
          success: '',
        },
      }));
    }
  };

  return (
    <main className="container">
      <h1>Nimble Gravity Challenge</h1>

      <section className="panel">
        <h2>Step 2 + Step 3</h2>
        <p className="muted">Cargá tus datos de candidato y las posiciones abiertas.</p>

        <div className="row">
          <input
            className="input"
            type="email"
            placeholder="tu.email@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            className="button"
            onClick={handleLoadData}
            disabled={isLoadingCandidate || isLoadingJobs}
          >
            {isLoadingCandidate || isLoadingJobs ? 'Cargando...' : 'Cargar datos'}
          </button>
        </div>

        {formError ? <p className="message error">{formError}</p> : null}

        {candidate ? (
          <div className="candidate-box">
            <p>
              <strong>Candidato:</strong> {candidate.firstName} {candidate.lastName}
            </p>
            <p>
              <strong>Email:</strong> {candidate.email}
            </p>
            <p>
              <strong>uuid:</strong> {candidate.uuid}
            </p>
            <p>
              <strong>candidateId:</strong> {candidate.candidateId}
            </p>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>Step 4 + Step 5</h2>
        <p className="muted">Listado de posiciones con submit por posición.</p>

        {!jobs.length && !isLoadingJobs ? (
          <p className="message">Todavía no hay posiciones cargadas.</p>
        ) : null}

        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              repoUrl={repoByJob[job.id] || ''}
              onRepoChange={(value) => handleRepoChange(job.id, value)}
              onSubmit={() => handleSubmit(job.id)}
              disabled={!canSubmitAny}
              submitState={submitStateByJob[job.id]}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
