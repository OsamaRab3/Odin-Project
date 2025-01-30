document.addEventListener("DOMContentLoaded", () => {


    const token = localStorage.getItem("token");
    const appContainer = document.querySelector(".sidebar-section");
    const usersList = document.querySelector("#usersList ul");
    const logoutButton = document.getElementById("logoutButton");
    const userId = decodeToken(token);


    if (!token) {

        const appContainer = document.getElementById('app-container');
        if (appContainer) appContainer.style.display = "none";

        window.location.href = "login.html";
    }
    appContainer.style.display = "block";


    logoutButton.addEventListener("click", logout);

    fetchUsers().catch(handleFetchError);

    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost:8080/api/user/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch users");
            updateUserList(data.data);
        } catch (error) {
            handleFetchError(error);
        }
    }

    function updateUserList(users) {
        usersList.innerHTML = users?.length > 0
            ? users.map(user => `
                <li class="user-item" data-user-id="${user.id}">
                    <img src="../images/${user.avatar}" alt="${user.name}">
                    <span>${user.name}</span>
                </li>
            `).join('')
            : '<li>No users found</li>';

        document.querySelectorAll('.user-item').forEach(item => {
            item.addEventListener('click', async () => {
                try {
                    const reciverId = item.dataset.userId;
                    const userName = item.querySelector('span').textContent;
                    const chatId = await createChat(userId, reciverId);


                    const chatContainer = document.getElementById('chat-container');
                  
                    chatContainer.dataset.chatId = chatId;
                    chatContainer.dataset.chatType = 'private';
                    chatContainer.dataset.selectedUserId = reciverId;

                    document.getElementById("currentGroupName").textContent = `Chat with ${userName}`;


                } catch (error) {
                    console.error("Chat selection failed:", error);
                    alert("Failed to start chat: " + error.message);
                }
            });
        });
    }

    async function createChat(senderId, reciverId) {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${senderId}/${reciverId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message.includes("already in a chat")) {
                    return await getExistingChatId(senderId, reciverId);
                }
                throw new Error(data.message || "Failed to start chat");
            }
            return data.chatId;
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
            throw error;
        }
    }



    async function getOldMessage(chatId) {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${chatId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch old messages");

            const messageList = document.getElementById('messageList');
            messageList.innerHTML = '';

            data.data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add(message.author.id === userId ? 'sent' : 'received');

                messageElement.innerHTML = `
                    <div class="message-header">
                        <span class="sender">${message.author.name}</span>
                        <span class="timestamp">${new Date(message.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div class="text">${message.content}</div>
                `;

                messageList.appendChild(messageElement);
            });

        } catch (error) {
            console.error("Error fetching messages:", error);
            alert(error.message || "Failed to load chat history");
        }
    }

    async function getExistingChatId(senderId, reciverId) {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${senderId}/${reciverId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch existing chat");

            await getOldMessage(data.chatId);
            return data.chatId;

        } catch (error) {
            console.error("Error fetching existing chat:", error);
            throw error;
        }
    }

    function decodeToken(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]))?.id || null;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }

    function handleFetchError(error) {
        console.error("Error:", error);
        alert(error.message || "An error occurred");
    }

    function logout(event) {
        event?.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
});