import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function DocumentModal({ documentId, onClose, onSaved }) {
  const [doc, setDoc] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [rola, setRola] = useState("");
  const [ktoZatwierdzil, setKtoZatwierdzil] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/documents/${documentId}`).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
      fetch(`${API_URL}/statuses`).then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      }),
    ])
      .then(([docData, statusList]) => {
        setDoc(docData);
        setStatuses(statusList);
        setStatusId(docData.status_id);
        setRola(docData.rola_osoby_odpowiedzialnej || "");
        setKtoZatwierdzil(docData.kto_zatwierdzil || "");
      })
      .catch(() => setError("Nie udało się wczytać dokumentu."))
      .finally(() => setLoading(false));
  }, [documentId]);

  if (!documentId) return null;

  const handleSave = () => {
    setSaving(true);
    setError(null);

    fetch(`${API_URL}/documents/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status_id: statusId,
        rola_osoby_odpowiedzialnej: rola,
        kto_zatwierdzil: ktoZatwierdzil,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((updated) => {
        onSaved(updated);
        onClose();
      })
      .catch(() => setError("Nie udało się zapisać zmian."))
      .finally(() => setSaving(false));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        {loading && <p>Ładowanie…</p>}

        {!loading && doc && (
          <>
            <h2>{doc.name}</h2>

            <dl className="modal-details">
              <dt>Ścieżka</dt>
              <dd>{doc.relative_path}</dd>

              <dt>Rozmiar</dt>
              <dd>
                {doc.size != null ? (doc.size / 1024 / 1024).toFixed(2) : "?"} MB
              </dd>

              <dt>Utworzono</dt>
              <dd>{doc.created_at ? doc.created_at.slice(0, 10) : "-"}</dd>

              <dt>Zmodyfikowano</dt>
              <dd>{doc.modified_at ? doc.modified_at.slice(0, 10) : "-"}</dd>
            </dl>

            <label className="modal-field">
              Status
              <select
                value={statusId}
                onChange={(e) => setStatusId(Number(e.target.value))}
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="modal-field">
              Rola osoby odpowiedzialnej
              <input
                type="text"
                value={rola}
                onChange={(e) => setRola(e.target.value)}
              />
            </label>

            <label className="modal-field">
              Kto zatwierdził
              <input
                type="text"
                value={ktoZatwierdzil}
                onChange={(e) => setKtoZatwierdzil(e.target.value)}
              />
            </label>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button onClick={onClose} disabled={saving}>
                Anuluj
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="modal-save"
              >
                {saving ? "Zapisywanie…" : "Zapisz"}
              </button>
            </div>
          </>
        )}

        {!loading && !doc && error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
}