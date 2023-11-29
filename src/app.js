const express = require("express");

const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.post("/api/movies", movieControllers.postMovie)

app.put("/api/movies/:id",movieControllers.putMovies)

const usersControllers = require("./controllers/usersControllers");

app.get("/api/users", usersControllers.getUsers);
app.get("/api/users/:id", usersControllers.getUsersById)

app.post("/api/users", usersControllers.postUsers)

app.put("/api/users/:id",usersControllers.updateUser)

module.exports = app;
