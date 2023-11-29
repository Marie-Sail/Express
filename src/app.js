const express = require("express");

const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");
const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.post("/api/movies",validateMovie, movieControllers.postMovie)
app.put("/api/movies/:id",validateMovie, movieControllers.putMovies)


const usersControllers = require("./controllers/usersControllers");

app.get("/api/users", usersControllers.getUsers);
app.get("/api/users/:id", usersControllers.getUsersById)
app.post("/api/users",validateUser, usersControllers.postUsers)
app.put("/api/users/:id", validateUser, usersControllers.updateUser)






module.exports = app;
