import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Kelola Koleksi Bukumu Dengan Mudah",
    description: "Tambah, edit, dan hapus buku kapan saja, di mana saja.",
    image: "https://source.unsplash.com/1600x900/?books,library",
  },
  {
    title: "Cari Buku Favoritmu",
    description: "Filter dan tandai buku favorit untuk akses cepat.",
    image: "https://source.unsplash.com/1600x900/?reading",
  },
  {
    title: "Aman dan Terpercaya",
    description: "Sistem login aman dan fitur manajemen yang handal.",
    image: "https://source.unsplash.com/1600x900/?security",
  },
];

const LandingPage = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center items-center text-center text-white px-6">
            <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl max-w-2xl mb-8">{slide.description}</p>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded text-lg font-semibold transition"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
