import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useAuth, authHeaders } from "../authContext";

export default function DocumentModal({ documentId, onClose, onSaved }) {
  const { token } = useAuth();
  const [doc, setDoc] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [rola, setRola] = useState("");
  const [zatwierdzone, setZatwierdzone] = useState(false);
  const [dataWaznosci, setDataWaznosci] = useState("");
  const [nieDotyczy, setNieDotyczy] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState(null);
  const [versionsLoading, setVersionsLoading] = useState(false);

  useEffect(() => {
    if (!documentId) return;

    setLoading(true);
    setError(null);
    setShowVersions(false);
    setVersions(null);

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
        setZatwierdzone(Boolean(docData.zatwierdzone));
        setDataWaznosci(docData.data_waznosci || "");
        setNieDotyczy(!docData.data_waznosci);
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
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify({
        status_id: statusId,
        rola_osoby_odpowiedzialnej: rola,
        zatwierdzone,
        data_waznosci: nieDotyczy ? null : dataWaznosci || null,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.detail || "Nie udało się zapisać zmian.");
        }
        return res.json();
      })
      .then((updated) => {
        onSaved(updated);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false));
  };

  const handleOpen = () => {
    fetch(`${API_URL}/documents/${documentId}/open`, { method: "POST" }).catch(
      () => setError("Nie udało się otworzyć pliku.")
    );
  };

  const handleToggleVersions = () => {
    const next = !showVersions;
    setShowVersions(next);

    if (next && versions === null) {
      setVersionsLoading(true);
      fetch(`${API_URL}/documents/${documentId}/versions`)
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(setVersions)
        .catch(() => setError("Nie udało się wczytać poprzednich wersji."))
        .finally(() => setVersionsLoading(false));
    }
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
              <dd>
                <button className="path-link" onClick={handleOpen} type="button">
                  {doc.relative_path}
                </button>
              </dd>

              <dt>Rozmiar</dt>
              <dd>
                {doc.size != null ? (doc.size / 1024 / 1024).toFixed(2) : "?"} MB
              </dd>

              <dt>Utworzono</dt>
              <dd>{doc.created_at ? doc.created_at.slice(0, 10) : "-"}</dd>

              <dt>Zmodyfikowano</dt>
              <dd>{doc.modified_at ? doc.modified_at.slice(0, 10) : "-"}</dd>

              <dt>Status zmieniono</dt>
              <dd>
                {doc.status_modified_at
                  ? doc.status_modified_at.slice(0, 16).replace("T", " ")
                  : "-"}
              </dd>

              <dt>Ostatnio zmienił</dt>
              <dd>{doc.zatwierdzil || "-"}</dd>
            </dl>

            <button
              type="button"
              className="versions-toggle"
              onClick={handleToggleVersions}
            >
              {showVersions ? "Ukryj poprzednie wersje" : "Poprzednie wersje"}
            </button>

            {showVersions && (
              <div className="versions-panel">
                {versionsLoading && <p>Ładowanie…</p>}

                {!versionsLoading && versions && versions.length === 0 && (
                  <p className="versions-empty">
                    Brak wcześniejszych wersji tego dokumentu.
                  </p>
                )}

                {!versionsLoading && versions && versions.length > 0 && (
                  <ul className="versions-list">
                    {versions.map((v) => (
                      <li key={v.id} className="version-item">
                        <span
                          className="version-status-dot"
                          style={{ backgroundColor: `#${v.color}` }}
                        />
                        <div className="version-item-body">
                          <div className="version-item-row">
                            <strong>{v.status}</strong>
                            <span className="version-item-dates">
                              {v.start_dt ? v.start_dt.slice(0, 16).replace("T", " ") : "-"}
                              {" \u2192 "}
                              {v.end_dt ? v.end_dt.slice(0, 16).replace("T", " ") : "-"}
                            </span>
                          </div>
                          <div className="version-item-meta">
                            {v.rola_osoby_odpowiedzialnej && (
                              <span>Rola: {v.rola_osoby_odpowiedzialnej}</span>
                            )}
                            <span>{v.zatwierdzone ? "Zatwierdzony" : "Niezatwierdzony"}</span>
                            {v.zatwierdzil && <span>Przez: {v.zatwierdzil}</span>}
                            {v.data_waznosci && (
                              <span>Ważny do: {v.data_waznosci}</span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

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

            <label className="modal-checkbox modal-field">
              <input
                type="checkbox"
                checked={zatwierdzone}
                onChange={(e) => setZatwierdzone(e.target.checked)}
              />
              Zatwierdzone
            </label>

            <div className="modal-field">
              Data ważności
              <label className="modal-checkbox">
                <input
                  type="checkbox"
                  checked={nieDotyczy}
                  onChange={(e) => setNieDotyczy(e.target.checked)}
                />
                Nie dotyczy
              </label>
              {!nieDotyczy && (
                <input
                  type="date"
                  value={dataWaznosci}
                  onChange={(e) => setDataWaznosci(e.target.value)}
                />
              )}
            </div>

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