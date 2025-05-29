// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:6543/api"; // Pastikan URL ini benar

const LoginPage = () => {
  const navigate = useNavigate();
  // Ubah 'username' menjadi 'email' agar sesuai dengan model User backend
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!form.email || !form.password) {
      setMessage("Email dan password harus diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        // Panggil endpoint login backend
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Kirim data sebagai JSON
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json(); // Backend harus mengembalikan JSON

      if (!response.ok) {
        setMessage(result.error || `Login gagal: ${response.statusText}`);
      } else {
        // Login berhasil, backend seharusnya mengembalikan token dan/atau data user
        localStorage.setItem("authToken", result.token); // Simpan token
        localStorage.setItem("userData", JSON.stringify(result.user)); // Simpan data user
        // Set isLoggedIn flag (opsional jika Anda menggunakan token untuk cek status login)
        localStorage.setItem("isLoggedIn", "true");

        setMessage("Login berhasil, mengarahkan...");
        setTimeout(() => {
          navigate("/books"); // Arahkan ke halaman dashboard/buku setelah login
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        "Terjadi kesalahan saat login. Periksa koneksi atau coba lagi nanti."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center"
        autoComplete="off"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
          Login ke Akun Anda
        </h1>

        {message && (
          <div
            className={`mb-6 p-3 rounded-md text-sm font-medium ${
              message.includes("gagal") ||
              message.includes("salah") ||
              message.includes("harus") ||
              message.includes("kesalahan")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email" // Diubah ke tipe email
          name="email" // Diubah dari username menjadi email
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>

        <p className="mt-8 text-gray-600 text-sm">
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
