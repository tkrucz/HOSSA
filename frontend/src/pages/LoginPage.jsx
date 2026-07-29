import { useState } from "react";
import { useAuth } from "../authContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const action =
      mode === "login"
        ? login(loginValue, password)
        : register(userName, userSurname, loginValue, password);

    action.catch((err) => setError(err.message)).finally(() => setSubmitting(false));
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>{mode === "login" ? "Zaloguj się" : "Załóż konto"}</h1>

        {mode === "register" && (
          <>
            <label className="modal-field">
              Imię
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </label>

            <label className="modal-field">
              Nazwisko
              <input
                type="text"
                value={userSurname}
                onChange={(e) => setUserSurname(e.target.value)}
                required
              />
            </label>
          </>
        )}

        <label className="modal-field">
          Login
          <input
            type="text"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            required
          />
        </label>

        <label className="modal-field">
          Hasło
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="modal-error">{error}</p>}

        <button type="submit" className="reload-button" disabled={submitting}>
          {submitting
            ? "Chwileczkę…"
            : mode === "login"
            ? "Zaloguj się"
            : "Załóż konto"}
        </button>

        <button
          type="button"
          className="login-switch"
          onClick={() => {
            setError(null);
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login"
            ? "Nie masz konta? Załóż je"
            : "Masz już konto? Zaloguj się"}
        </button>
      </form>
    </div>
  );
}