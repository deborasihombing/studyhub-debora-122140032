import os
import uuid
import shutil
from pyramid.view import view_config, view_defaults
from pyramid.httpexceptions import (
    HTTPOk,
    HTTPCreated,
    HTTPNotFound,
    HTTPBadRequest,
    HTTPNoContent,
    HTTPUnauthorized # <-- Tambahkan HTTPUnauthorized untuk error login
)
from sqlalchemy.exc import IntegrityError # Untuk menangani error unique constraint

# Sesuaikan path import berdasarkan struktur proyek Anda
from ..models.user import User # <-- IMPORT MODEL USER

# --- Konfigurasi Direktori Upload untuk Foto Profil ---
CURRENT_FILE_PATH = os.path.abspath(__file__)
VIEWS_DIR = os.path.dirname(CURRENT_FILE_PATH)
BACKEND_APP_DIR = os.path.dirname(VIEWS_DIR) # Asumsi ini adalah direktori 'backend' utama Anda

# Path untuk menyimpan foto profil: backend/static/profile_pics/
PROFILE_PICTURE_UPLOAD_DIR = os.path.join(BACKEND_APP_DIR, 'static', 'profile_pics')
# Nama subdirektori di dalam static, digunakan untuk menyimpan path relatif di DB
PROFILE_PICTURE_SUBDIR = 'profile_pics'

# Pastikan direktori upload ada
os.makedirs(PROFILE_PICTURE_UPLOAD_DIR, exist_ok=True)

def _save_profile_picture(profile_picture_file_storage):
    """Helper function untuk menyimpan file foto profil dan mengembalikan path relatifnya."""
    if (profile_picture_file_storage is not None and
            hasattr(profile_picture_file_storage, 'filename') and
            profile_picture_file_storage.filename and
            hasattr(profile_picture_file_storage, 'file')):

        _filename, ext = os.path.splitext(profile_picture_file_storage.filename)
        unique_filename = f"{uuid.uuid4()}{ext}"
        output_path = os.path.join(PROFILE_PICTURE_UPLOAD_DIR, unique_filename)

        profile_picture_file_storage.file.seek(0)
        with open(output_path, 'wb') as output_f:
            shutil.copyfileobj(profile_picture_file_storage.file, output_f)
        return f'{PROFILE_PICTURE_SUBDIR}/{unique_filename}'
    return None

def _delete_profile_picture(profile_picture_path):
    """Helper function untuk menghapus file foto profil."""
    if profile_picture_path:
        if profile_picture_path.startswith(PROFILE_PICTURE_SUBDIR + '/'):
            actual_filename = profile_picture_path[len(PROFILE_PICTURE_SUBDIR + '/'):]
        else:
            actual_filename = profile_picture_path

        full_path = os.path.join(PROFILE_PICTURE_UPLOAD_DIR, actual_filename)
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
                return True
            except OSError as e:
                print(f"Error deleting profile picture file {full_path}: {e}")
                return False
    return False


@view_defaults(renderer='json')
class UserViews:
    def __init__(self, request):
        self.request = request
        self.dbsession = request.dbsession

    def _get_user_data_from_post(self, existing_user=None):
        """Helper untuk mengambil dan memvalidasi data user dari request.POST."""
        data = {}
        errors = []

        data['name'] = self.request.POST.get('name', getattr(existing_user, 'name', None))
        if not data['name'] or not data['name'].strip():
            if not existing_user or 'name' in self.request.POST:
                errors.append('Name is required.')

        data['email'] = self.request.POST.get('email', getattr(existing_user, 'email', None))
        if not data['email'] or not data['email'].strip():
            if not existing_user or 'email' in self.request.POST:
                errors.append('Email is required.')
        elif data['email'] and "@" not in data['email']:
            errors.append('Invalid email format.')

        phone_number_from_post = self.request.POST.get('phone_number')
        if phone_number_from_post is not None:
            if phone_number_from_post.strip() == "":
                data['phone_number'] = None
            else:
                data['phone_number'] = phone_number_from_post.strip()
        elif existing_user:
            data['phone_number'] = existing_user.phone_number
        else:
            data['phone_number'] = None

        address_from_post = self.request.POST.get('address')
        if address_from_post is not None:
            if address_from_post.strip() == "":
                data['address'] = None
            else:
                data['address'] = address_from_post.strip()
        elif existing_user:
            data['address'] = existing_user.address
        else:
            data['address'] = None

        if errors:
            raise HTTPBadRequest(json_body={'errors': errors})
        
        return data

    @view_config(route_name='api_users_create', request_method='POST')
    def create_user(self):
        try:
            user_data = self._get_user_data_from_post()
            password_from_request = self.request.POST.get('password')
            if not password_from_request:
                raise HTTPBadRequest(json_body={'error': 'Password is required.'})

            profile_picture_file = self.request.POST.get('profile_picture')
            profile_picture_path_rel = _save_profile_picture(profile_picture_file)

            new_user = User(
                name=user_data['name'],
                email=user_data['email'],
                phone_number=user_data.get('phone_number'),
                address=user_data.get('address'),
                profile_picture_path=profile_picture_path_rel
            )
            new_user.set_password(password_from_request) 

            self.dbsession.add(new_user)
            self.dbsession.flush()

            return HTTPCreated(json_body={
                'message': 'User created successfully!',
                'user': new_user.to_dict(request=self.request) 
            })
        except HTTPBadRequest as e:
            return e
        except IntegrityError as e:
            self.dbsession.rollback()
            error_detail = str(e.orig).lower()
            field = "unknown field"
            if "users_email_key" in error_detail or "unique constraint failed: users.email" in error_detail:
                field = "Email"
            elif "users_phone_number_key" in error_detail or "unique constraint failed: users.phone_number" in error_detail:
                field = "Phone number"
            return HTTPBadRequest(json_body={'error': f'The {field} already exists or is invalid.'})
        except Exception as e:
            print(f"Error creating user: {e}")
            import traceback
            traceback.print_exc()
            if self.dbsession.is_active:
                self.dbsession.rollback()
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}
        
    @view_config(route_name='api_users_list', request_method='GET')
    def list_users(self):
        # ... (kode list_users Anda yang sudah ada) ...
        try:
            users = self.dbsession.query(User).order_by(User.name).all()
            data = [user.to_dict(request=self.request) for user in users]
            return data
        except Exception as e:
            print(f"Error listing users: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    @view_config(route_name='api_user_detail', request_method='GET')
    def get_user(self):
        # ... (kode get_user Anda yang sudah ada) ...
        try:
            user_id = int(self.request.matchdict['id'])
            user = self.dbsession.query(User).get(user_id)
            if user:
                return user.to_dict(request=self.request)
            else:
                return HTTPNotFound(json_body={'error': 'User not found'})
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'Invalid user ID format'})
        except Exception as e:
            print(f"Error getting user detail: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    @view_config(route_name='api_user_update', request_method='POST')
    def update_user(self):
        # ... (kode update_user Anda yang sudah ada) ...
        try:
            user_id = int(self.request.matchdict['id'])
            user = self.dbsession.query(User).get(user_id)

            if not user:
                return HTTPNotFound(json_body={'error': 'User not found'})

            updated_data = self._get_user_data_from_post(existing_user=user)
            
            user.name = updated_data['name']
            user.email = updated_data['email'] # Pertimbangkan apakah email boleh diubah
            user.phone_number = updated_data.get('phone_number')
            user.address = updated_data.get('address')
            
            profile_picture_file = self.request.POST.get('profile_picture')
            delete_existing_picture = self.request.POST.get('delete_profile_picture') == 'true'

            if delete_existing_picture and user.profile_picture_path:
                _delete_profile_picture(user.profile_picture_path)
                user.profile_picture_path = None
            elif (profile_picture_file is not None and
                  hasattr(profile_picture_file, 'filename') and
                  profile_picture_file.filename):
                if user.profile_picture_path:
                    _delete_profile_picture(user.profile_picture_path)
                user.profile_picture_path = _save_profile_picture(profile_picture_file)
            
            # Jika ada logic untuk update password, tambahkan di sini
            # password_from_request = self.request.POST.get('new_password')
            # if password_from_request:
            # user.set_password(password_from_request)

            self.dbsession.flush()
            return HTTPOk(json_body={
                'message': 'User updated successfully!',
                'user': user.to_dict(request=self.request)
            })
        except HTTPBadRequest as e:
            return e
        except IntegrityError as e:
            self.dbsession.rollback()
            error_detail = str(e.orig).lower()
            field = "unknown field"
            if "users_email_key" in error_detail or "unique constraint failed: users.email" in error_detail:
                field = "Email"
            elif "users_phone_number_key" in error_detail or "unique constraint failed: users.phone_number" in error_detail:
                field = "Phone number"
            return HTTPBadRequest(json_body={'error': f'The {field} already exists or is invalid.'})
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'Invalid user ID format'})
        except Exception as e:
            print(f"Error updating user: {e}")
            import traceback
            traceback.print_exc()
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    @view_config(route_name='api_user_delete', request_method='DELETE')
    def delete_user(self):
        # ... (kode delete_user Anda yang sudah ada) ...
        try:
            user_id = int(self.request.matchdict['id'])
            user = self.dbsession.query(User).get(user_id)

            if not user:
                return HTTPNotFound(json_body={'error': 'User not found'})

            if user.profile_picture_path:
                _delete_profile_picture(user.profile_picture_path)

            self.dbsession.delete(user)
            self.dbsession.flush()
            
            return HTTPNoContent()
        except ValueError:
            return HTTPBadRequest(json_body={'error': 'Invalid user ID format'})
        except Exception as e:
            print(f"Error deleting user: {e}")
            self.request.response.status_code = 500
            return {'error': f'An unexpected error occurred: {e}'}

    # --- FUNGSI VIEW LOGIN BARU ---
    @view_config(route_name='api_login', request_method='POST', renderer='json')
    def login(self):
        try:
            # Frontend akan mengirim JSON, jadi kita gunakan request.json_body
            # Pastikan frontend mengirim header Content-Type: application/json
            login_data = self.request.json_body 
            email = login_data.get('email')
            password = login_data.get('password')

            if not email or not password:
                raise HTTPBadRequest(json_body={'error': 'Email and password are required.'})

            user = self.dbsession.query(User).filter(User.email == email).first()

            if user and user.check_password(password):
                # Login berhasil
                # TODO: Implementasi pembuatan token JWT di sini
                # import jwt
                # import datetime
                # SECRET_KEY = self.request.registry.settings.get('jwt.secret_key', 'gantiDenganSecretKeyAnda')
                # payload = {
                #     'user_id': user.id,
                #     'email': user.email,
                #     'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1) # Token berlaku 1 jam
                # }
                # token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
                
                return HTTPOk(json_body={
                    'message': 'Login successful!',
                    'user': user.to_dict(request=self.request),
                    # 'token': token # Kirim token jika sudah diimplementasikan
                })
            else:
                raise HTTPUnauthorized(json_body={'error': 'Invalid email or password.'})

        except ValueError: # Jika request.json_body gagal parse JSON
             # Ini akan terjadi jika frontend tidak mengirim Content-Type: application/json
             # atau body JSON tidak valid.
            return HTTPBadRequest(json_body={'error': 'Invalid request format or missing email/password in JSON body.'})
        except HTTPBadRequest as e: 
            return e
        except HTTPUnauthorized as e: 
            return e
        except Exception as e:
            print(f"Error during login: {e}")
            import traceback
            traceback.print_exc()
            self.request.response.status_code = 500
            return {'error': f'An unexpected server error occurred: {e}'}