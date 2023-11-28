const express = require("express");

const app = express();

const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

const usersControllers = require("./controllers/usersControllers");

app.get("/api/users", usersControllers.getUsers);
app.get("/api/users/:id", usersControllers.getUsersById)

module.exports = app;
