from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/game', include('game.urls')),
    path('api/chat', include('chat.urls')),

    path('oauth2/', include('users.urls')),
    path('oauth2/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)