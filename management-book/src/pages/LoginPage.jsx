import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validasi login (gunakan backend nanti)
    if (username === "admin" && password === "admin") {
      navigate("/books");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-2 border-gray-300 p-3 mb-4 w-full rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-gray-300 p-3 mb-6 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-3 px-8 w-full rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Masuk
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
