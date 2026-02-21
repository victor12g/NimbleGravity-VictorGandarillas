function ApplyModal({ job, repoUrl, onRepoChange, onSubmit, onClose, submitState, canSubmit }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-card"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <h3>{job.title} <span className="job-id">({job.id})</span></h3>
                    </div>
                    <button
                        className="icon-button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{ background: '#e53e3e', color: '#fff', lineHeight: 1 }}
                    >
                        ✕
                    </button>
                </div>

                <p style={{ fontSize: '14px', color: '#5b3fa6', fontWeight: 500 }}>
                    Paste your public GitHub repository URL below and submit your application.
                </p>

                <div className="modal-body">
                    <input
                        className="input"
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={repoUrl}
                        aria-label="GitHub repository URL"
                        onChange={(event) => onRepoChange(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') onSubmit(); }}
                    />

                    <button
                        className="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || submitState?.loading || !!submitState?.success}
                    >
                        {submitState?.loading ? 'Submitting...' : submitState?.success ? 'Applied ✓' : 'Submit'}
                    </button>

                    {submitState?.error ? (
                        <p className="message error">{submitState.error}</p>
                    ) : null}
                    {submitState?.success ? (
                        <p className="message success">{submitState.success}</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default ApplyModal;
