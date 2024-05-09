const express = require("express");
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models");
const { check, validationResult } = require('express-validator');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Director = require("./models").Director;
const cors = require('cors');
let auth = require('./auth');



const Users = Models.User;
const Movies = Models.Movie;
const Directors = Models.Director;
const Genres = Models.Genre;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static("public"));
app.use(morgan('dev'));

// mongoose.connect("mongodb://localhost:27017/moviesDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


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




// READ movies by director name
app.get("/movies/director/:DirectorName", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
      const directorName = req.params.DirectorName;
      console.log("Requested director:", directorName);

      // Find movies directed by the specified director in the database
      const movies = await Movies.find({ "director.name": directorName });

      // Check if movies are found
      if (!movies || movies.length === 0) {
          return res.status(404).json({ error: "Movies directed by the specified director not found" });
      }

      // Send the movies directed by the specified director in the response
      res.status(200).json(movies);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
});



//CREATE New User
app.post('/users', [
    // Input validation here
    check('username', 'Username is required').notEmpty(),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').notEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    const { username, password, email, birthdate } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the user already exists
        const existingUser = await Users.findOne({ username });

        if (existingUser) {
            return res.status(400).send(username + " already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = await Users.create({
            username,
            password: hashedPassword,
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

    if (!user || !user.validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ sub: user._id }, 'MySecretKey2024!', { expiresIn: '1h' });

    // Respond with token
    return res.status(200).json({ message: 'Login successful', token,user:user });
  } catch (error) {
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


  
  // Update user data
app.put(
  "/users/:Username",
  [
    // Input validation here
    check('username', 'Username is required').notEmpty(),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').notEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
    passport.authenticate("jwt", { session: false }),
  ],
  async (req, res) => {
    // Check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Check if the authenticated user is the same as the user being updated
    if (req.user.username !== req.params.Username) {
      return res.status(403).json({ error: "Permission denied. You can only update your own user data." });
    }

    // Hash the password before updating the user's information
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update the user data with hashed password
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { username: req.params.Username },
        {
          $set: {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            favoriteMovies: req.body.favoriteMovies,
            birthday: req.body.birthday
          }
        },
        { new: true }
      );

      // After updating the user's information, generate a new JWT token
      const token = jwt.sign({ sub: updatedUser._id }, 'MySecretKey2024!', { expiresIn: '1h' });

      // Construct response object with updated user and token
      return res.status(200).json({ message: 'User information updated successfully', user: updatedUser, token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);



// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { username: req.params.Username },
      {
        $push: { favoriteMovies: req.params.MovieID },
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
    try {
      const deletedUser = await Users.findOneAndDelete({ username: req.params.Username });
      if (!deletedUser) {
        return res.status(404).send(req.params.Username + " was not found");
      }
      return res.status(200).send(req.params.Username + " was deleted.");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error: " + error);
    }
  }
);


  
  // DELETE favorite movie for user
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const username = req.params.Username;
      const movieID = req.params.MovieID;

      // Find the user by username
      const user = await Users.findOne({ username });

      // If user not found, return error
      if (!user) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the movie exists in the user's favoriteMovies array
      if (!user.favoriteMovies.includes(movieID)) {
        console.error("Movie not found in user's favorites");
        return res.status(404).json({ error: "Movie not found in user's favorites" });
      }

      // Remove the movie from the user's favoriteMovies array
      user.favoriteMovies = user.favoriteMovies.filter(id => id !== movieID);
      await user.save();

      console.log("Favorite movie deleted successfully");
      res.status(200).json(user);
    } catch (error) {
      console.error("Error deleting favorite movie:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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