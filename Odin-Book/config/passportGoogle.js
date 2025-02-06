const passport = require('passport');
const prisma  = require('../utils/prisma')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
},

async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await prisma.user.upsert({
        where: { email: profile.emails[0].value },
        update: { 
          profilePicture: profile.photos[0].value,
          name: profile.displayName 
        },
        create: {
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
        },
      });
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  }));




passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } , 
      select: {
      id: true,
    }});
    done(null, user);

})

module.exports = passport;