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

