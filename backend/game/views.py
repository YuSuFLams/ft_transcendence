# delete alll game
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import GameLocal
from .serializers import GameLocalSerializer
import json



YELLOW = '\033[93m'
RED = '\033[91m'
GREEN = '\033[92m'
RESET = '\033[0m'

@api_view(['GET'])
def delete_all_game(request):
    obj = GameLocal.objects.all()
    obj.delete()
    return Response({"message": "All data deleted."})


@api_view(['GET'])
def get_all_game(request):
    obj = GameLocal.objects.all()
    serializer = GameLocalSerializer(obj, many=True)
    return Response(serializer.data)