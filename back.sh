#!bin/sh

# Start the back-end server
cd backend 
rm */__pycache__/*
deactivate

rm -rf env

docker run -d -it --rm --name redis -p 6379:6379 redis:7.4

python3.13 -m venv env
source env/bin/activate
python3.13 -m pip install --upgrade pip
python3.13 -m pip install -r requirements.txt

python3.13 manage.py makemigrations
python3.13 manage.py migrate

python3.13 manage.py runserver 0.0.0.0:8000