export default function DocumentPickerModal({ docs, onClose, onSelect }) {
  if (!docs) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal picker-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        <h2>Wybierz dokument</h2>

        <ul className="picker-list">
          {docs.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                className="picker-item"
                onClick={() => onSelect(doc.id)}
              >
                <span
                  className="legend-dot"
                  style={{ backgroundColor: `#${doc.color}` }}
                />
                {doc.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}