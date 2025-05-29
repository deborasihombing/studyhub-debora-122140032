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
  );
};

export default About;
