# users/urls.py
from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from .views import delete_all_game, get_all_game, TournamentLocalCreate, GetTournamentLocalById, GetTournamentLocalMatchById

urlpatterns = [
    path('delete-all-game/', delete_all_game, name='delete-all-game'),
    path('get-all-game/', get_all_game, name='get-all-game'),
    path('local-tournament/', TournamentLocalCreate.as_view(), name='localTournament'),
    path('local-tournament/<int:id>/', GetTournamentLocalById.as_view(), name='localTournamentById'),
    path('local-tournament/match/<int:id>/<int:match_id>/', GetTournamentLocalMatchById.as_view(), name='localTournamentMatchById')
]

