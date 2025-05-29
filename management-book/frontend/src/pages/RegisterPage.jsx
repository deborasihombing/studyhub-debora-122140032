<<<<<<< HEAD
// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:6543/api"; // Pastikan URL ini benar

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // <-- Tambahkan password
    confirmPassword: "", // <-- Tambahkan konfirmasi password
    phone_number: "",
    address: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Nama, Email, Password, dan Konfirmasi Password harus diisi.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password dan Konfirmasi Password tidak cocok.");
      setIsLoading(false);
      return;
    }

    // Password minimal 6 karakter (contoh validasi sederhana)
    if (formData.password.length < 6) {
      setMessage("Password minimal harus 6 karakter.");
      setIsLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password); // <-- Kirim password ke backend
    if (formData.phone_number)
      dataToSend.append("phone_number", formData.phone_number);
    if (formData.address) dataToSend.append("address", formData.address);
    if (profilePictureFile)
      dataToSend.append("profile_picture", profilePictureFile);

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        // Endpoint create user
        method: "POST",
        body: dataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = `Registrasi gagal: ${response.statusText}`;
        if (result && result.error) {
          errorMessage = result.error;
        } else if (result && result.errors && Array.isArray(result.errors)) {
          errorMessage = result.errors.join(", ");
        }
        setMessage(errorMessage);
      } else {
        setMessage(
          "Registrasi berhasil! Anda akan diarahkan ke halaman login."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Terjadi kesalahan saat registrasi. Periksa koneksi atau coba lagi nanti."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-lg w-full text-center"
        autoComplete="off"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
          Buat Akun Baru
        </h1>

        {message && (
          <div
            className={`mb-6 p-3 rounded-md text-sm font-medium ${
              message.includes("gagal") ||
              message.includes("harus") ||
              message.includes("kesalahan") ||
              message.includes("cocok") ||
              message.includes("minimal")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
            {message}
          </div>
        )}

        <input
          type="text"
<<<<<<< HEAD
          name="name"
          placeholder="Nama Lengkap (Wajib)"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
=======
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
          required
        />

        <input
          type="email"
          name="email"
<<<<<<< HEAD
          placeholder="Email (Wajib)"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
        />

        {/* Input Password BARU */}
        <input
          type="password"
          name="password"
          placeholder="Password (Wajib, min. 6 karakter)"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
          autoComplete="new-password"
        />

        {/* Input Konfirmasi Password BARU */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password (Wajib)"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          required
          autoComplete="new-password"
        />

        <input
          type="tel"
          name="phone_number"
          placeholder="Nomor Telepon (Opsional)"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <textarea
          name="address"
          placeholder="Alamat (Opsional)"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
        />
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto Profil (Opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>

        <p className="mt-8 text-gray-600 text-sm">
=======
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
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
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
