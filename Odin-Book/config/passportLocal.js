const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id:true,
            name:true,
            email: true,
            password: true, 
          },
        });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Passport local strategy:", error);
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name:true,

      }
    });

    console.log("USer from passport",user)

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    console.error("Error in deserializeUser:", error);
    return done(error, null);
  }
});

module.exports = passport;
