from pyramid.config import Configurator
from pyramid.events import NewRequest # <--- Impor NewRequest dari template
from pyramid.response import Response # <--- Impor Response dari template

# Fungsi ini akan dipanggil untuk setiap request baru (dari template)
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        # Tambahkan header CORS ke SETIAP respons
        # Pastikan origin ini sesuai dengan tempat frontend Anda berjalan
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173', # <-- Origin frontend Anda
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Requested-With', # Tambahkan header lain jika frontend mengirimnya
            'Access-Control-Allow-Credentials': 'true', # Izinkan cookies/auth jika perlu
            'Access-Control-Max-Age': '1728000', # Cache preflight response (opsional, tapi bagus)
        })
    # Daftarkan callback yang akan dieksekusi sebelum respons dikirim
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2') # Jika Anda menggunakannya
        config.include('.models')
        config.include('.routes')     # Ini akan memuat definisi rute Anda, 
                                      # termasuk rute OPTIONS dan pemindaian view di dalamnya

        # --- TAMBAHKAN SUBSCRIBER CORS DARI TEMPLATE ---
        config.add_subscriber(add_cors_headers_response_callback, NewRequest)
        # ---------------------------------------------

        # config.scan() di sini kemungkinan besar tidak diperlukan lagi
        # karena Anda sudah melakukan scan yang lebih spesifik di dalam '.routes'
        # (misalnya, config.scan('.views.books'), config.scan('.views.movies'), dll.)
        # Jika Anda yakin semua view dan item lain yang perlu di-scan sudah dicakup
        # oleh config.include('.routes'), Anda bisa menghapus atau mengomentari baris config.scan() di bawah ini.
        # Jika Anda memiliki subscribers atau views lain di luar struktur .views.xxx yang di-scan
        # oleh .routes, maka Anda mungkin masih memerlukannya.
        # Untuk saat ini, saya akan mengomentarinya berdasarkan praktik umum dan catatan template.
        # config.scan() 

    return config.make_wsgi_app()