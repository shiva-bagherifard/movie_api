const { error } = require('console');
const express = require('express'),
uuid = require('uuid'),
bodyParser = require('body-parser'),
morgan = require('morgan');
const app = express();

// Logging midleware
app.use(morgan('common'));
app.use(bodyParser.json());

// Users data
let users = [
  {
      "_id": {"$oid": "66140b6e6f2ea9b08b16c9bf"},
      "username": "user1",
      "email": "user1@example.com",
      "password": "password1",
      "birthday": {"$date": "1985-02-19T00:00:00Z"},
      "favoriteMovies": ["Inception", "The Shawshank Redemption", "Interstellar"]
  },
  {
      "_id": {"$oid": "66140b6e6f2ea9b08b16c9c0"},
      "username": "user2",
      "email": "user2@example.com",
      "password": "password2",
      "birthday": {"$date": "1990-05-15T00:00:00Z"},
      "favoriteMovies": ["The Godfather", "The Dark Knight"]
  },
  {
      "_id": {"$oid": "66140b6e6f2ea9b08b16c9c1"},
      "username": "user3",
      "email": "user3@example.com",
      "password": "password3",
      "birthday": {"$date": "1988-09-23T00:00:00Z"},
      "favoriteMovies": ["Pulp Fiction", "Forrest Gump"]
  },
  {
      "_id": {"$oid": "66140b6e6f2ea9b08b16c9c2"},
      "username": "user4",
      "email": "user4@example.com",
      "password": "password4",
      "birthday": {"$date": "1995-11-10T00:00:00Z"},
      "favoriteMovies": ["The Matrix", "Interstellar"]
  }
];


// Movie data
let topMovies = [
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9b5"},
      "title": "Inception",
      "description": "A thief who enters the dreams of others to steal secrets from their subconscious.",
      "genre": "Science Fiction",
      "director": {
          "name": "Christopher Nolan",
          "bio": "Renowned British-American film director, producer, and screenwriter. One of the highest-grossing directors in history."
      },
      "imageUrl": "https://example.com/inception.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9b6"},
      "title": "The Shawshank Redemption",
      "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      "genre": "Drama",
      "director": {
          "name": "Frank Darabont",
          "bio": "Frank Darabont is a Hungarian-American film director, screenwriter, and producer."
      },
      "imageUrl": "https://example.com/shawshank_redemption.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9b7"},
      "title": "The Godfather",
      "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      "genre": "Crime",
      "director": {
          "name": "Francis Ford Coppola",
          "bio": "Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely acclaimed as one of Hollywood's greatest filmmakers."
      },
      "imageUrl": "https://example.com/godfather.jpg",
      "featured": false
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9b8"},
      "title": "The Dark Knight",
      "description": "When the menace known as The Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "genre": "Action",
      "director": {
          "name": "Christopher Nolan",
          "bio": "Renowned British-American film director, producer, and screenwriter. One of the highest-grossing directors in history."
      },
      "imageUrl": "https://example.com/dark_knight.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9b9"},
      "title": "Pulp Fiction",
      "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      "genre": "Crime",
      "director": {
          "name": "Quentin Tarantino",
          "bio": "Quentin Jerome Tarantino is an American film director, screenwriter, producer, and actor. His films are characterized by nonlinear storylines, satirical subject matter, and an aestheticization of violence."
      },
      "imageUrl": "https://example.com/pulp_fiction.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9ba"},
      "title": "Forrest Gump",
      "description": "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
      "genre": "Drama",
      "director": {
          "name": "Robert Zemeckis",
          "bio": "Robert Lee Zemeckis is an American film director, producer, and screenwriter. He is known for his visual effects-driven films, including the Back to the Future trilogy and Forrest Gump."
      },
      "imageUrl": "https://example.com/forrest_gump.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9bb"},
      "title": "The Matrix",
      "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      "genre": "Science Fiction",
      "director": {
          "name": "The Wachowskis",
          "bio": "Lana Wachowski and Lilly Wachowski, known together professionally as the Wachowskis, are American film and television directors, writers, and producers."
      },
      "imageUrl": "https://example.com/matrix.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9bc"},
      "title": "Interstellar",
      "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      "genre": "Science Fiction",
      "director": {
          "name": "Christopher Nolan",
          "bio": "Renowned British-American film director, producer, and screenwriter. One of the highest-grossing directors in history."
      },
      "imageUrl": "https://example.com/interstellar.jpg",
      "featured": true
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9bd"},
      "title": "Fight Club",
      "description": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much, much more.",
      "genre": "Drama",
      "director": {
          "name": "David Fincher",
          "bio": "David Andrew Leo Fincher is an American film director, producer, and music video director. He was nominated for the Academy Award for Best Director for The Curious Case of Benjamin Button and The Social Network."
      },
      "imageUrl": "https://example.com/fight_club.jpg",
      "featured": false
  },
  {
      "_id": {"$oid": "66140a6f6f2ea9b08b16c9be"},
      "title": "Goodfellas",
      "description": "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
      "genre": "Crime",
      "director": {
          "name": "Martin Scorsese",
          "bio": "Martin Charles Scorsese is an American film director, producer, screenwriter, and actor. One of the major figures of the New Hollywood era, he is widely regarded as one of the greatest directors in the history of cinema."
      },
      "imageUrl": "https://example.com/goodfellas.jpg",
      "featured": false
  }
];

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};
app.use(myLogger);
app.get('/', (req, res) => {
  res.send('Welcome to cine-verse API');
});

// READ   --  Users route
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// CREATE
app.post('/users', (req, res)=>{
    const newUser = req.body;
    if (newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);

        res.status(201).json(newUser);
    } else{
        res.status(400).send('users need names');
    } 
});

// UPDATE
app.put('/users/:id', (req, res)=>{
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user._id.$oid === id); // Correct comparison

  if (user){
      user.username = updatedUser.username; // Updated to match the field name in user data
      res.status(200).json(user);
  } else{
      res.status(400).send('no such user');
  }
});


// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  // Check if the user exists in the array
  const user = users.find(user => user._id.$oid === id);

  if (user) {
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
      res.status(400).send('no such user');
  }
});


// DELETE
app.delete('/users/:id/:movieTitle', (req, res)=>{
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user){
        user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}\'s array`);
    } else{
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  console.log(`Attempting to delete user with ID: ${id}`);

  // Find the index of the user in the users array
  const userIndex = users.findIndex(user => user._id.$oid === id);

  console.log(`User index: ${userIndex}`);

  if (userIndex !== -1) {
      // Remove the user from the users array
      users.splice(userIndex, 1);
      res.status(200).send(`User with ID ${id} has been deleted`);
  } else {
      res.status(400).send('No such user');
  }
});




// DELETE
app.delete('/users/:id/favorites/remove/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  // Find the user by ID
  const user = users.find(user => user._id.$oid === id);

  if (user) {
      // Check if the movie exists in the user's favoriteMovies array
      const movieIndex = user.favoriteMovies.indexOf(movieTitle);
      if (movieIndex !== -1) {
          // Remove the movie from the user's favoriteMovies array
          user.favoriteMovies.splice(movieIndex, 1);
          res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorite movies list`);
      } else {
          res.status(400).send(`${movieTitle} is not in user ${id}'s favorite movies list`);
      }
  } else {
      res.status(400).send('No such user');
  }
});



// READ   --  Movie route
app.get( '/movies', (req, res) => {
  res.status(200).json(topMovies);
});

// READ 
app.get('/movies/:title', (req, res) =>{
  const { title } = req.params;
  const movie = topMovies.find( movie => movie.title.toLowerCase() === title.toLowerCase() );

  if( movie) {
  res.status(200).json(movie);
  } else {
  res.status(400).send('no such title found')
  }
});


// READ 
app.get('/movies/genre/:genre', (req, res) =>{
  const { genre } = req.params;
  const moviesByGenre = topMovies.filter( movie => movie.genre === genre );

  if (moviesByGenre.length > 0) {
      res.status(200).json(moviesByGenre);
  } else {
      res.status(400).send('no movies found for the specified genre');
  }
});


// READ 
app.get('/movies/director/:directorName', (req, res) =>{
  const { directorName } = req.params;
  const directorMovies = topMovies.filter(movie => movie.director.name.toLowerCase() === directorName.toLowerCase());

  if (directorMovies.length > 0) {
      res.status(200).json(directorMovies);
  } else {
      res.status(404).send('No movies found for the specified director');
  }
});


//Static file
app.use('/documentation', express.static('public', {index: 'documentation.html'}));
// Error handling midleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.listen(8080, () => {
    console.log('My first Node test server is running on Port 8080.');
});
