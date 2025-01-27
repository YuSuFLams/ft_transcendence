from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GameLocal
from .serializers import GameLocalSerializer
import json
from rest_framework.permissions import IsAuthenticated , AllowAny


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