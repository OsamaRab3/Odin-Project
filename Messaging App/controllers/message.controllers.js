/****************************************************
 * 
 *  1. createChat,
 *  2. createMessage
 *  3. getExistingChat
 *  4. getAllMessage
 * 
****************************************************
*/
 
 
// // const { connect, io } = require('socket.io-client');
const prisma = require('../utils/prisma')



const getExistingChat = async (req, res) => {
    try {
        const { senderId, reciverI } = req.params; 
        
        if (!senderId || !reciverI) {
            return res.status(400).json({ 
                status: "fail", 
                message: "Missing user IDs" 
            });
        }

   
        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { users: { some: { id: parseInt(senderId) } } },
                    { users: { some: { id: parseInt(reciverI) } } }
                ]
            }
        });


        if (!existingChat) {
            return res.status(404).json({
                status: "fail",
                message: "No existing chat found"
            });
        }

        res.status(200).json({
            status: "success",
            message:"already in a chat",
            chatId: existingChat.id
        });

    } catch (error) {
        console.error("Error in getExistingChat:", error);
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
};

const createChat = async (req, res) => {
    try {
        const { senderId, reciverI } = req.params; 

       
        const existingChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { users: { some: { id: parseInt(senderId) } } },
                    { users: { some: { id: parseInt(reciverI) } } }
                ]
            }
        });
        
        if (existingChat) {
            return res.status(409).json({
                status: "fail",
                message: "already in a chat",
                chatId: existingChat.id
            });
        }

        const newChat = await prisma.chat.create({
            data: {
                users: {
                    connect: [
                        { id: parseInt(senderId) },
                        { id: parseInt(reciverI) }
                    ]
                }
            },
            include: { users: true }
        });

        res.status(201).json({
            status: "success",
            message: "Chat created successfully",
            data: newChat
        });

    } catch (error) {
        console.error("Error in createChat:", error);
        res.status(500).json({
            status: "error",
            message: error.message || "Internal server error"
        });
    }
};
const createMessage = async ({ senderId, content, chatId }) => {
    try {
        if (!senderId || !content || !chatId) {
            throw new Error("Missing required fields: senderId, content, or chatId");
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

        return {
            status: "success",
            message: "Message created",
            data: newMessage
        };

    } catch (error) {
        console.error("Message creation error:", error);
        return {
            status: "error",
            message: error.message || "Failed to create message"
        };
    }
};
const getAllMessage = async (req, res) => {
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
    // createMessageInChat,
    createChat,
    createMessage,
    getExistingChat,
    getAllMessage
}
