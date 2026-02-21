import { useMemo, useState } from 'react';
import CandidateSection from './components/CandidateSection.jsx';
import JobsSection from './components/JobsSection.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import {
  applyToJob,
  getCandidateByEmail,
  getJobs,
  isValidEmail,
  isValidGithubRepoUrl,
} from './services/api.js';

function App() {
  const [email, setEmail] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [repoByJob, setRepoByJob] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [formError, setFormError] = useState('');
  const [jobsError, setJobsError] = useState('');

  const [submitStateByJob, setSubmitStateByJob] = useState({});

  const canSubmitAny = useMemo(() => candidate && jobs.length > 0, [candidate, jobs]);
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const handleLoadCandidate = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setFormError('Please enter your email to load your candidate data.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFormError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    setFormError('');
    setIsLoadingCandidate(true);

    try {
      const candidateResponse = await getCandidateByEmail(normalizedEmail);
      setCandidate(candidateResponse);
      setSubmitStateByJob({});

      setJobsError('');
      setIsLoadingJobs(true);
      try {
        const jobsResponse = await getJobs();
        setJobs(jobsResponse);
        setSelectedJobId(null);
      } catch (error) {
        setJobs([]);
        setJobsError(error.message || 'Failed to load open positions.');
      } finally {
        setIsLoadingJobs(false);
      }
    } catch (error) {
      setCandidate(null);
      setFormError(error.message || 'Failed to load candidate data.');
    } finally {
      setIsLoadingCandidate(false);
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
      setFormError('Please load your candidate data first.');
      return;
    }

    const repoUrl = (repoByJob[jobId] || '').trim();
    if (!isValidGithubRepoUrl(repoUrl)) {
      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: 'Please enter a valid GitHub repository URL (https://github.com/username/repo).',
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
        applicationId: candidate.applicationId,
        repoUrl,
      });

      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: '',
          success: 'Application submitted successfully.',
        },
      }));
    } catch (error) {
      setSubmitStateByJob((previous) => ({
        ...previous,
        [jobId]: {
          loading: false,
          error: error.message || 'Failed to submit your application.',
          success: '',
        },
      }));
    }
  };

  return (
    <main className="container">
      <h1>Nimble Gravity Challenge</h1>

      <CandidateSection
        email={email}
        onEmailChange={setEmail}
        onLoad={handleLoadCandidate}
        isLoading={isLoadingCandidate}
        candidate={candidate}
        error={formError}
      />

      <JobsSection
        candidate={candidate}
        jobs={jobs}
        isLoading={isLoadingJobs}
        error={jobsError}
        selectedJobId={selectedJobId}
        onSelect={setSelectedJobId}
        submitStateByJob={submitStateByJob}
      />

      {selectedJob ? (
        <ApplyModal
          job={selectedJob}
          repoUrl={repoByJob[selectedJob.id] || ''}
          onRepoChange={(value) => handleRepoChange(selectedJob.id, value)}
          onSubmit={() => handleSubmit(selectedJob.id)}
          onClose={() => setSelectedJobId(null)}
          submitState={submitStateByJob[selectedJob.id]}
          canSubmit={canSubmitAny}
        />
      ) : null}
    </main>
  );
}

export default App;
