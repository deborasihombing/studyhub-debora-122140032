# 📚 Management Book Web App

Website manajemen buku berbasis **React JS** (Frontend) dan **Python Pyramid + PostgreSQL** (Backend) sebagai proyek akhir individu untuk mata kuliah **Pemrograman Web**.

---

## 👤 Nama & NIM

**Nama:** Debora Sihombing
**NIM:** 122140032

---

## 📝 Deskripsi Aplikasi

Aplikasi ini digunakan untuk mengelola daftar buku secara online. Setiap pengguna dapat menambahkan, mengedit, menghapus, dan menandai buku sebagai favorit. Aplikasi ini juga mendukung pencarian buku secara real-time, pengelompokan kategori, dan penyimpanan data secara persisten.

---

## ⚙️ Teknologi & Dependensi

### 🖼️ Frontend (React JS)
- `react` — Library UI utama
- `react-router-dom` — Navigasi antar halaman
- `react-toastify` — Notifikasi toast interaktif
- `tailwindcss` — Styling modern dan responsif
- `axios` — Komunikasi HTTP ke backend
- `localStorage` — Penyimpanan data lokal
- `context-api` / `redux-toolkit` *(opsional)* — Manajemen state global (user login)

### 🐍 Backend (Python Pyramid)
- `pyramid` — Web framework utama
- `pyramid_restful` — Membuat API REST
- `sqlalchemy` — ORM untuk PostgreSQL
- `psycopg2` — Driver PostgreSQL
- `cornice` / `marshmallow` *(jika digunakan)* — Validasi input

### 🛢️ Database
- **PostgreSQL** — Menyimpan data buku dan user

---

## 🔑 Fitur Aplikasi

### 📚 Entitas 1: Buku
- [x] Tambah buku
- [x] Edit data buku
- [x] Hapus buku
- [x] Tandai favorit
- [x] Pencarian real-time
- [x] Kategori buku (Fiksi, Teknologi, dsb)
- [x] Tanggal ditambahkan otomatis
- [x] Notifikasi saat tambah/edit/hapus

### 👤 Entitas 2: User (Opsional)
- [ ] Login user
- [ ] Buku per user (autentikasi)
- [ ] Logout dan proteksi halaman

---

## 📦 Cara Menjalankan

### ▶️ Jalankan Frontend (React)

```bash
cd management-book
npm install
npm run dev
