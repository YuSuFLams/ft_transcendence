from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/game', include('game.urls')),
    path('api/tournament/', include('tournament.urls')),
    path('api/chat', include('chat.urls')),
    path('api/users/', include('users.urls')),

    path('', include('users.urls')),

    path('oauth/google/', views.google_oauth2_callback, name='oauth_google_callback'),
    path('oauth/', views.oauth2_42_callback, name='oauth2_42_callback'),

    path('oauth2/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)