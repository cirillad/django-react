import { useState } from "react";
import { useParams } from "react-router-dom";
import { APP_ENV } from "../../env";

export default function PasswordResetConfirm() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [passwordError, setPasswordError] = useState("");

  // Валідація пароля
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Пароль має бути не менше 6 символів";
    }
    if (!/[A-Z]/.test(password)) {
      return "Пароль має містити принаймні одну велику літеру";
    }
    if (!/[0-9]/.test(password)) {
      return "Пароль має містити принаймні одну цифру";
    }

    return "";
  };

  if (!uid || !token) {
    return (
      <p className="text-danger text-center mt-5">
        Невірне або неповне посилання для відновлення паролю.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const error = validatePassword(newPassword);
    setPasswordError(error);

    if (error) return;

    setIsLoading(true);

    try {
      const res = await fetch(
        `${APP_ENV.API_BASE_URL}/api/password-reset-confirm/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, token, new_password: newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Пароль успішно змінено. Тепер можна увійти.");
        setIsSuccess(true);
      } else {
        setMessage(data.error || data.detail || "Сталася помилка.");
        setIsSuccess(false);
      }
    } catch {
      setMessage("Помилка з'єднання з сервером.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    // Валідація в реальному часі
    const error = validatePassword(e.target.value);
    setPasswordError(error);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
      }}
    >
      <h2 className="mb-4 text-center text-primary">Зміна паролю</h2>

      <input
        type="password"
        placeholder="Новий пароль"
        value={newPassword}
        onChange={handleChange}
        required
        className={`form-control mb-2 ${passwordError ? "is-invalid" : ""}`}
        aria-describedby="passwordHelp"
      />
      {passwordError && (
        <div className="invalid-feedback" style={{ fontSize: "0.9rem" }}>
          {passwordError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !!passwordError}
        className="btn btn-primary w-100 mt-3"
      >
        {isLoading ? "Завантаження..." : "Змінити пароль"}
      </button>

      {message && (
        <div
          className={`mt-4 alert ${
            isSuccess ? "alert-success" : "alert-danger"
          } text-center`}
          role="alert"
        >
          {message}
        </div>
      )}
    </form>
  );
}
