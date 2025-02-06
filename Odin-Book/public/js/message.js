document.addEventListener('DOMContentLoaded',async()=>{



    const userList = document.getElementById('userList')
    const currentUser = document.getElementById('currentUser')
    const chatWith = document.getElementById('chatWith')
    const userId = localStorage.getItem('userId')
    const nav = document.getElementById('auth-link')
    nav.innerHTML = `
    <a href="index.html" class="nav-link">Home</a>
    <a href="profile.html" class="nav-link">Profile</a>
    <a href="message.html" class="nav-link">Message</a>
    <a href="group.html" class="nav-link">Groups</a>
    <a href="notification.html" class="nav-link">Notification</a>

`;




 await FetchUser();

async function SnedingMEssage() {


}





























async function FetchUser() {

    try{
        const res = await fetch(`http://localhost:8080/api/user`,{
            method:"GET",
            headers: { 'Content-Type': 'application/json' },
        })
        if(!res.ok){
            // throw new Error('Failed to fetch Users');
            const errorText = await res.text();
            throw new Error(`Server error: ${res.status} - ${errorText}`);
        }

        const response = await res.json();
        const users = response.data; // Assuming the response has a data array

        // Clear existing list
        userList.innerHTML = '';
        
        // Create list items for each user
        users.forEach(user => {
            const listItem = document.createElement('li');
            
            // Add user content - modify this based on your user object structure
            // <img src="${user.profilePicture}" alt="${user.name}'s profile" class="user-avatar">
            listItem.dataset.userId = user.id;
            if(user.id ===JSON.parse(userId)){
                currentUser.innerHTML += `Current User ${user.name}`
                return;

            }
            listItem.innerHTML = `
                <div class="user-item">
                
                    <span class="username">${user.name}</span>
                    
                </div>
            `;

            listItem.onclick = () => {
                chatWith.innerHTML = `Starting chat with ${user.name}`;
              };


            //   listItem.addEventListener('click', () => {
            //     chatWith.textContent = `Starting chat with ${user.name}`;
            //     // Add actual chat initiation logic here
            //     startChat(user.id);
            // });
            // const receiverId = listItem.dataset.userId;
            // console.log("selecet user is",receiverId)
           

            userList.appendChild(listItem);
        });

    }catch(error){
        console.log("error from front fetch user",error)
        console.error("Error fetching users:", error);
        userList.innerHTML = '<li>Error loading users</li>';

    }
    
}

})