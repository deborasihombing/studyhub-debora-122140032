import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      setMessage("Login berhasil, mengarahkan...");
      setTimeout(() => {
        navigate("/books");
      }, 1500);
    } else {
      setMessage("Username atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center"
        autoComplete="off"
      >
        <h1 className="text-4xl font-bold mb-8">Login</h1>

        {message && (
          <div className={`mb-4 font-semibold ${message.includes("salah") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Masuk
        </button>

        <p className="mt-6 text-gray-600">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
