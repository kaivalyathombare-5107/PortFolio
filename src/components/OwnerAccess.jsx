import { useState } from 'react';

export default function OwnerAccess({ onUnlock }) {
  const [open, setOpen] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function close() {
    setOpen(false);
    setPassphrase('');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onUnlock(passphrase);
      close();
    } catch (err) {
      setError(err.message || 'Incorrect passphrase');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="owner-access-trigger"
        aria-label="Owner access"
        onClick={() => setOpen(true)}
      >
        &middot;
      </button>

      {open ? (
        <div className="owner-modal-backdrop" onClick={close}>
          <div
            className="owner-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Owner sign-in"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Owner access</p>
            <h3 className="section-title panel-title">Enter passphrase</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="owner-passphrase">Passphrase</label>
                <input
                  id="owner-passphrase"
                  type="password"
                  autoFocus
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {error ? <p className="form-status form-status-error">{error}</p> : null}
              <div className="owner-modal-actions">
                <button type="button" className="btn" onClick={close} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? 'Checking…' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
