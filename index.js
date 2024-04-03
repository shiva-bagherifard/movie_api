const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware to log all requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Serve static files from the public folder
app.use(express.static('public'));

// Sample data for demonstration
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

// Sample data for genres and directors
const genres = [
    { name: 'Action', description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.' },
    { name: 'Drama', description: 'Drama film is a genre that relies on the emotional and relational development of realistic characters.' },
    // Add more genres as needed
];

const directors = [
    { name: 'Christopher Nolan', bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England.', birthYear: 1970 },
    { name: 'Quentin Tarantino', bio: '...', birthYear: 1963 }, // Add more director data
];

// Parse JSON bodies for POST requests
app.use(bodyParser.json());

// GET route for /movies
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
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

// GET route for genre by name
app.get('/genres/:name', (req, res) => {
    const genreName = req.params.name;
    const genre = genres.find(genre => genre.name.toLowerCase() === genreName.toLowerCase());
    if (genre) {
        res.json(genre);
    } else {
        res.status(404).send('Genre not found');
    }
});

// GET route for director by name
app.get('/directors/:name', (req, res) => {
    const directorName = req.params.name;
    const director = directors.find(director => director.name.toLowerCase() === directorName.toLowerCase());
    if (director) {
        res.json(director);
    } else {
        res.status(404).send('Director not found');
    }
});

// GET route for /
app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

// POST route for new user registration
app.post('/users/register', (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    // Perform registration logic here
    // For demonstration purposes, let's assume registration is successful
    res.send('Registration successful');
});

// PUT route for updating user info
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username } = req.body;

    // Check if username is provided
    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Logic to update user info
    // Here you would update the user with the provided ID and new username
    // For demonstration purposes, let's assume the user is updated successfully
    res.send('User info updated successfully');
});

// POST route for adding a movie to favorites
app.post('/users/:id/favorites/add', (req, res) => {
    const userId = req.params.id;
    const { title } = req.body;
    // Logic to add the movie with the provided title to the user's favorites
    // Then send a response indicating movie has been added to favorites
    res.send(`${title} added to favorites`);
});

// DELETE route for removing a movie from favorites
app.delete('/users/:id/favorites/remove', (req, res) => {
    const userId = req.params.id;
    const { title } = req.body;
    // Logic to remove the movie with the provided title from the user's favorites
    // Then send a response indicating movie has been removed from favorites
    res.send(`${title} removed from favorites`);
});

// DELETE route for deregistering a user
app.delete('/users/:id/delete', (req, res) => {
    const userId = req.params.id;
    // Logic to deregister the user with the provided ID
    // Then send a response indicating user email has been removed
    res.send('User deregistered successfully');
});

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
