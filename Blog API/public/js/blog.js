document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const commentSection = document.querySelector('.add-comment');


    if (commentSection) {
        const commentForm = commentSection.querySelector('.comment-form');
        const loginMessage = document.createElement('p');
        
        if (token ) { 
            commentForm.style.display = 'block';
            loginMessage.remove();
        } else {
            commentForm.style.display = 'none';
            loginMessage.innerHTML = 'Please <a href="login.html" class="login-link">log in</a> to leave a comment';
            loginMessage.className = 'login-message';
            commentSection.appendChild(loginMessage);
        }
    }


    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const commentInput = document.getElementById("comment");
            const comment = commentInput.value.trim();
            
            if (!comment) {
                showError('Comment cannot be empty', commentForm);
                return;
            }

            try {
                // const user = decodeToken(token); 
                const articleId = getArticleId(); 
                const response = await fetch(`http://localhost:8080/api/createComment`, {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: comment,
                        userId:decodeToken(token) ,
                        articleId: articleId
                    })
                });

                const data = await response.json();
                
                if (!response.ok) throw new Error(data.message || 'Failed to post comment');
                
                commentInput.value = ''; 
                await loadComments(); 

            } catch (error) {
                showError(error.message, commentForm);
            }
        });
    }

   
    async function loadComments() {
        try {
            const articleId = getArticleId();
            const response = await fetch(`http://localhost:8080/api/comments/${articleId}`, {
                method: "GET",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) throw new Error('Failed to fetch comments');
            
            const data = await response.json();
            renderComments(data.data.comments);

        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'comment-error';
            errorDiv.textContent = error.message;
            document.querySelector('#all-comments').appendChild(errorDiv);
        }
    }

    function renderComments(comments) {
        const allComments = document.getElementById('all-comments');
        allComments.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="user-name">${comment.user.name}</span>
                    <span class="comment-date">
                        ${new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                <div class="comment-content">${comment.message}</div>
                
            </div>
        `).join('');
    }


    function getArticleId() {
        return new URLSearchParams(window.location.search).get('articleId') || 1;
    }

    function decodeToken(token) {
        try {
      
            const payload = JSON.parse(atob(token.split('.')[1]));
            
    
            return payload.id ;
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }



    function showError(message, container) {
        const errorDiv = container.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

  
    loadComments();
});