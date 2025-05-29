import os
import uuid
import shutil
from pyramid.view import view_config, view_defaults
from pyramid.httpexceptions import (
    HTTPOk,
    HTTPCreated,
    HTTPNotFound,
    HTTPBadRequest,
    HTTPNoContent
)
from sqlalchemy.exc import IntegrityError # Untuk menangani error unique constraint

# Sesuaikan path import berdasarkan struktur proyek Anda
from ..models.book import Book

# --- Konfigurasi Direktori Upload untuk Cover Buku ---
CURRENT_FILE_PATH = os.path.abspath(__file__)
VIEWS_DIR = os.path.dirname(CURRENT_FILE_PATH)
# Asumsi struktur: backend_project/backend/views/books.py
# Maka BACKEND_APP_DIR akan menjadi backend_project/backend/
BACKEND_APP_DIR = os.path.dirname(VIEWS_DIR)
# Path untuk menyimpan cover: backend_project/backend/static/covers/
COVER_UPLOAD_DIR = os.path.join(BACKEND_APP_DIR, 'static', 'covers')
# Nama subdirektori di dalam static, digunakan untuk menyimpan path relatif di DB
# dan membangun URL statis
COVER_SUBDIR = 'covers'

# Pastikan direktori upload ada
os.makedirs(COVER_UPLOAD_DIR, exist_ok=True)

def _save_cover_image(cover_file_storage):
    """Helper function untuk menyimpan file cover dan mengembalikan path relatifnya."""
    if (cover_file_storage is not None and
            hasattr(cover_file_storage, 'filename') and
            cover_file_storage.filename and
            hasattr(cover_file_storage, 'file')):

        _filename, ext = os.path.splitext(cover_file_storage.filename)
        unique_filename = f"{uuid.uuid4()}{ext}"
        # Path absolut tempat file akan disimpan di server
        output_path = os.path.join(COVER_UPLOAD_DIR, unique_filename)

        # Salin file yang diupload
        cover_file_storage.file.seek(0)
        with open(output_path, 'wb') as output_f:
            shutil.copyfileobj(cover_file_storage.file, output_f)
        # Kembalikan path relatif untuk disimpan di DB (contoh: 'covers/unique_name.jpg')
        return f'{COVER_SUBDIR}/{unique_filename}'
    return None

def _delete_cover_image(cover_image_path):
    """Helper function untuk menghapus file cover."""
    if cover_image_path:
        # cover_image_path dari DB adalah 'covers/filename.ext'
        # Kita perlu path absolutnya di filesystem
        # Hapus prefix subdir jika sudah ada (misalnya, 'covers/') dari path
        # untuk mendapatkan nama file sebenarnya di direktori COVER_UPLOAD_DIR
        if cover_image_path.startswith(COVER_SUBDIR + '/'):
            actual_filename = cover_image_path[len(COVER_SUBDIR + '/'):]
        else:
            actual_filename = cover_image_path

        full_path = os.path.join(COVER_UPLOAD_DIR, actual_filename)
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
                return True
            except OSError as e:
                print(f"Error deleting cover file {full_path}: {e}") # Log error
                return False
    return False


@view_defaults(renderer='json') # Default renderer untuk semua view di class ini
class BookViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = request.dbsession

    def _get_book_data_from_post(self, existing_book=None):
        """Helper untuk mengambil dan memvalidasi data buku dari request.POST."""
        data = {}
        errors = []

        # Wajib
        data['title'] = self.request.POST.get('title', getattr(existing_book, 'title', None))
        data['isbn'] = self.request.POST.get('isbn', getattr(existing_book, 'isbn', None))
        data['author'] = self.request.POST.get('author', getattr(existing_book, 'author', None))
        data['publisher'] = self.request.POST.get('publisher', getattr(existing_book, 'publisher', None))
        
        publication_year_str = self.request.POST.get('publication_year', str(getattr(existing_book, 'publication_year', '')) if existing_book else None)
        pages_str = self.request.POST.get('pages', str(getattr(existing_book, 'pages', '')) if existing_book else None)
        
        data['language'] = self.request.POST.get('language', getattr(existing_book, 'language', None))
        data['category'] = self.request.POST.get('category', getattr(existing_book, 'category', None))
        
        # Opsional
        data['synopsis'] = self.request.POST.get('synopsis', getattr(existing_book, 'synopsis', None) if existing_book else None)
        if 'synopsis' in self.request.POST and self.request.POST['synopsis'] == '': # Memungkinkan pengosongan sinopsis
             data['synopsis'] = None


        # Validasi dan konversi
        required_fields = ['title', 'isbn', 'author', 'publisher', 'language', 'category']
        if not existing_book: # Hanya cek semua field wajib saat membuat baru
             required_fields.extend(['publication_year', 'pages'])


        for field in required_fields:
            # Jika sedang update, field mungkin tidak ada di POST, jadi ambil dari existing_book
            value_to_check = data.get(field)
            if value_to_check is None and field in ['publication_year', 'pages']: # Kasus khusus untuk tahun dan halaman
                value_to_check = publication_year_str if field == 'publication_year' else pages_str

            if value_to_check is None or str(value_to_check).strip() == '':
                # Untuk update, jika field tidak ada di POST, tidak dianggap error karena akan pakai nilai lama
                if not existing_book or field in self.request.POST:
                    errors.append(f'{field.replace("_", " ").capitalize()} is required.')


        try:
            if publication_year_str and publication_year_str.strip():
                data['publication_year'] = int(publication_year_str)
            elif not existing_book and 'publication_year' not in required_fields: # Jika tidak wajib dan kosong
                 data['publication_year'] = None
            elif existing_book: # Jika update dan tidak diisi, biarkan nilai lama
                 data['publication_year'] = existing_book.publication_year


        except ValueError:
            errors.append('Publication year must be a valid number.')

        try:
            if pages_str and pages_str.strip():
                data['pages'] = int(pages_str)
            elif not existing_book and 'pages' not in required_fields: # Jika tidak wajib dan kosong
                 data['pages'] = None
            elif existing_book: # Jika update dan tidak diisi, biarkan nilai lama
                data['pages'] = existing_book.pages

        except ValueError:
            errors.append('Pages must be a valid number.')

        if errors:
            raise HTTPBadRequest(json_body={'errors': errors})

        # Hapus field yang tidak diisi (untuk update agar tidak menimpa dengan None jika tidak dimaksudkan)
        # Tapi ini sudah ditangani dengan getattr di awal
        return data

    # --- CREATE (Membuat Buku Baru) ---
    @view_config(route_name='api_books_create', request_method='POST')
    def create_book(self):
        try:
            book_data = self._get_book_data_from_post()
            cover_image_file = self.request.POST.get('cover_image') # Nama field di form
            
            # Cek duplikasi ISBN atau Judul (jika ada unique constraint di model)
            # Ini akan lebih baik ditangani oleh database (IntegrityError)
            # tapi bisa juga dicek di sini untuk pesan error yang lebih baik.

            cover_image_path_rel = _save_cover_image(cover_image_file)

            new_book = Book(
                title=book_data['title'],
                isbn=book_data['isbn'],
                author=book_data['author'],
                publisher=book_data['publisher'],
                publication_year=book_data['publication_year'],
                pages=book_data['pages'],
                language=book_data['language'],
                category=book_data['category'],
                synopsis=book_data.get('synopsis'), # Gunakan .get() untuk field opsional
                cover_image_path=cover_image_path_rel
            )
            self.dbsession.add(new_book)
            self.dbsession.flush() # Untuk mendapatkan ID dan menangkap IntegrityError lebih awal

            return HTTPCreated(json_body={
                'message': 'Book created successfully!',
                'book': new_book.to_dict(request=self.request)
            })
        except HTTPBadRequest as e: # Re-raise HTTPBadRequest dari _get_book_data_from_post
            return e
        except IntegrityError as e: # Menangkap error dari unique constraint (misal: ISBN atau judul duplikat)
            self.dbsession.rollback() # Rollback transaksi
            error_detail = str(e.orig) # Detail error dari database driver
            field = "unknown field"
            if "books_isbn_key" in error_detail or "UNIQUE constraint failed: books.isbn" in error_detail:
                field = "ISBN"
            elif "books_title_key" in error_detail or "UNIQUE constraint failed: books.title" in error_detail:
                field = "title"
            return HTTPBadRequest(json_body={'error': f'The {field} already exists.'})
        except KeyError as e: # Seharusnya sudah ditangani oleh _get_book_data_from_post
            return HTTPBadRequest(json_body={'error': f'Missing form field: {e}'})
        except ValueError as e: # Seharusnya sudah ditangani oleh _get_book_data_from_post
            return HTTPBadRequest(json_body={'error': f'Invalid data format: {e}'})
        except Exception as e:
            print(f"Error creating book: {e}")
            import traceback
            traceback.print_exc()
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    # --- READ (Membaca Semua Buku) ---
    @view_config(route_name='api_books_list', request_method='GET')
    def list_books(self):
        try:
            books = self.dbsession.query(Book).order_by(Book.title).all()
            data = [book.to_dict(request=self.request) for book in books]
            return data
        except Exception as e:
            print(f"Error listing books: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    # --- READ (Membaca Satu Buku berdasarkan ID) ---
    @view_config(route_name='api_book_detail', request_method='GET')
    def get_book(self):
        try:
            book_id = int(self.request.matchdict['id'])
            book = self.dbsession.query(Book).get(book_id)
            if book:
                return book.to_dict(request=self.request)
            else:
                return HTTPNotFound(json_body={'error': 'Book not found'})
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'Invalid book ID format'})
        except Exception as e:
            print(f"Error getting book detail: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    # --- UPDATE (Memperbarui Buku berdasarkan ID) ---
    @view_config(route_name='api_book_update', request_method='POST') # Atau PUT
    def update_book(self):
        try:
            book_id = int(self.request.matchdict['id'])
            book = self.dbsession.query(Book).get(book_id)

            if not book:
                return HTTPNotFound(json_body={'error': 'Book not found'})

            updated_data = self._get_book_data_from_post(existing_book=book)
            
            book.title = updated_data['title']
            book.isbn = updated_data['isbn']
            book.author = updated_data['author']
            book.publisher = updated_data['publisher']
            book.publication_year = updated_data['publication_year']
            book.pages = updated_data['pages']
            book.language = updated_data['language']
            book.category = updated_data['category']
            book.synopsis = updated_data.get('synopsis') # Gunakan .get() untuk field opsional

            cover_image_file = self.request.POST.get('cover_image')
            delete_existing_cover = self.request.POST.get('delete_cover_image') == 'true'


            if delete_existing_cover and book.cover_image_path:
                 _delete_cover_image(book.cover_image_path)
                 book.cover_image_path = None
            elif (cover_image_file is not None and
                hasattr(cover_image_file, 'filename') and
                cover_image_file.filename):
                if book.cover_image_path:
                    _delete_cover_image(book.cover_image_path)
                book.cover_image_path = _save_cover_image(cover_image_file)
            
            self.dbsession.flush()
            return HTTPOk(json_body={
                'message': 'Book updated successfully!',
                'book': book.to_dict(request=self.request)
            })
        except HTTPBadRequest as e: # Re-raise HTTPBadRequest dari _get_book_data_from_post
            return e
        except IntegrityError as e:
            self.dbsession.rollback()
            error_detail = str(e.orig)
            field = "unknown field"
            if "books_isbn_key" in error_detail or "UNIQUE constraint failed: books.isbn" in error_detail:
                field = "ISBN"
            elif "books_title_key" in error_detail or "UNIQUE constraint failed: books.title" in error_detail:
                field = "title"
            return HTTPBadRequest(json_body={'error': f'The {field} already exists.'})
        except ValueError as e: # Untuk error konversi ID atau dari _get_book_data_from_post
            return HTTPBadRequest(json_body={'error': f'Invalid data format: {e}'})
        except Exception as e:
            print(f"Error updating book: {e}")
            import traceback
            traceback.print_exc()
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    # --- DELETE (Menghapus Buku berdasarkan ID) ---
    @view_config(route_name='api_book_delete', request_method='DELETE')
    def delete_book(self):
        try:
            book_id = int(self.request.matchdict['id'])
            book = self.dbsession.query(Book).get(book_id)

            if not book:
                return HTTPNotFound(json_body={'error': 'Book not found'})

            if book.cover_image_path:
                _delete_cover_image(book.cover_image_path)

            self.dbsession.delete(book)
            self.dbsession.flush()
            
            return HTTPNoContent()
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'Invalid book ID format'})
        except Exception as e:
            print(f"Error deleting book: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}