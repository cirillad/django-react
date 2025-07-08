import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useRegisterMutation } from "../../services/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Пароль має містити мінімум 4 символи.");
      return;
    }

    if (password !== confirm) {
      setError("Паролі не співпадають.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("password2", confirm);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await register(formData as any).unwrap();
      console.log("Відповідь з бекенду:", res);
      alert(res.message);

      dispatch(setCredentials(res));
      navigate("/");
    } catch (err: any) {
      if (err?.data) {
        setError(JSON.stringify(err.data));
      } else {
        setError("Сталася помилка під час реєстрації.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Реєстрація
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Логін
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="+380123456789"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              Фото профілю
            </label>

            {!imagePreview ? (
              <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="avatarUpload"
                />
                <label htmlFor="avatarUpload" className="cursor-pointer">
                  <p className="text-3xl text-gray-400 mb-2">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Натисніть або перетягніть фото сюди
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Тільки зображення (1 файл)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative w-36 h-36 mx-auto border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-lg">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white dark:bg-gray-800 bg-opacity-80 rounded-full text-red-500 hover:text-red-600"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Повторіть пароль
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Реєстрація..." : "Зареєструватись"}
          </button>

          <div className="mt-4 text-sm text-center">
            Вже є аккаунт?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Вхід
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
