<h1 align="center">ExpressJS - Owallet App - RESTfull API</h1>

This RESTfull API is to perform any actions based on request from client app, to get or manipulate data from app's database you need to run some proper request end point based on desired that are provided in our postman documentation. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open the app's directory in CMD or Terminal
2. Type `npm install`
3. Create a new file and name it as **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL using Third-party tool like xampp, etc.
5. Create a database with the name uvies_app, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension you have installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all request end point [here](https://documenter.getpostman.com/view/13803139/TzY68Z3v)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST = localhost // Database host
DB_USER = root
DB_PASS =
PORT = 3004
DB_NAME = owallet_app

SMTP_EMAIL = sender_email
SMTP_PASSWORD = sender_email_password
```

## License

© [Teguh Wicaksono](https://github.com/twicks95/)
