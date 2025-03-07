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

python3.10 manage.py makemigrations 
python3.10 manage.py migrate

python3.10 manage.py runserver 0.0.0.0:8000
