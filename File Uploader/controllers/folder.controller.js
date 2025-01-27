const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createFolder = async (req, res, next) => {
    try {

        const { name, userId } = req.body;

        console.log("name",name)
        console.log("userID",userId)
        
        if (!name || !userId ) {
            return res.status(400).json({
                status: "fail",
                message: "Folder name is required "
            });
        }

        const newFolder = await prisma.folder.create({
            data: { name ,
                userId: userId,
            },
            select: {
                id: true,
                name: true,
                createdAt: true
            }
        });

        res.status(201).json({
            status: "success",
            message: "Folder created successfully",
            data: newFolder
        });

    } catch (error) {

        next({
            status: 500,
            message: "Internal server errrrrror",
            details: error.message
        });
    }
};

// Oops -:) i need to use pagination 

const getAllFolder= async(req,res,next)=>{
    try{
        const { userId } = req.params; 

        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                message: 'User ID is required'
            });
        }

        const Folders = await prisma.folder.findMany({
            where: { userId: parseInt(userId)  },
            select:{
                id:true,
                name:true,
                files:true,
                createdAt:true

            }

        });

        res.status(200).json({status:"success",data:Folders})

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message 
        });
        next(error);
    }
}
const deleteFolder = async (req, res, next) => {
    try {

        const { folderId,userId } = req.params;

        if (!folderId||!userId) {
            return res.status(400).json({
                status: "fail",
                message: "missing data"
            });
        }

        await prisma.folder.delete({
            where: { id: parseInt(folderId),  
                userId: parseInt(userId) }
        });

        res.status(200).json({
            status: "success",
            message: "Folder deleted successfully"
        });

    } catch (error) {

   
        console.error('Delete folder error:', error);
        next({
            status: 500,
            message: "Internal server error",
        });
    }
};
module.exports = {
    createFolder,
    deleteFolder,
    getAllFolder


};