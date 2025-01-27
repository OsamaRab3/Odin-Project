// login 
// use passport.js with session 

const passport = require("passport")
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
// const 
const {prisma} =  require('../config/prisma')
const {validationResult} = require('express-validator')
const login = (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ 
                status: "error", 
                data: errors.array() 
              });
            }

            if (error)
                {console.log("error: ",error);
                     return next(error);
                }
            if (!user) {
                return res.status(401).json({
                    status: "fail",
                    message: info?.message || 'Invalid email or password'  
                });
            }

            req.login(user, (loginError) => {
                console.log("User: ",user)
                if (loginError) {
                console.log("Error from login: ",loginError)

                    return next(loginError);
                }

                return res.status(200).json({
                    status:"success",
                    message: 'Login successful',
                    data: {
                        id: user.id,
                        name: user.name,
                        folders:user.folders,
                        files:user.files,

                    }
                });
            });

        } catch (error) {
         console.log("Error from catch login: ",error)

            next(error);
        }
    })(req, res, next);
};


const signup = async (req, res, next) => {
    try {
        const { name, email,password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            status: "error", 
            data: errors.array() 
          });
        }
      

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                status:"fail",
                message: 'User already exists with this email'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,

            },
            include:{
                folders:{
                    include:{
                        files:true
                    }
                }
            }
        });

        req.login(newUser, (loginError) => {
            if (loginError) return next(loginError);

            return res.status(200).json({
                status:"success",
                message: 'Signup successful and user logged in',
                data: {
                    id: newUser.id,
                    name: newUser.name,
                
                    folders: newUser.folders.map(folder => ({
                        id: folder.id,
                        name: folder.name,
                        files: folder.files 
                    }))

                }
            });
        });

    } catch (error) {     
        console.error('Signup Error:', error);
        next(error);
    }
};

module.exports = {
    login,
    signup,
}