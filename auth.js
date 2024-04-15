const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtSecret = process.env.JWT_SECRET || "MySecretKey2024!";

require("./passport"); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign({ username: user.username }, jwtSecret, {
      expiresIn: "7d",
  });
};

module.exports = (app) => {
  app.post("/login", (req, res, next) => {
      passport.authenticate("local", { session: false }, (error, user, info) => {
          if (error || !user) {
              return res.status(400).json({
                  message: "Invalid username or password",
              });
          }
          req.login(user, { session: false }, (error) => {
              if (error) {
                  res.send(error);
              }
              let token = generateJWTToken(user.toJSON());
              return res.json({ user, token });
          });
      })(req, res, next);
  });
};