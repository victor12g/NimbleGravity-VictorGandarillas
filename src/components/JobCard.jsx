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
      <h3 className="job-title" title={job.title}>
        {job.title}
      </h3>
      <p className="job-id">ID: {job.id}</p>

      {submitState?.error ? <p className="message error">{submitState.error}</p> : null}
      {submitState?.success ? <p className="message success">{submitState.success}</p> : null}
    </article>
  );
}

export default JobCard;