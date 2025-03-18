from .serializers import GameLocalSerializer, TournamentLocalSerializer
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.decorators import api_view
from .models import GameLocal, TournamentLocal
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.http import JsonResponse
import json
# Create your views here.

YELLOW = '\033[93m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'

class GameLocalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj = GameLocal.objects.all()
        serializer = GameLocalSerializer(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def delete_all_game(request):
    try:
        obj = TournamentLocal.objects.all()
        obj.delete()
        return Response({"message": "All data deleted."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])

def get_all_game(request):
    try:
        obj = TournamentLocal.objects.all()
        serializer = TournamentLocalSerializer(obj, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TournamentLocalCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Retrieve data from the request
            data = request.data

            # Extract details from the data
            name = data.get('tournamentName')
            player_names = data.get('playerNames', {})
            num_players = data.get('numberPlayers')
            # Validate the number of players
            if num_players not in [4, 8]:
                return Response(
                    {"error": "Only tournaments with 4 or 8 players are supported."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if len(player_names) != num_players:
                return Response(
                    {"error": f"Expected {num_players} players, but got {len(player_names)}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the tournament instance
            tournament = TournamentLocal.objects.create(
                name=name,
                players=player_names,
                number_players=num_players
            )

            # Generate initial matches
            tournament.generate_matches()

            return Response(
                {"message": "Tournament created successfully!", "tournament_id": tournament.id},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            # Handle any unexpected errors
            print(f"{RED}Error hh: {e}{RESET}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetTournamentLocalById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            tournament = TournamentLocal.objects.get(id=id)
            if not tournament:
                return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
            print(f"Found tournament: {tournament}")
            serializer = TournamentLocalSerializer(tournament)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TournamentLocal.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_400_BAD_REQUEST)

class GetTournamentLocalMatchById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, match_id):
        try:
            # Fetch the tournament
            tournament = TournamentLocal.objects.get(id=id)

            # Assuming `matches` is a dictionary or queryset, handle accordingly
            matches = tournament.matches if tournament else None
            if matches is None:
                return Response({"error": "Matches not found in the tournament"}, status=status.HTTP_404_NOT_FOUND)
            
            # Ensure `matches` allows key access
            match = matches.get(f'{match_id}') if isinstance(matches, dict) else None
            if not match:
                return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
            # Return serialized match data
            return JsonResponse(match, status=status.HTTP_200_OK, safe=False)

        except TournamentLocal.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_400_BAD_REQUEST)


class GameTournamnetLocalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj = TournamentLocal.objects.all()
        serializer = TournamentLocalSerializer(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)