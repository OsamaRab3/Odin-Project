
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const prisma = require('../utils/prisma');
const generatJWT = require('../utils/generateJWT')

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
                avatar:true,
                role:true,
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
                id:findUser.id,
                role:findUser.role,
                avatar:findUser.avatar,

            },
            token
        })

    }catch(error){
        
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}


const signup= async(req,res)=>{
    const {name,email,password} = req.body;
    try{

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
                id:true,
                role:true,
                avatar:true
            }
        })
        const token = generatJWT(newUser);
        res.status(201).json({
            status:"success",
            data:{
                name:newUser.name,
                id:newUser.id,
                role:newUser.role,
                avatar:newUser.avatar
            },
            token
        })

    }catch(error){
 
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }

}
const getAllUser = async(req,res)=>{
    try{
        const users = await prisma.user.findMany();

        res.status(200).json({
            status:"success",
            data:users.map(user=>({
                id:user.id,
                name:user.name,
                avatar:user.avatar
            }))
        })

    }catch(error){
     
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}

module.exports = {
    login,
    signup,
    getAllUser


}