import bcrypt # <-- Impor bcrypt
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text
)
from .meta import Base

class User(Base):
    """
    Model SQLAlchemy untuk tabel 'users'.
    Menyimpan hash password menggunakan bcrypt.
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone_number = Column(String(20), nullable=True, unique=True)
    address = Column(Text, nullable=True)
    profile_picture_path = Column(Text, nullable=True)
    
    # Kolom untuk menyimpan hash password (dienkripsi)
    # nullable=False berarti password wajib ada saat membuat user baru.
    password_hash = Column(String(255), nullable=False)

    def set_password(self, password):
        """
        Membuat hash dari password dan menyimpannya.
        """
        # Generate salt
        salt = bcrypt.gensalt()
        # Encode password ke bytes, lalu hash dengan salt
        password_bytes = password.encode('utf-8')
        hashed_bytes = bcrypt.hashpw(password_bytes, salt)
        # Simpan hash sebagai string (decode dari bytes)
        self.password_hash = hashed_bytes.decode('utf-8')

    def check_password(self, password):
        """
        Memverifikasi password yang diberikan dengan hash yang tersimpan.
        """
        if self.password_hash is None:
            return False
        password_bytes = password.encode('utf-8')
        stored_hash_bytes = self.password_hash.encode('utf-8')
        return bcrypt.checkpw(password_bytes, stored_hash_bytes)

    def to_dict(self, request=None):
        """
        Mengembalikan representasi dictionary dari objek User.
        Jika 'request' diberikan, sertakan 'profile_picture_url' yang lengkap.
        """
        full_profile_picture_url = None
        if self.profile_picture_path and request:
            full_profile_picture_url = request.static_url(f'backend:static/{self.profile_picture_path}')
        
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'address': self.address,
            'profile_picture_path': self.profile_picture_path,
            'profile_picture_url': full_profile_picture_url,
            # Password hash TIDAK PERNAH disertakan dalam output API
        }