
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId')
    const nav = document.getElementById('auth-link')
    nav.innerHTML = `
        <a href="index.html" class="nav-link">Home</a>
        <a href="profile.html" class="nav-link">Profile</a>
        <a href="message.html" class="nav-link">Message</a>
        <a href="group.html" class="nav-link">Groups</a>
        <a href="notification.html" class="nav-link">Notification</a>`;



    document.getElementById('createGroupForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const groupName = document.getElementById('group-name').value.trim();
        const errorMessage = document.getElementById('groupErrorMessage');

        if (!groupName) {
            errorMessage.textContent = 'Group name cannot be empty!';
            return;
        }

        const response = await fetch('http://localhost:8080/api/groups', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: groupName,
                userId: userId
            })

        });
        if (!response.ok) throw new Error('Failed to fetch posts');

        data = await response.json();
        alert("Group Created success")


    });
    fetch('http://localhost:8080/api/groups')
        .then(response => response.json()) 
        .then(groups => {
            const groupList = document.getElementById('group-list');
            
            groupList.innerHTML = '';

            groups.data.forEach(group => {
                const li = document.createElement('li');
                li.textContent = group.name; 
                li.addEventListener('click', () => {
                    selectGroup(group);
                });
                groupList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching groups:', error);
        });

        function selectGroup(group) {
            const currentGroup = document.getElementById('currentGroup');
            currentGroup.textContent = `Selected Group: ${group.name}`;
        

            document.getElementById('postContainer').style.display = 'block';
            
          
            document.querySelector('.group-list').style.display = 'none';
        }


})



