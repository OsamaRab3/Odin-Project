/*
*******************************************

* 1. create group
* 2. add member 
* 3. get all member 
* 4. remove member if admin 
* 5. get all groub this user in it 
* 6. createMessageInGroup
* 7.getOldMessageFromGroup

********************************************
*/

const prisma = require('../utils/prisma')

const createGroup = async(req,res)=>{

    const {name,userId} = req.body;
    try{

        const isValid = validation(name, userId, res);
        if (!isValid) return; 

        const newGroup = await prisma.group.create({
            data: {
                name,
                adminId: parseInt(userId), 
                users: {
                    connect: [{ id: parseInt(userId) }],
                },
            },
        });

        res.status(201).json({
            status: "success",
            data: {
                group: newGroup,
            },
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }

}


const addMember = async (req, res) => {
    const { userId, groupId } = req.params;

    try {
     
        const isValid = validation(userId, groupId, res);
        if (!isValid) return; 

        const checkResult = await checkUserAlreadyInGroup(userId, groupId);

        if (!checkResult.exists) {
            return res.status(404).json({
                status: "fail",
                message: checkResult.message
            });
        }

        if (checkResult.isUserInGroup) {
            return res.status(409).json({
                status: "fail",
                message: "This user is already a member of the group"
            });
        }

        const updatedGroup = await prisma.group.update({
            where: {
                id: parseInt(groupId)
            },
            data: {
                users: {
                    connect: [{ id: parseInt(userId) }]
                }
            }
        });

        res.status(200).json({
            status: "success",
            message: "User added to group successfully",
            data: updatedGroup
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

const getAllMemberInGroup = async (req, res) => {
    const { userId, groupId } = req.params;
    try {
   
        const isValid = validation(userId, groupId, res);
        if (!isValid) return;

        
        const checkResult = await checkUserAlreadyInGroup(userId, groupId);
        if (!checkResult.exists) {
            return res.status(404).json({
                status: "fail",
                message: checkResult.message,
            });
        }

        if (!checkResult.isUserInGroup) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized",
            });
        }

        const group = await prisma.group.findUnique({
            where: {
                id: parseInt(groupId),
            },
            include: {
                users: true, 
            },
        });

        if (!group) {
            return res.status(404).json({
                status: "fail",
                message: "Group not found",
            });
        }

   
        res.status(200).json({
            status: "success",
            data: group.users.map(user => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar, 
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const deleteMember= async(req,res)=>{
    const {userId,groupId} = req.params;
    try{
        const isValid = validation(userId, groupId, res);
        if (!isValid) return;

        const checkResult = await checkUserAlreadyInGroup(userId, groupId);
        if (!checkResult.exists) {
            return res.status(404).json({
                status: "fail",
                message: checkResult.message,
            });
        }
        if (!checkResult.isUserInGroup) {
            return res.status(401).json({
                status: "fail",
                message: "Error: This user is not a member of this group",
            });
        }

        const group = await prisma.group.findUnique({
            where: {
                id: parseInt(groupId),
            },
            include: {
                admin: true, 
            },
        });

        if (group.admin.id !== parseInt(userId)) {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to remove members from this group",
            });
        }


        const updatedGroup = await prisma.group.update({
            where: {
                id: parseInt(groupId),
            },
            data: {
                users: {
                    disconnect: [{ id: parseInt(userId) }],
                },
            },
            include: {
                users: true, 
            },
        });
        res.status(200).json({
            status: "success",
            message: "User removed from group successfully",
            data:updatedGroup.users.map(user => ({
                id: user.id,
                name: user.name,
                avatar: user.avatar, 
            }))
        });

    }catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


const getGroups = async (req,res)=>{
    const {userId} = req.params;
    try{
        if(!userId){
            res.status(400).json({
                status: "fail",
                message: "userId are required",
            });
        }
        const groups = await prisma.group.findMany({
            where: {
                users: {
                    some: { id: parseInt(userId) } 
                }
            },
            include: {
               users:{
                select:{
                    id:true,
                    name:true,
                    avatar:true,
                    messages:{
                        select:{
                            content:true,
                            createdAt:true
                        }
                    }


                }
               }
            }
        })
        res.status(200).json({
            status:"success",
            data:groups
        })

    }catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


const createMessageInGroup = async ({ userId,content,  groupId } ) => {


    try {

        if (!content || !userId || !groupId) { throw new Error("Missing required fields: senderId, content, or grup");}

        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },
            include: { users: true },
        });
        const newMessage = await prisma.message.create({
            data: {
                content,
                author: { connect: { id: parseInt(userId) } },
                group: { connect: { id: parseInt(groupId) } }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return {
            status: "success",
            data: {
                content: newMessage.content,
                author: {
                    id: newMessage.author.id,
                    name: newMessage.author.name
                }
            }
        };

    } catch (error) {
        console.error("Message creation error:", error);
        return {
            status: "error",
            message: error.message || "Failed to create message"
        };
    }
};

const getOldMessageFromGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        if (!groupId) {
            return res.status(400).json({ 
                status: "fail", 
                message: "Group Id is required" 
            });
        }

        const group = await prisma.group.findUnique({
            where: { id: parseInt(groupId) },

            include:{
                users:{
                    select:{
                        name:true,
                        id:true,
                        messages:{
                            where:{
                                groupId: parseInt(groupId) 
                            },
                            select:{
                                content:true,
                                createdAt:true,

                            }
                        }
                    }
                    

                }
            }
        });

        if (!group) {
            return res.status(404).json({ 
                status: "fail", 
                message: "Group not found" 
            });
        }


        res.status(200).json({ 
            status: "success", 
            data: group 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
};
// ---------------Help func-------------------------------------------------------
// check ifuser already in group 
const checkUserAlreadyInGroup = async (userId, groupId) => {
    const group = await prisma.group.findUnique({
        where: {
            id: parseInt(groupId)
        },
        include: {
            users: true
        }
    });

    if (!group) {
        return { exists: false, message: "Group not found" };
    }

    const isUserAlreadyInGroup = group.users.some(user => user.id === parseInt(userId));

    return {
        exists: true,
        isUserInGroup: isUserAlreadyInGroup
    };
};


const validation = (arg1, arg2, res) => {
    if (!arg1 || !arg2) {
        res.status(400).json({
            status: "fail",
            message: "name of group and userId are required",
        });
        return false; 
    }
    return true; 
};





module.exports = {
    createGroup,
    addMember,
    getAllMemberInGroup,
    deleteMember,
    getGroups,
    createMessageInGroup,
    getOldMessageFromGroup

}