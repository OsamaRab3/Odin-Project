
const prisma = require('../utils/prisma')
const io= require('../index')
const createMessage = async (req,res) => {
    const { senderId, content, chatId } = req.body;
    try {
        if (!senderId || !content || !chatId) {
            throw new Error("Missing required fields: senderId, content, or chatId");
        }

        const [user, chat] = await Promise.all([
            prisma.user.findUnique({ where: { id: parseInt(senderId) } }),
            prisma.chat.findUnique({
                where: { id: parseInt(chatId) },
                include: {
                    users: {
                        where: { id: parseInt(senderId) }
                    }
                }
            })
        ]);
        
        if(!user){
            return res.status(404).json({
                status: "fail",
                message: "User not found in this Chat"
            });
        }
        if (!chat ) {
            return res.status(404).json({
                status: "fail",
                message: "Chat not found "
            });
        }


        const newMessage = await prisma.message.create({
            data: {
                content,
                status: "SENT",
                author: { connect: { id: parseInt(senderId) } },
                Chat: { connect: { id: parseInt(chatId) } }
            },
            include: {
                author: { select: { name: true, avatar: true } },
                Chat: true
            }
        });

        io.to(`chat_${chatId}`).emit("messageinChat",{newMessage})
        return res.status(201).json({
            status: "success",
            message: "Message created",
            data: newMessage
        });

    } catch (error) {
        console.error("Message creation error:", error);
        return res.status(500).json({
            status: "error",
            message: error.message 
        });
    }
};
const getAllMessage = async (req, res) => {
    // i dont need to userId here every chat have a uniqe id so i think it will work 
    const { chatId } = req.params;
    try {
        if (!chatId) {
            return res.status(400).json({
                status: "fail",
                message: "Missing Data",
            });
        }

       const messages = await prisma.chat.findUnique({
            where: {
                id: parseInt(chatId),
            },
            include: {
                messages: {
                    include: {
                        author: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                users: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!messages) {
            return res.status(404).json({
                status: "fail",
                message: "Chat not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: messages,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};



module.exports = {
    createMessage,
    getAllMessage,
}