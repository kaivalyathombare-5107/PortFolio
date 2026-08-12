import OwnerAccess from './OwnerAccess.jsx';

export default function Footer({ profile, isOwner, onUnlock, onExit }) {
  return (
    <footer className="footer">
      <span className="footer-text">
        © {new Date().getFullYear()} {profile.name}. Built with React.
      </span>
      {isOwner ? (
        <button type="button" className="footer-exit-btn" onClick={onExit}>
          Exit edit mode
        </button>
      ) : (
        <OwnerAccess onUnlock={onUnlock} />
      )}
    </footer>
  );
}
