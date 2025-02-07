const passport = require("passport");

const generateJWT = require('../utils/GenerateJWT');
const prisma = require("../utils/prisma");
const bcrypt = require('bcryptjs')

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      console.log("Error from auth login:", error);
      return next(error);
    }
    console.log("USer from login",user)
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: info?.message || "Invalid credentials",
      });
    }
    
    const token = generateJWT(user);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
  
      data: {
        id: user.id,
        name: user.name,
        bio: user.bio
      },
      token
    });
  })(req, res, next);
};




const signup = async (req, res) => {
  const { name,email, password } = req.body;

  try {
    
    if (!name|| !email || !password) {
      console.log("Missing data from signup");
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "User already exists",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, 
      },
    });
    const token = generateJWT(newUser)

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
      },
      token
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


module.exports = { login, signup };

