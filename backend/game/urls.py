# users/urls.py
from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from .views import GameLocalView

urlpatterns = [
    # path('delete-all-game/', , name='delete-all-game'),
    path('get-all-game/', GameLocalView.as_view(), name='get-all-game'),
]

