#!/bin/bash

cd /root/

python3.13 -m venv env || (echo 'Cannot fint venv' && exit 1)

source /root/env/bin/activate || (echo 'failed to activate the venv' && exit 1)

python -m pip install -r requirements.txt || (echo 'failed to install the requirement' && exit 1)
python manage.py makemigrations || (echo 'failed to makemig' && exit 1)
python manage.py migrate || (echo 'failed to migrate' && exit 1)

python manage.py runserver 0.0.0.0:8000 || (echo 'failed to start the server' && exit 1)
echo "[+] Srv started 8000"