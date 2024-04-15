require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

const app = express();
const Users = Models.User;
const Movies = Models.Movie;
const Directors = Models.Director;
const Genres = Models.Genre;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static("public"));
app.use(morgan('dev'));

mongoose.connect("mongodb://localhost:27017/moviesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      console.log("${username} ${password}");
      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password",
            });
          }
          console.log("finished");
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

console.log('ExtractJWT.fromAuthHeaderAsBearerToken():', ExtractJWT.fromAuthHeaderAsBearerToken());

// Configure JWT Strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "MySecretKey2024!" // Correct secret key
    },
    async (jwtPayload, callback) => {
      console.log('JWT Payload:', jwtPayload);
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);




//READ
app.get("/", (req, res) => {
    res.send("Welcome to my movie page!");
  });
  // READ user list
  app.get("/users", async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });
  // READ user by username
  app.get("/users/:Username", async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });
  
 // Protected route to get movie list
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send('Error fetching movies');
  }
});


const jwtSecret = process.env.JWT_SECRET || 'MySecretKey2024!'; 

  
  //READ movie list by movie title
  app.get(
    "/movies/:Title",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
          res.json(movie);
        })
        .catch((err) => {
          res.status(500).send("Error: " + err);
        });
    }
  );
  
  //READ genre by name
  app.get(
    "/movies/genres/:Genre",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Movies.findOne({ "Genre.Name": req.params.Genre })
        .then((movie) => {
          res.status(200).json(movie.Genre.Description);
        })
        .catch((err) => {
          res.status(500).send("Error: " + err);
        });
    }
  );
  
  // READ director by name [UPDATED]
  app.get(
    "/movies/directors/:Director",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Movies.findOne({ "Director.Name": req.params.Director })
        .then((movie) => {
          res.status(200).json(movie.Director);
        })
        .catch((err) => {
          res.status(500).send("Error: " + err);
        });
    }
  );
  
 //CREATE New User
 app.post('/users', async (req, res) => {
    const { username, password, email, birthdate } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await Users.findOne({ username });

        if (existingUser) {
            return res.status(400).send(username + " already exists");
        }

        // Create a new user
        const newUser = await Users.create({
            username,
            password,
            email,
            birthdate,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
    }
});

  
  // Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find the user in the database
      const user = await Users.findOne({ username });

      // Debugging using console.log()
      console.log('User:', user);

      // If user not found, send error response
      if (!user) {
          return res.status(400).json({ error: 'Invalid username or password' });
      }

      // Check if the provided password matches the stored password
      if (user.password !== password) {
          return res.status(400).json({ error: 'Invalid username or password' });
      }

      // If username and password are correct, generate JWT token
      const token = jwt.sign({ username: user.username }, 'MySecretKey2024!');

      // Construct response object
      res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
      // Error handling
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Something went wrong during login' });
  }
});

  
  //UPDATE User's username
  app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    // CONDITION ENDS
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        })
});

// Add a movie to a user's list of favorites
app.post(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $push: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
      ) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
  );
  
  // Delete a user by username
  app.delete(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
          if (!user) {
            res.status(400).send(req.params.Username + " was not found");
          } else {
            res.status(200).send(req.params.Username + " was deleted.");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
  );
  
  // DELETE favorite movie for user
  app.delete(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $pull: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
      ) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
  );
  
  // Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Listening for Requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});     