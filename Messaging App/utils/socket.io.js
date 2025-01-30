const { Server } = require("socket.io");
const { createMessage } = require("../controllers/message.controllers");
const {createMessageInGroup} = require('../controllers/group.controller');

function setupSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" },
        connectionStateRecovery: {}
    });

    io.on("connection", (socket) => {

        socket.on('join-group',(groupId)=>{
            socket.join(`group_${groupId}`);

        })

        socket.on('messageInGroup',async(messageGroup)=>{
            try{
                const result = await createMessageInGroup(messageGroup);
                if(result.status !=="success"){
                    throw new Error(result.message);
                }
    
                io.to(`group_${messageGroup.groupId}`).emit("messageInGroup",{
                    ...result.data,
                    timestamp: new Date().toISOString()
                })

            }catch(error){
                socket.emit("message-error", {
                    status: "error",
                    message: error.message
                });
            }
        })
        socket.on("join-chat", (chatId) => {
            socket.join(`chat_${chatId}`);
        });

        socket.on("message", async (msg) => {
            try {

                if (!msg?.senderId || !msg?.content || !msg?.chatId) {
                    throw new Error("Invalid message format");
                }

                const result = await createMessage(msg);
                
                if (result.status !== "success") {
                    throw new Error(result.message);
                }

                io.to(`chat_${msg.chatId}`).emit("message", {
                    ...result.data,
                    timestamp: new Date().toISOString()
                });
     

            } catch (error) {
               
                socket.emit("message-error", {
                    status: "error",
                    message: error.message
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}
module.exports = { setupSocket };
