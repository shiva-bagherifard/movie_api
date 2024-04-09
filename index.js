const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models");
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/moviesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Return a list of ALL movies to the user
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await Movies.findOne({ Title: req.params.title });
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get("/genres/:name", async (req, res) => {
  try {
    const genre = await Movies.findOne({ "Genre.Name": req.params.name });
    res.status(200).json(genre.Genre);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Return data about a director (bio, birth year, death year) by name
app.get("/directors/:name", async (req, res) => {
  try {
    const director = await Movies.findOne({ "Director.Name": req.params.name });
    res.status(200).json(director.Director);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Allow new users to register
app.post("/users/register", async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Allow users to add a movie to their list of favorites
app.post("/users/:id/favorites/add", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, { $push: { FavoriteMovies: req.body.movieId } }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Allow users to remove a movie from their list of favorites
app.delete("/users/:id/favorites/remove", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, { $pull: { FavoriteMovies: req.body.movieId } }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Allow existing users to deregister
app.delete("/users/:id/delete", async (req, res) => {
  try {
    await Users.findByIdAndRemove(req.params.id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  }
});

// Documentation endpoint
app.get("/documentation", (req, res) => {
  res.sendFile(__dirname + "/documentation.html");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
