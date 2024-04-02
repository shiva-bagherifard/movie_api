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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});
