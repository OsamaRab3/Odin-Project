const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          folders: {
            include: {
              files: true
            }
          }
        }
      });

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      console.log("Error from passport: ", error)
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        folders: true,
        files: true

      }
    });
    done(null, user);
  } catch (error) {
    console.log("Error from passport deserialize: ", error)

    done(error);
  }
});



const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    status: 'fail',
    message: 'Unauthorized: Please log in to access this resource'
  });
};


const isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.status(200).json({
    status: 'success',
    data: req.user
  });

};

module.exports = {
  passport,
  isAuthenticated,
  isGuest
};