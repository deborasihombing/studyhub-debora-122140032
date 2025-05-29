from sqlalchemy import (
    Column,
    Index, # Index tidak digunakan langsung di sini, tapi saya biarkan karena ada di contoh
    Integer,
    Text,  # Untuk sinopsis dan path gambar
    String, # Untuk field dengan panjang terbatas seperti judul, ISBN, dll.
)
from .meta import Base 

class Book(Base):
    """
    Model SQLAlchemy untuk tabel 'books'.
    Sudah cocok untuk digunakan dengan FormData/Upload Gambar.
    """
    __tablename__ = 'books' # Nama tabel di database

    id = Column(Integer, primary_key=True)
    # Gunakan String untuk judul, tapi tambahkan unique=True seperti di contoh Movie
    title = Column(String(255), nullable=False, unique=True)
    isbn = Column(String(13), unique=True, nullable=False) # ISBN harus unik
    author = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=False)
    publication_year = Column(Integer, nullable=False)
    pages = Column(Integer, nullable=False)
    language = Column(String(50), nullable=False)
    category = Column(String(100), nullable=False)
    synopsis = Column(Text, nullable=True) # Text untuk sinopsis yang panjang
    
    # cover_image_path untuk menyimpan path relatif file gambar
    # Gunakan Text atau String(255) yang cukup panjang. Text lebih aman untuk path/URL.
    cover_image_path = Column(Text, nullable=True) 

    def to_dict(self, request=None):
        """
        Mengembalikan representasi dictionary dari objek Book.
        Jika 'request' diberikan, sertakan 'cover_image_url' yang lengkap.
        """
        full_cover_url = None
        # Periksa jika cover_image_path ada DAN objek request diberikan
        if self.cover_image_path and request:
            # Bangun URL lengkap: http://domain:port/static/covers/nama_file.jpg
            # 'backend:static' merujuk ke static view di package 'backend'
            # Kita menggunakan static_url dari request untuk URL yang benar
            full_cover_url = request.static_url(f'backend:static/{self.cover_image_path}')
        
        return {
            'id': self.id,
            'title': self.title,
            'isbn': self.isbn,
            'author': self.author,
            'publisher': self.publisher,
            'publication_year': self.publication_year,
            'pages': self.pages,
            'language': self.language,
            'category': self.category,
            'synopsis': self.synopsis,
            'cover_image_path': self.cover_image_path, # Path relatif di server
            'cover_image_url': full_cover_url, # URL lengkap untuk diakses frontend
        }