import { useState } from "react";
import { API_URL } from "../api";

// `onSynced` is called after a successful sync so the calling page can
// refetch whatever data it displays (projects, folders, documents...).
export default function ReloadButton({ onSynced }) {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleReload = () => {
    setSyncing(true);
    setError(null);

    fetch(`${API_URL}/sync`, { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.detail || `Błąd serwera (${res.status})`);
        }
        return res.json();
      })
      .then(() => onSynced && onSynced())
      .catch((err) =>
        setError(`Nie udało się załadować dokumentów ponownie: ${err.message}`)
      )
      .finally(() => setSyncing(false));
  };

  return (
    <div className="reload-button-wrapper">
      <button className="reload-button" onClick={handleReload} disabled={syncing}>
        {syncing ? "Ładowanie…" : "Załaduj ponownie"}
      </button>
      {error && <p className="modal-error reload-error">{error}</p>}
    </div>
  );
}