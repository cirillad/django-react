import { useState } from "react";
import { APP_ENV } from "../../env";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  console.log("window.location.origin", window.location.origin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(
        `${APP_ENV.API_BASE_URL}/api/password-reset-request/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            frontend_url: window.location.origin,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) setMessage("Лист для відновлення паролю надіслано.");
      else setMessage(data.email || data.detail || "Сталася помилка.");
    } catch {
      setMessage("Помилка з'єднання з сервером.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        background: "linear-gradient(135deg, #635985 0%, #443C68 100%)",
        borderRadius: "6px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-4 shadow-lg border-radius-6"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2
          className="mb-4 text-center"
          style={{ color: "#393053", fontWeight: "700" }}
        >
          Відновлення паролю
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="form-label fw-semibold"
            style={{ color: "#18122B" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Введіть вашу пошту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            style={{
              borderColor: "#635985",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "6px",
              padding: "10px",
            }}
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: "#635985",
            color: "#fff",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(99, 89, 133, 0.6)",
            transition: "background-color 0.3s ease",
            width: "150px",
            padding: "8px 0",
            display: "block",
            margin: "0 auto",
            borderRadius: "6px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#443C68")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#635985")
          }
        >
          Надіслати
        </button>

        {message && (
          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: "#393053",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
