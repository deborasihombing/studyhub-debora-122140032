<<<<<<< HEAD
import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  // Inline style animasi fadeIn untuk gambar ilustrasi
  const fadeInStyle = {
    animationName: "fadeIn",
    animationDuration: "1.5s",
    animationFillMode: "forwards",
    animationTimingFunction: "ease-in-out",
    opacity: 0,
    animationDelay: "0s",
  };

  return (
    <>
      {/* Definisi keyframes animasi */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row items-center p-10 gap-10">
          {/* Bagian teks */}
          <div className="flex-1 text-left">
            <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-md mb-6">
              Tentang Aplikasi
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-5 text-justify">
              Aplikasi Manajemen Buku ini dirancang untuk memudahkan pengelolaan koleksi buku pribadi dengan berbagai fitur lengkap dan fungsional yang intuitif dan mudah digunakan.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-5 text-justify">
              Dengan antarmuka sederhana namun powerful, kamu dapat menambah, mengedit, menghapus buku, serta menandai favorit dengan mudah dan cepat.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8 text-justify">
              Kami berharap aplikasi ini membantu kamu menjelajahi dunia literasi secara lebih terorganisir dan menyenangkan setiap hari.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Kembali
            </button>
          </div>

          {/* Bagian ilustrasi */}
          <div className="flex-1 flex justify-center">
            <img
              src="/illustration-about.svg" // Pastikan path gambar benar
              alt="Tentang Aplikasi"
              style={fadeInStyle}
              className="w-80 h-auto"
            />
          </div>
        </div>
      </div>
    </>
=======
const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center px-8 py-24 relative overflow-hidden">
      {/* Pola dekorasi abstrak */}
      <svg
        className="absolute top-0 left-0 w-64 h-64 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad)" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-80 h-80 opacity-20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad2)" />
      </svg>

      <div className="relative z-10 max-w-7xl w-full bg-white bg-opacity-70 backdrop-blur-xl rounded-3xl shadow-2xl p-16 flex flex-col md:flex-row items-center md:items-start gap-12">
        {/* Teks */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-6xl font-extrabold mb-12 text-gray-900 tracking-tight drop-shadow-sm">
            Tentang Aplikasi
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed tracking-wide font-medium">
            Aplikasi Manajemen Buku ini dirancang untuk memudahkan pengelolaan koleksi buku pribadi dengan berbagai fitur lengkap dan fungsional yang intuitif dan mudah digunakan.
          </p>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed tracking-wide font-medium">
            Dengan antarmuka sederhana namun powerful, kamu dapat menambah, mengedit, menghapus buku, serta menandai favorit dengan mudah dan cepat.
          </p>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed tracking-wide font-medium">
            Kami berharap aplikasi ini membantu kamu menjelajahi dunia literasi secara lebih terorganisir dan menyenangkan setiap hari.
          </p>
          <button
            onClick={() => window.history.back()}
            className="relative inline-block px-16 py-5 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold rounded-3xl shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-60"
            aria-label="Kembali ke halaman sebelumnya"
          >
            Kembali
            <span className="absolute top-0 left-0 w-full h-full rounded-3xl border-2 border-white opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></span>
          </button>
        </div>

        {/* Ilustrasi SVG custom */}
        <div className="flex-1 max-w-md w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            stroke="#6b7280" // abu-abu modern
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-auto drop-shadow-md"
          >
            <rect x="8" y="12" width="48" height="40" rx="4" ry="4" />
            <path d="M16 20h32M16 28h32M16 36h20" />
            <path d="M20 44h24" />
            <circle cx="44" cy="48" r="4" />
          </svg>
        </div>
      </div>
    </section>
>>>>>>> ae07752ed7b289091b74b3eb1ae231b550ccb973
  );
};

export default About;
