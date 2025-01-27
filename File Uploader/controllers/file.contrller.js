
const {prisma} = require("../config/prisma")



const getAllFiles =  async (req,resizeBy,next)=>{
    const {userId}  = req.prams;

    if (!userId) {
        return res.status(400).json({
            status: 'fail',
            message: 'User ID is required'
        });
    }

    try{
        const files = await  prisma.file.findMany({
            where:{
                userId:parseInt(userId)
                
            },
            include: {
                user: true,
                folder: true
            },
            select:{
                id:true,
                name:true,
                createdAt:true

            }
        })
        res.status(200).json({status:"success",data:files})


    }catch(error){
        console.log(error)
        res.status(500).json({status:"error",message:error.message})
        next(error);
    }

}

const uploadFile = async (req, res, next) => {
    const { userId, folderId } = req.body; 
    
    if (!userId || !folderId) {
        return res.status(400).json({
            status: 'fail',
            message: 'User ID and Folder ID are required'
        });
    }

    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'fail',
                message: 'No file uploaded'
            });
        }

        const createdFile = await prisma.file.create({
            data: {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype.split('/')[0],
                size: req.file.size,
                userId: parseInt(userId),
                folderId: parseInt(folderId)
            },
            select: {
                id: true,
                filename: true,
                createdAt: true
            }
        });

        res.status(201).json({
            status: "success",
            data: createdFile
        });

    } catch(error) {
        console.error("File Upload Error:", error);
        next(error);
    }
};




const deleteFile = async (req,res,next)=>{

    const { fileId, folderId, userId } = req.params;


    if(!fileId||!folderId||!userId){
        return res.status(400).json({
            status: 'fail',
            message: 'all fild are required'
        });
    }
        
    try{
        const deleted = await prisma.file.delete({
            where:{
                id:parseInt(fileId),
                userId:parseInt(userId),
                folderId:parseInt(folderId)
            }
        });

        res.status(200).json({            
            status: "success",
            message: "File deleted successfully"
        })
        

    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({status:"error",message:error.message})
        next(error)
    }

    
}

module.exports = {
    getAllFiles,
    deleteFile,
    uploadFile


}