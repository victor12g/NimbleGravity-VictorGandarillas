import { useState } from 'react';

function maskValue(value) {
    if (!value) return '';
    return value.slice(0, 4) + '••••••••' + value.slice(-4);
}

function CandidateSection({ email, onEmailChange, onLoad, isLoading, candidate, error }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <section className="panel panel--light">
            <h2>Candidate Information</h2>
            <p className="muted">Enter your email to load your candidate data.</p>

            <div className="row">
                <input
                    className="input"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    aria-label="Candidate email"
                    onChange={(event) => onEmailChange(event.target.value)}
                />
                <button className="button" onClick={onLoad} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Load candidate'}
                </button>
            </div>

            {error ? <p className="message error">{error}</p> : null}

            {candidate ? (
                <div className="candidate-box">
                    <p>
                        <strong>Name:</strong> {candidate.firstName} {candidate.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {candidate.email}
                    </p>
                    <p>
                        <strong>uuid:</strong>{' '}
                        <span style={{ fontFamily: 'monospace' }}>
                            {revealed ? candidate.uuid : maskValue(candidate.uuid)}
                        </span>
                    </p>
                    <p>
                        <strong>candidateId:</strong>{' '}
                        <span style={{ fontFamily: 'monospace' }}>
                            {revealed ? candidate.candidateId : maskValue(candidate.candidateId)}
                        </span>
                    </p>
                    <p>
                        <strong>applicationId:</strong>{' '}
                        <span style={{ fontFamily: 'monospace' }}>
                            {revealed ? candidate.applicationId : maskValue(candidate.applicationId)}
                        </span>
                    </p>
                    <button
                        className="button"
                        style={{ justifySelf: 'start', padding: '4px 10px', fontSize: '13px' }}
                        onClick={() => setRevealed((prev) => !prev)}
                    >
                        {revealed ? 'Hide IDs' : 'Show IDs'}
                    </button>
                </div>
            ) : null}
        </section>
    );
}

export default CandidateSection;
