## Getting started

1. This app is a little different than what you may be accustomed to. You
will need TWO computers to properly experiment with this application because
it involves game play between two parties.

1. You can try using one computer with two completely separate browsers running
(not two tabs but two separate browser processes) but this doesn't work well except
possibly with dual monitors (haven't tried).

1. You should install everything that follows in the next sections on ONE
central server or PC. The Apollo client and Apollo server expect to be running
on ONE, and the same, physical server.

1. You can use this central server also to double as a client, but you will
still then need to find another computer to act as a second client.

1. This application
has only been tested on a Windows Chrome browser environment so in other words
the client computers should not be mobile phones or tablets.

1. Both client computers must be able to access the network of the central
server.

## How to install and setup

1. First unzip the provided package into an ALREADY CREATED clean directory.

1. Start mongodb daemon from wherever you run mongodb.

1. Adjust mongodb coordinates in ```./server/src/config.js```; it defaults to using
localhost on default port of 27017. Database is called **tempest**.

1. There is a client and server that need to be BUILT (AND RUN) SEPARATELY. The client lives
in ```./client``` and the server lives in ```./server```.

### Client setup

1. Do not confuse ***client setup*** with ***client computer*** described previously. They
are not the same.

1. This section pertains to setting up the Apollo client running on http://localhost:3000.

1. The client is a traditional Create React App for Apollo client install so these steps should work.

1. ```cd``` to the ```./client``` directory.

1. Run ```npm install```.

1. It will generate a lot of warnings that you can safely ignore. If for some reason
it errors out you may want to start over and try again or perhaps try ```yarn install```.

1. Client relies on configuration in TWO files that if you instead try to clone and build
from our GitHub project you will not have these files. However the files ARE included in the
submitted ```.zip``` file.

1. These two files are ```.env``` in project root directory and ```./client/src/config.js```.
You do not need to make any changes to these files. They contain some security secrets that
you are hereby entrusted with.

1. You can now start the client via ```npm start``` or wait until you have the server setup
if you want. 

1. To summarize, get the client going with:

```
cd ./client
npm install
npm start
```

### Server setup

1. From main project directory:

```
cd ./server
npm install
node src/index.js
```

#### Start your browser

1. Let's assume that you have done the install to a central server which is actually
just your local PC.

1.  Point your browser to http://localhost:3000. It will load the client app,
which in turn will try to connect to the server which it assumes to be
running on http://localhost:4000.

1. On a second PC, point it at the location of the first PC above. For example, if
the first PC, running both Apollo client and Apollo server, is located at
IP address 10.0.0.85, then on the second PC you will need to point its browser at ```http://10.0.0.85:3000```.

