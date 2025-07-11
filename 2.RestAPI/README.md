py -m venv .venv

.venv\Scripts\activate.bat

pip install django

python.exe -m pip install --upgrade pip

django-admin startproject storeapi

cd storeapi

py manage.py runserver 4096

py manage.py migrate

py manage.py startapp product

python manage.py makemigrations

python manage.py migrate

py manage.py createsuperuser

admin

Qwerty1-

py manage.py runserver 4096

pip install djangorestframework

## Create React App Vite
```
# npm 7+, extra double-dash is needed:
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev

npm i @reduxjs/toolkit react-redux
```

## Django Cors
```
pip install django-cors-headers
```


## Django working images
```
pip install Pillow
python manage.py makemigrations

python manage.py migrate

py manage.py runserver 4096
```

## Install jwt
```
pip install djangorestframework-simplejwt
```

## Google auth - щоб послати запит на гугл і отримати інформацію про користувача
```
pip install requests
cd storeapi

python manage.py makemigrations
python manage.py migrate
py manage.py runserver 4096
```