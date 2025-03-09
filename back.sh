#!bin/sh

# Start the back-end server
cd backend 
rm */__pycache__/*
deactivate

rm -rf env

#i am using port 6370 cause in linux 6379 is already in use
docker run -d -it --rm --name redis -p 6370:6379 redis:7.4  

python3.10 -m venv env
source env/bin/activate
python3.10 -m pip install --upgrade pip
python3.10 -m pip install -r requirements.txt

python3.10 manage.py makemigrations users
python3.10 manage.py makemigrations game
python3.10 manage.py makemigrations tournament
python3.10 manage.py makemigrations
python3.10 manage.py migrate

# echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('buddha', 'buddha@buddha.com', 'buddha')" | python3.10 manage.py shell

python3.10 manage.py runserver 0.0.0.0:8000