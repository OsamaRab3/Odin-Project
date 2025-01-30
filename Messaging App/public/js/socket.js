
 class ChatApp {
    constructor() {
        this.socket = io();
        this.messageInput = document.getElementById("messageInput");
        this.messageList = document.getElementById("messageList");
        this.sendButton = document.getElementById("sendButton");
        this.token = localStorage.getItem('token')


        this.currentUser = this.decodeToken(this.token)
        this.initializeSocket();
        this.addEventListeners();
    }

    initializeSocket() {
        this.socket.on("message", (msg) => {
            
            const messageObj = {
                sender: msg.author?.name || "Unknown", 
                text: msg.content,                     
                isCurrentUser: msg.author?.id === this.currentUser
            };
            this.addMessageToList(messageObj);
        });
        this.socket.on("messageInGroup",(msg)=>{
            const message = {
                sender:msg.author?.name || "Unknown", 
                text: msg.content,                     
                
            }
            this.addMessageToList(message)
        })
    }

    addEventListeners() {
        this.sendButton.addEventListener("click", () => this.sendMessage());

        this.messageInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.sendMessage();
            }
        });
    }

    sendMessage() {
            const chatContainer = document.getElementById('chat-container');
            const selectedGroupId = chatContainer.dataset.selectedGroup;
            const chatType = chatContainer.dataset.chatType ;
            
            const chatId = chatContainer.dataset.chatId;
  
            
        if (chatId && chatType ==='private'){
            const text = this.messageInput.value.trim();
            if (text) {
                // { senderId, content, chatId }
                const messageObj = {
                    senderId: this.currentUser,
                    content: text,
                    chatId: chatId  
                };
                
        
                this.socket.emit("join-chat", chatId); 
                this.socket.emit("message", messageObj);
                this.messageInput.value = "";
            }
        }
        if (selectedGroupId){
          
            
            const text = this.messageInput.value.trim();
            if (text) {
                const messageObj = {
                    userId: this.currentUser,
                    content: text,
                    groupId: selectedGroupId  
                };
            
        
                this.socket.emit("join-group", selectedGroupId);
                
                this.socket.emit("messageInGroup", messageObj);
        
                this.messageInput.value = "";
            }
        }else{
            throw new Error("error from sending messag in clinite")
        }

        
        }


    addMessageToList(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(message.isCurrentUser ? "sent" : "received");

        const header = document.createElement("div");
        header.classList.add("message-header");
        
        const senderElement = document.createElement("span");
        senderElement.classList.add("sender");
        senderElement.textContent = message.sender;
    
        const timeElement = document.createElement("span");
        timeElement.classList.add("time");
        timeElement.textContent = new Date().toLocaleTimeString();
    
        const textElement = document.createElement("div");
        textElement.classList.add("text");
        textElement.textContent = message.text;
    
        header.appendChild(senderElement);
        header.appendChild(timeElement);
        messageElement.appendChild(header);
        messageElement.appendChild(textElement);
        
        this.messageList.appendChild(messageElement);
        this.messageList.scrollTop = this.messageList.scrollHeight;
    }
    decodeToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload?.id || null;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }


}



document.addEventListener("DOMContentLoaded", () => new ChatApp());
