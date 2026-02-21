import JobCard from './JobCard.jsx';

function JobsSection({ candidate, jobs, isLoading, error, selectedJobId, onSelect, submitStateByJob }) {
    const subtitle = !candidate
        ? 'Load your candidate data first to enable position search.'
        : error
            ? null
            : jobs.length > 0
                ? 'Select a position to submit your application.'
                : 'No open positions available yet.';

    return (
        <section className="panel panel--light">
            <h2>Open Positions</h2>
            {subtitle ? <p className="muted">{subtitle}</p> : null}

            {!candidate ? (
                <p className="message">You need to load your candidate data to see open positions.</p>
            ) : null}

            {error ? (
                <p className="message error">{error}</p>
            ) : null}

            {candidate && !error ? (
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onSelect={() => onSelect(job.id)}
                            isSelected={selectedJobId === job.id}
                            submitState={submitStateByJob[job.id]}
                        />
                    ))}
                </div>
            ) : null}
        </section>
    );
}

export default JobsSection;
