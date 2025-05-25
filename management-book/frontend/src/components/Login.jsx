import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (username === "admin" && password === "admin") {
      navigate("/books");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-blue-600 to-purple-700">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 rounded w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded w-full mb-6"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
        >
          Masuk
        </button>
      </form>
    </div>
  );
};

export default Login;
