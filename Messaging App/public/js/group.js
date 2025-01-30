
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const appContainer = document.querySelector(".sidebar-section");
    const logoutButton = document.getElementById("logoutButton");
    const manageGroupBtn = document.getElementById('manageGroupBtn');
    const userSelect = document.getElementById('userSelect');
    const groupList = document.getElementById("groupList");
    const userId = decodeToken(token);

    if(!token){
        const appContainer = document.getElementById('app-container');
        if (appContainer) appContainer.style.display = "none";
    
        window.location.href = "login.html";

    }


    appContainer.style.display = "block";

    // logoutButton.addEventListener("click", logout);
    manageGroupBtn?.addEventListener('click', showManageGroupModal);
    document.getElementById("createGroupBtn")?.addEventListener("click", showCreateGroupModal);
    document.getElementById("cancelGroupBtn")?.addEventListener("click", hideCreateGroupModal);
    document.getElementById("confirmGroupBtn")?.addEventListener("click", createGroup);
    document.getElementById("addMemberBtn")?.addEventListener("click", addMember);


    fetchGroups().catch(handleFetchError);


    function showCreateGroupModal() {
        document.getElementById("createGroupModal").classList.add('show');
    }

    function hideCreateGroupModal() {
        document.getElementById("createGroupModal").classList.remove('show');
        document.getElementById("groupNameInput").value = '';
    }

    function showManageGroupModal() {
        fetchUsers()
            .then(updateMemberSelect)
            .then(() => {
                document.getElementById('manageGroupModal').classList.add('show');
            })
            .catch(handleFetchError);
    }



    async function createGroup() {
        try {
            const groupNameInput = document.getElementById("groupNameInput");
            const groupName = groupNameInput.value.trim();

            if (!groupName) {
                alert("Group name cannot be empty!");
                return;
            }

            const response = await fetch("http://localhost:8080/api/group/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: groupName, userId }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create group");

            alert("Group created successfully!");
            hideCreateGroupModal();
            await fetchGroups();
        } catch (error) {
            handleFetchError(error);
        }
    }

    async function addMember() {
        try {
            const selectedGroupId = document.getElementById('chat-container').dataset.selectedGroup;
            const selectedUserId = userSelect.value;

            const response = await fetch(`http://localhost:8080/api/group/${selectedUserId}/${selectedGroupId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add member");

            alert("Member added successfully!");
            fetchGroups();
        } catch (error) {
            handleFetchError(error);
        }
    }

    async function fetchGroups() {
        try {
            const response = await fetch(`http://localhost:8080/api/group/groups/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch groups");

            updateGroupList(data.data);
        } catch (error) {
            throw error;
        }
    }

    function updateGroupList(groups) {
        groupList.innerHTML = groups?.length > 0
            ? groups.map(group => `
                <li class="group-item" data-group-id="${group.id}">
                    <img src="../images/${group.avatar}" alt="${group.name}">
                    <strong>${group.name}</strong>
                        <div class="group-members">
                ${group.users?.map(user => `
                    <div class="member-item" data-member-id="${user.id}">
                        <img src="../images/${user.avatar}" alt="${user.name}">
                        <span data-member-name>${user.name}</span>
                        <button class="remove-user-btn" data-user-id="${user.id}">Remove</button>
                    </div>
                `).join('')}
            </div>
            
                </li>
            `).join('')
            : '<div class="no-groups">No groups found</div>';


        document.querySelectorAll('.remove-user-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();

                const userId = button.dataset.userId;
                const groupId = button.closest('.group-item').dataset.groupId;
                removeMemberFromGroup(groupId, userId);
            });
        });
        document.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', async () => {
                try {
                    const groupId = item.dataset.groupId;
                    const groupName = item.querySelector('strong').textContent;

                    const chatContainer = document.getElementById('chat-container');
                    chatContainer.dataset.chatId = groupId;
                    chatContainer.dataset.chatType = 'group';
                    chatContainer.dataset.selectedGroup = groupId;

                    document.getElementById("currentGroupName").textContent = groupName;
            
                    await getOldMessage(groupId);

                } catch (error) {
                    alert("Failed to load group chat: " + error.message);
                }
            });
        });
    }


    async function getOldMessage(groupId) {
        try {
            const response = await fetch(`http://localhost:8080/api/group/${groupId}`, {
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

            const group = data.data;
      
       
            group.users.forEach(user => {
                user.messages.forEach(message => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');

                    const isCurrentUser = user.id === parseInt(userId); 
                    messageElement.classList.add(isCurrentUser ? 'sent' : 'received');

                    messageElement.innerHTML = `
                        <div class="message-header">
                            <span class="sender">${user.name}</span>
                            <span class="timestamp">${new Date(message.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div class="text">${message.content}</div>
                    `;

                    messageList.appendChild(messageElement);
                });
            });

            messageList.scrollTop = messageList.scrollHeight;

        } catch (error) {
            console.error("Error fetching messages:", error);
            alert(error.message || "Failed to load chat history");
        }
    }



    async function removeMemberFromGroup(groupId, userId) {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/group/${userId}/${groupId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to remove member");

            document.querySelector(`[data-member-id="${userId}"]`).remove();
            alert("Member removed successfully!");
        } catch (error) {
            console.error("Error removing member:", error);
            alert(error.message || "An error occurred while removing the member");
        }
    }




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
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    function updateMemberSelect(users) {
        userSelect.innerHTML = '<option value="">Select user to add</option>';
        users?.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    }


    function decodeToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload?.id || null;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }

    function handleFetchError(error) {
        console.error("Error:", error);
        alert(error.message || "An error occurred");
    }


});