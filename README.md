### Follow along below to get set up for running Topic Tempest (TT)

#### Start mongo
Coordinates for mongo are in server/src/config.js; defaults to using local
host and default port 27017, database 'tempest'.

#### yarn install
When I ran npm install it errored out. Try yarn install instead. There were a lot
of warnings which I just ignored.

#### Start the TT apollo server in one shell

From main project directory:

```
cd server
node src/index.js
```

#### Start the TT apollo client in another shell

From main project directory:

```
cd client
npm start
```

#### Start your browser

Point your browser to http://localhost:3000. It will load the client app,
which in turn will try to connect to the server which it assumes to be
running on http://localhost:4000.

#### This is just someting to get us started, we can change
Make sure you have the .env file in the frontend folder or else the website will show up blank

**Firebase Auth and React Example**
This project uses React and Firebase Authentication. You will need to put your Firebase credentials into a .env file in the project root as shown in the lecture. The .env file should look like below.

REACT_APP_FIREBASE_KEY = "YOUR FB API KEY"
REACT_APP_FIREBASE_DOMAIN= "YOUR FB DOMAIN"
REACT_APP_FIREBASE_DATABASE = "YOUR FB DB URL"
REACT_APP_FIREBASE_PROJECT_ID = "YOUR FB PROJECT ID"
REACT_APP_FIREBASE_STORAGE_BUCKET ="YOUR FB STORAGE BUCKEY"
REACT_APP_FIREBASE_SENDER_ID = "YOUR FB SENDER ID"
REACT_APP_FIREBASE_APP_ID = "YOUR FB APP ID"

**Login Providers**
Email/Password, Google Sign-in, Facebook Sign-in
