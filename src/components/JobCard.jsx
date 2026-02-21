function JobCard({
  job,
  repoUrl,
  onRepoChange,
  onSubmit,
  submitState,
  disabled,
}) {
  const isLoading = submitState?.loading;

  return (
    <article className="job-card">
      <h3>{job.title}</h3>
      <p className="job-id">ID: {job.id}</p>

      <input
        className="input"
        type="url"
        placeholder="https://github.com/tu-usuario/tu-repo"
        value={repoUrl}
        onChange={(event) => onRepoChange(event.target.value)}
      />

      <button className="button" onClick={onSubmit} disabled={disabled || isLoading}>
        {isLoading ? 'Enviando...' : 'Submit'}
      </button>

      {submitState?.error ? <p className="message error">{submitState.error}</p> : null}
      {submitState?.success ? <p className="message success">{submitState.success}</p> : null}
    </article>
  );
}

export default JobCard;