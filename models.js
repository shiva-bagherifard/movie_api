const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongoose schema for movies
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String },
    Genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    Director: { type: mongoose.Schema.Types.ObjectId, ref: 'Director' },
    Actors: [{ type: String }],
    ImagePath: { type: String },
    Featured: { type: Boolean }
});

// Mongoose schema for users
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String },
    Birthday: { type: Date },
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Hashes the given password using bcrypt
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

// Validates the given password against the stored hashed password
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

// Define models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
