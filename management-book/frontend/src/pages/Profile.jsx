// src/pages/Profile.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:6543/api";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_picture_url: null,
    profile_picture_path: null,
  });

  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [preview, setPreview] = useState(null);
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
  const [deleteExistingPicture, setDeleteExistingPicture] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // <-- State baru untuk loading hapus akun

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        if (user && user.id) {
          setCurrentUserId(user.id);
        } else {
          setError("Data pengguna tidak valid. Silakan login kembali.");
          setIsLoading(false);
          navigate("/login");
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        setError("Gagal memproses data pengguna. Silakan login kembali.");
        setIsLoading(false);
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    } else {
      setError(
        "Anda belum login atau sesi Anda telah berakhir. Silakan login."
      );
      setIsLoading(false);
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) {
      setError("ID Pengguna tidak valid untuk memuat profil.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("authToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || `Gagal mengambil profil: Status ${response.status}`
        );
      }
      const data = await response.json();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        profile_picture_url: data.profile_picture_url || null,
        profile_picture_path: data.profile_picture_path || null,
      });
      setPreview(data.profile_picture_url || null);
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserProfile(currentUserId);
    }
  }, [currentUserId, fetchUserProfile]);

  useEffect(() => {
    if (editing && profile.name !== undefined) {
      setTempProfile({
        name: profile.name,
        email: profile.email,
        phone_number: profile.phone_number,
        address: profile.address,
      });
      setPreview(profile.profile_picture_url);
      setNewProfilePictureFile(null);
      setDeleteExistingPicture(false);
    }
  }, [editing, profile]);

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setDeleteExistingPicture(false);
    }
  };

  const handleSave = async () => {
    if (!currentUserId) {
      setError(
        "Tidak bisa menyimpan profil, ID pengguna tidak ditemukan. Silakan login ulang."
      );
      return;
    }
    setMessage("");
    setError("");
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("name", tempProfile.name);
    formData.append("email", tempProfile.email);
    if (tempProfile.phone_number || tempProfile.phone_number === "")
      formData.append("phone_number", tempProfile.phone_number);
    if (tempProfile.address || tempProfile.address === "")
      formData.append("address", tempProfile.address);

    if (newProfilePictureFile) {
      formData.append("profile_picture", newProfilePictureFile);
    } else if (deleteExistingPicture && profile.profile_picture_path) {
      formData.append("delete_profile_picture", "true");
    }

    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
        method: "POST",
        body: formData,
        headers: headers,
      });
      const result = await response.json();

      if (!response.ok) {
        let errorMessage = `Update gagal: ${response.statusText}`;
        if (result && result.error) {
          errorMessage = result.error;
        } else if (result && result.errors && Array.isArray(result.errors)) {
          errorMessage = result.errors.join(", ");
        }
        setError(errorMessage);
      } else {
        setProfile({
          name: result.user.name,
          email: result.user.email,
          phone_number: result.user.phone_number,
          address: result.user.address,
          profile_picture_url: result.user.profile_picture_url,
          profile_picture_path: result.user.profile_picture_path,
        });
        setPreview(result.user.profile_picture_url || null);
        setEditing(false);
        setMessage("Profil berhasil diperbarui!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");
    setPreview(profile.profile_picture_url || null);
  };

  // --- FUNGSI BARU UNTUK HAPUS AKUN ---
  const handleDeleteAccount = async () => {
    if (!currentUserId) {
      setError("Tidak bisa menghapus akun, ID pengguna tidak ditemukan.");
      return;
    }

    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus akun Anda secara permanen? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      setIsDeleting(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("authToken");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
          method: "DELETE",
          headers: headers,
        });

        if (response.ok || response.status === 204) {
          // 204 No Content adalah sukses untuk DELETE
          // Hapus data pengguna dari localStorage
          localStorage.removeItem("userData");
          localStorage.removeItem("authToken");
          localStorage.removeItem("isLoggedIn"); // Jika ada

          alert("Akun Anda telah berhasil dihapus."); // Notifikasi sederhana
          navigate("/login"); // Arahkan ke halaman login atau landing page
        } else {
          const errData = await response
            .json()
            .catch(() => ({ error: "Gagal menghapus akun." })); // Tangkap jika body bukan JSON
          setError(
            errData.error || `Gagal menghapus akun: Status ${response.status}`
          );
        }
      } catch (err) {
        console.error("Delete account error:", err);
        setError("Terjadi kesalahan saat menghapus akun.");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  // ------------------------------------

  const commonInputClassName =
    "w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";
  const commonTextClassName =
    "p-2 min-h-[2.25rem] text-sm text-gray-700 bg-gray-50 rounded-md border border-transparent break-words whitespace-pre-line";

  if (isLoading && !currentUserId && !error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Memverifikasi sesi...</p>
      </div>
    );
  }

  if (error && profile.name === "") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <p className="text-xl text-red-600 p-8 bg-red-50 rounded-md shadow mb-4">
          {error}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Ke Halaman Login
        </button>
      </div>
    );
  }

  if (isLoading && profile.name === "") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Profil Pengguna
        </h1>
        {/* ... (message dan error handling) ... */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm font-medium">
            {message}
          </div>
        )}
        {error && editing && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm font-medium">
            {error}
          </div>
        )}

        {/* ... (bagian avatar dan input fields tetap sama) ... */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              preview ||
              "https://via.placeholder.com/150/e2e8f0/94a3b8?Text=Foto"
            }
            alt="Avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mb-4 border-4 border-gray-200 shadow-md"
          />
          {editing && (
            <>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 px-4 rounded-md mb-2 transition"
              >
                {" "}
                Ganti Foto{" "}
              </label>
              {profile.profile_picture_path && !newProfilePictureFile && (
                <label className="flex items-center text-xs text-gray-600 mt-1">
                  <input
                    type="checkbox"
                    checked={deleteExistingPicture}
                    onChange={(e) => setDeleteExistingPicture(e.target.checked)}
                    className="mr-1.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  Hapus foto saat ini
                </label>
              )}
            </>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">
              Nama:
            </label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={tempProfile.name || ""}
                onChange={handleChange}
                className={commonInputClassName}
              />
            ) : (
              <p className={commonTextClassName}>{profile.name || "-"}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">
              Email:
            </label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={tempProfile.email || ""}
                onChange={handleChange}
                className={commonInputClassName}
              />
            ) : (
              <p className={commonTextClassName}>{profile.email || "-"}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">
              Nomor Telepon:
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone_number"
                value={tempProfile.phone_number || ""}
                onChange={handleChange}
                className={commonInputClassName}
                placeholder="+62..."
              />
            ) : (
              <p className={commonTextClassName}>
                {profile.phone_number || "-"}
              </p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">
              Alamat:
            </label>
            {editing ? (
              <textarea
                name="address"
                value={tempProfile.address || ""}
                onChange={handleChange}
                className={`${commonInputClassName} resize-none`}
                rows={3}
                placeholder="Masukkan alamat lengkap"
              />
            ) : (
              <p className={commonTextClassName}>{profile.address || "-"}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating || isDeleting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition w-full sm:w-auto disabled:opacity-70"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating || isDeleting}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md shadow-sm transition w-full sm:w-auto"
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                disabled={isDeleting}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-2 px-6 rounded-md shadow-sm transition w-full sm:w-auto"
              >
                Edit Profil
              </button>
              {/* --- TOMBOL HAPUS AKUN BARU --- */}
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || editing} // Disable juga jika sedang mode edit
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Menghapus..." : "Hapus Akun"}
              </button>
              {/* ----------------------------- */}
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition"
          >
            Kembali
          </button>
        </div>
        {/* Blok <style jsx> sudah dihapus */}
      </div>
    </div>
  );
};

export default Profile;
