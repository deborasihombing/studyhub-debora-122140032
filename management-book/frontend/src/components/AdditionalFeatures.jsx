import React from "react";

const AdditionalFeatures = ({ books }) => {
  return (
    <section className="mt-10 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Fitur Lainnya</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded hover:shadow-md transition cursor-pointer">
          <h3 className="font-semibold text-lg mb-2">Statistik Koleksi</h3>
          <p>Total Buku: <span className="font-bold">{books.length}</span></p>
          <p>Kategori Terbanyak: <span className="italic">Fiksi</span></p>
        </div>

        <div className="p-4 border rounded hover:shadow-md transition cursor-pointer">
          <h3 className="font-semibold text-lg mb-2">Rekomendasi Buku</h3>
          <p>Dapatkan rekomendasi buku terbaru berdasarkan koleksimu.</p>
        </div>

        <div className="p-4 border rounded hover:shadow-md transition cursor-pointer">
          <h3 className="font-semibold text-lg mb-2">Tips Membaca</h3>
          <p>Pelajari tips untuk meningkatkan pengalaman membaca kamu.</p>
        </div>
      </div>
    </section>
  );
};

export default AdditionalFeatures;
