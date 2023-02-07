# ACME-EXPLORER

Students: Ole Løkken, Mathias Myrold, Håvard Tysland

## Setup

1. In MongoDB Compass set up a new connection and with authentication where username=`<username>` and password=`<password>`. The URI should be to `mongodb://localhost:27017`. Make sure the username and password defineed in `mongo.Dockefile` is equal to the username and password in the `CONNECTIONSTRING` in `.env`.
2. While in a terminal in the root of the project run the command `docker compose up`. This will set up the connection to the MongoDB database and start the node server. You should have two containers running: `db` and `api`.
3. If you want to run the node server locally, you first need to edit the environment variables in .env. In `CONNECTIONSTRING` change `host.docker.internal` to `localhost`. Still in the root of the project, run the command `npm start` to start the node server, or `npm run dev` to start the server with hot reload using nodemon.

## Documentation with Swagger

All endpoints have been documented can be viewed at `localhost:8080/docs`. Some endpoints require authorization. This can be recieved by creating an actor and manually (in the database) changing the actor to become an administrator by changing the role to `"ADMINISTRATOR"`. Afterwards use the login endpoint to recieve a token, and then press the `Authorize` and paste in the token under value.

## Model

<img src="./assets/model.png">
