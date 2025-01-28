
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const prisma = require('../utils/prisma');
const generatJWT = require('../utils/generatJWT')

const login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const findUser = await prisma.user.findUnique({
            where:{
                email
            },
            select:{
                id:true,
                name:true,
                password:true,
            }
        })
        if(!findUser){
            return res.status(401).json({ 
                status: "fail",
                message: "Invalid email or password"
            });
        }

        const isPasswordValid =  await bcrypt.compare(password,findUser.password);

        if(!isPasswordValid){
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password"
            });
        }


        const token = generatJWT(findUser);
        res.status(200).json({
            status:"success",
            data:{
                name:findUser.name,
                id:findUser.id
            },
            token
        })

    }catch(error){
        console.log("error in login",error)
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}


const signup= async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        // check if user not found 
        // login validation 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                status: "fail",
                message: "Validation errors input correct filed ",
                errors: errors.array()
            });
        }
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){
            res.status(409).json({
                status:"fail",
                message:"Email aleardy exits"
            })
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                password:hashPassword
            },
            select:{
                name:true,
                id:true
            }
        })
        const token = generatJWT(newUser);
        res.status(201).json({
            status:"success",
            data:{
                name:newUser.name,
                id:newUser.id
            },
            token
        })

    }catch(error){
        console.log("error in login",error)
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }

}

module.exports = {
    login,
    signup


}