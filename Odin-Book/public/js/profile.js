document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    try {
        // Get elements from DOM
        const postsContainer = document.getElementById('postsContainer');
        const profileHeader = document.getElementById('profileHeader');
        const profilePic = document.getElementById('profilePic');
        const nameElement = document.getElementById('name');
        const bioElement = document.getElementById('bio');
        const postsCount = document.getElementById('postsCount');
        const followersCount = document.getElementById('followersCount');
        const followingCount = document.getElementById('followingCount');

        // Check authentication
        const token = localStorage.getItem('token');

        if (!token || !userId) {
            window.location.href = 'login.html';
            return;
        }
        const nav = document.getElementById('auth-link')
        nav.innerHTML = `
        <a href="index.html" class="nav-link">Home</a>
        <a href="profile.html" class="nav-link">Profile</a>
        <a href="message.html" class="nav-link">Message</a>
        <a href="group.html" class="nav-link">Groups</a>
        <a href="notification.html" class="nav-link">Notification</a>`;
        
  
        const userResponse = await fetch(`http://localhost:8080/api/user/${userId}`, {
            method: "GET",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log(userData);

   
        nameElement.textContent = userData.data.name;
        bioElement.textContent = userData.data.bio || "No bio available"
        followersCount.textContent = userData.data.countOfFollowers || 0,
        followingCount.textContent = userData.data.countOfFollowing || 0
        userData.data.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            
            postElement.innerHTML = `
                <p class="post-content">${post.content}</p>
                <p><strong>Comments:</strong></p>
        
                <ul>
                    ${post.comments.map(comment => `
                        <li><strong>${comment.author.name}:</strong> ${comment.content}</li>
                    `).join('')}
                </ul>
                    <div class="post-actions">
        <button class="action-button like-button">
            <span class="like-icon">❤️</span> <span class="like-count">${post.likesCount}</span>
        </button>
    </div>
       
            `;
            
            postsContainer.appendChild(postElement);
        });



    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    const followButton = document.getElementById('followButton');




 

    const followerId = Number(userId)
    console.log("followerId",followerId)
    const followingId = followButton.dataset.userId; 

    console.log("followingId",followingId)
    followButton.addEventListener("click", async () => {
        if (!followerId || !followingId) {
            console.error("Missing followerId or followingId");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/user/${followerId}/${followingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            console.log(data.message);

            if (res.ok) {
                alert(data.message);
              
                followButton.textContent = data.message.includes("unfollowed") ? "Follow" : "Unfollow";
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    });
    

});
