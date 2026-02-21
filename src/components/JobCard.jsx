function JobCard({
  job,
  submitState,
  onSelect,
  isSelected,
}) {
  const handleSelect = () => {
    onSelect();
  };

  return (
    <article
      className={`job-card ${isSelected ? 'job-card--selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect();
        }
      }}
    >
      <h3 className="job-title" title={job.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{job.title}</span>
        {submitState?.success && <span title="Applied successfully" style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '1.2em' }}>✓</span>}
      </h3>
      <p className="job-id">ID: {job.id}</p>

      {submitState?.error ? <p className="message error">{submitState.error}</p> : null}
    </article>
  );
}

export default JobCard;