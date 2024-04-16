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
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Director = require("./models").Director;


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
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "MySecretKey2024!" // Correct secret key
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload.sub);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
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
app.get("/movies/:Title", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
      const movie = await Movies.findOne({ title: req.params.Title });
      if (!movie) {
          return res.status(404).json({ error: "Movie not found" });
      }
      res.json(movie);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});



// READ movie by genre name
app.get("/movies/genres/:Genre", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    console.log("Requested genre:", req.params.Genre);
    const movie = await Movies.findOne({ genre: req.params.Genre });
    console.log("Retrieved movie:", movie);
    if (!movie) {
      return res.status(404).json({ error: "No movie found for the genre" });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// READ director by name
app.get("/movies/director/:Director", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const directorName = req.params.Director;
    console.log("Requested director:", directorName);

    // Find the director by name in the database using the Director model
    const director = await Director.findOne({ name: directorName });

    // Check if the director is not found
    if (!director) {
      return res.status(404).json({ error: "Director not found" });
    }

    // Send the director details in the response
    res.status(200).json(director);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});






  
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
      const user = await Users.findOne({ username });

      if (!user || user.password !== password) {
          return res.status(400).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ sub: user._id }, 'MySecretKey2024!', { expiresIn: '1h' });

      // Construct response object
      return res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
      // Error handling
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Something went wrong during login' });
  }
});




// Middleware for token verification
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, 'MySecretKey2024!', (err, decoded) => {
      if (err) {
          return res.status(401).send('Invalid token.');
      }
      req.user = decoded; // Attach decoded payload to request object for later use
      next(); // Move to the next middleware or route handler
  });
}

// Example usage in route handler
app.get('/movies', verifyToken, (req, res) => {
  // Authenticated request, access granted
  res.send('List of movies...');
});

// Middleware for role-based access control
function checkPermissions(req, res, next) {
  const user = req.user; // Assuming the user object is attached by a previous middleware
  
  // Check if the user has the required role or permission
  if (user.role === 'admin') {
      next(); // Access granted for admin users
  } else {
      res.status(403).send('Access denied. Insufficient permissions.');
  }
}

// Example usage in route handler
app.get('/movies', verifyToken, checkPermissions, (req, res) => {
  // Authenticated and authorized request, access granted
  res.send('List of movies...');
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