import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.email) {
      setMessage("Semua kolom harus diisi.");
      return;
    }
    localStorage.setItem(
      "userAccount",
      JSON.stringify({ username: form.username, password: form.password, email: form.email })
    );
    setMessage("Registrasi berhasil, silakan login.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center"
        autoComplete="off"
      >
        <h1 className="text-4xl font-bold mb-8">Register</h1>

        {message && (
          <div className={`mb-4 font-semibold ${message.includes("harus") ? "text-red-600" : "text-green-600"}`}>
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
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
          Daftar
        </button>

        <p className="mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login di sini
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
