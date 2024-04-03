const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to log all requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Serve static files from the public folder
app.use(express.static('public'));

// GET route for /movies
let topTenMovies = [
    {
        title: 'Interstellar',
        Director: 'Christopher Nolan'
    },
    {
        title: 'The Matrix',
        Director: 'Lana Wachowski, Lilly Wachowski'
    },
    {
        title: 'Forrest Gump',
        Director: 'Robert Zemeckis'
    },
    {
        title: 'Inception',
        Director: 'Christopher Nolan'
    },
    {
        title: 'Pulp Fiction',
        Director: 'Quentin Tarantino'
    },
    {
        title: 'The Shawshank Redemption',
        Director: 'Frank Darabont'
    },
    {
        title: 'The Dark Knight',
        Director: 'Christopher Nolan'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        Director: 'Peter Jackson'
    },
    {
        title: 'The Godfather',
        Director: 'Francis Ford Coppola'
    },
    {
        title: 'Schindler\'s List',
        Director: 'Steven Spielberg'
    }
];

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

// GET route for /
app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

// GET route for single movie by title
app.get('/movies/:title', (req, res) => {
    const title = req.params.title;
    const movie = topTenMovies.find(movie => movie.title === title);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// GET route for genre by name/title
app.get('/genres/:name', (req, res) => {
    const genreName = req.params.name;
    // Logic to retrieve genre data by name
});

// GET route for director by name
app.get('/directors/:name', (req, res) => {
    const directorName = req.params.name;
    // Logic to retrieve director data by name
});

// POST route for new user registration
app.post('/users/register', (req, res) => {
    // Logic for new user registration
});

// PUT route for updating user info
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Logic to update user info
});

// Other user-related routes can be added similarly

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`The movie app has loaded and is listening on port ${PORT}`);
});
