import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?library')" }}></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 text-center text-white px-6 sm:px-12">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">Selamat Datang di Manajemen Buku</h1>
        <p className="text-lg sm:text-2xl mb-8">Kelola koleksi buku Anda dengan mudah. Tambahkan, edit, dan hapus buku sesuai kebutuhan.</p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
};

export default Home;
