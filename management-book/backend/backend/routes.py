from pyramid.response import Response

# View sederhana untuk OPTIONS (biasanya untuk CORS preflight)
def options_view(request):
    """Mengembalikan respons 204 No Content untuk permintaan OPTIONS."""
    return Response(status_code=204)

def includeme(config):
    """
    Fungsi ini menambahkan semua rute ke konfigurasi Pyramid.
    """
    config.add_static_view('static', 'static', cache_max_age=3600)

    # --- RUTE HOME (JANGAN HILANGKAN) ---
    config.add_route('home', '/')
    # ------------------------------------

    # --- Rute-rute CRUD Books ---
    config.add_route('api_books_create', r'/api/books', request_method='POST')
    config.add_route('api_books_list',   r'/api/books', request_method='GET')
    config.add_route('api_book_detail',  r'/api/books/{id:\d+}', request_method='GET')
    config.add_route('api_book_update',  r'/api/books/{id:\d+}', request_method='POST') # Atau PUT
    config.add_route('api_book_delete',  r'/api/books/{id:\d+}', request_method='DELETE')
    # --------------------------------------------------

    # --- Rute-rute CRUD Users ---
    config.add_route('api_users_create', r'/api/users', request_method='POST')
    config.add_route('api_users_list',   r'/api/users', request_method='GET')
    config.add_route('api_user_detail',  r'/api/users/{id:\d+}', request_method='GET')
    config.add_route('api_user_update',  r'/api/users/{id:\d+}', request_method='POST')
    config.add_route('api_user_delete',  r'/api/users/{id:\d+}', request_method='DELETE')
    
    # --- RUTE LOGIN BARU DITAMBAHKAN ---
    config.add_route('api_login', r'/api/login', request_method='POST')
    # -----------------------------------

    # --- RUTE CATCH-ALL UNTUK CORS OPTIONS ---
    config.add_route('cors_preflight_catch_all', r'/api/{catch_all:.*}', request_method='OPTIONS')
    config.add_view(options_view, route_name='cors_preflight_catch_all')
    # -----------------------------------------

    # --- Scan SEMUA Views Anda ---
    config.scan('.views.default') 
    config.scan('.views.books')   
    config.scan('.views.users')