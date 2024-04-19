const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username", // Correct username field
        passwordField: "password", // Correct password field
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
          if (!user.validatePassword(password)) {//if hashed password does not match the one stored in the DB
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
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

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "MySecretKey2024!" // Correct secret key
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload._id);
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

