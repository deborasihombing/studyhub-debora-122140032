import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Data profil awal, bisa ambil dari localStorage atau API
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "",
    address: "",
    avatar: null,
    darkMode: false,
  });

  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [preview, setPreview] = useState(profile.avatar);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Sinkronisasi tempProfile saat edit berubah
  useEffect(() => {
    setTempProfile(profile);
    setPreview(profile.avatar);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setTempProfile({ ...tempProfile, [name]: checked });
    } else {
      setTempProfile({ ...tempProfile, [name]: value });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempProfile({ ...tempProfile, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (password || confirmPassword) {
      if (!validatePasswords()) return;
      // Tambahkan logika update password jika perlu
    }
    setProfile(tempProfile);
    setPassword("");
    setConfirmPassword("");
    setEditing(false);
    setMessage("Profil berhasil diperbarui!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setPreview(profile.avatar);
    setPassword("");
    setConfirmPassword("");
    setEditing(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profil Pengguna</h1>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
        )}

        <div className="flex flex-col items-center mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-4 border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4 border">
              <span className="text-3xl text-gray-600">👤</span>
            </div>
          )}
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mb-4"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nama:</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={tempProfile.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Email:</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Nomor Telepon:</label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={tempProfile.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="+62..."
              />
            ) : (
              <p>{profile.phone || "-"}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-1">Alamat:</label>
            {editing ? (
              <textarea
                name="address"
                value={tempProfile.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 resize-none"
                rows={3}
                placeholder="Masukkan alamat lengkap"
              />
            ) : (
              <p>{profile.address || "-"}</p>
            )}
          </div>

          {editing && (
            <>
              <div>
                <label className="block font-semibold mb-1">Password Baru:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Isi jika ingin ganti password"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Konfirmasi Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="Konfirmasi password baru"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3 mt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="darkMode"
                checked={tempProfile.darkMode}
                onChange={handleChange}
                disabled={!editing}
              />
              Aktifkan Mode Gelap
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded hover:bg-yellow-500 transition"
              >
                Edit Profil
              </button>
            </>
          )}
        </div>

        {/* Tombol Kembali */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/books")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Kembali ke Manajemen Buku
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
