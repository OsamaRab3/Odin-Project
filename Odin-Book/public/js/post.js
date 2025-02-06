
const postForm = document.getElementById('postForm');
const postContent = document.getElementById('post-content');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('errorMessage');
const postsList = document.getElementById('postsList');
const emptyState = document.getElementById('emptyState');
const token = localStorage.getItem('token')
const nav = document.getElementById('auth-link')
if(!token){
    window.location.href = 'login.html'
    
}
const userId = localStorage.getItem('userId')


nav.innerHTML = `
    <a href="index.html" class="nav-link">Home</a>
    <a href="profile.html" class="nav-link">Profile</a>
    <a href="message.html" class="nav-link">Message</a>
    <a href="group.html" class="nav-link">Groups</a>
    <a href="notification.html" class="nav-link">Notification</a>

`;

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:8080/api/post',{
            method:"GET",
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        data = await response.json();
        // console.log(data.data)
        renderPosts(data.data)
    } catch (error) {
        showError(error.message);
    }
});


postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
 

    const content = postContent.value.trim();
    if (!content) {
        showError('Post content cannot be empty');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Posting...';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('http://localhost:8080/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content,
                authorId: userId
            })
        });

        if (!response.ok) throw new Error('Failed to create post');

        const newPost = await response.json();

        postContent.value = '';  

        addPostToUI(newPost.data);

    } catch (error) {
        showError(error.message);
    } finally {
     
        submitButton.disabled = false;
        submitButton.textContent = 'Post';
    }
});



function addPostToUI(post) {
    const li = document.createElement('li');
    li.className = 'post-item';
    li.setAttribute('data-post-id', post.id);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-content';
    contentDiv.textContent = post.content;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'post-meta';

    const authorSpan = document.createElement('span');
    authorSpan.className = 'post-author';
    authorSpan.textContent = `User #${post.author.name}`;

    const timeElement = document.createElement('time');
    timeElement.className = 'post-date';
    timeElement.textContent = new Date(post.createdAt).toLocaleDateString();

    metaDiv.appendChild(authorSpan);
    metaDiv.appendChild(timeElement);

    li.appendChild(contentDiv);
    li.appendChild(metaDiv);

    postsList.prepend(li); 
}
// ----------------------------------------------------------
function renderPosts(posts) {
    console.log(posts);
    postsList.innerHTML = '';

    if (posts.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.setAttribute('data-post-id', post.id);

        // Post Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'post-content';
        contentDiv.textContent = post.content;

        // Post Meta (Author & Time)
        const metaDiv = document.createElement('div');
        metaDiv.className = 'post-meta';

        const authorSpan = document.createElement('span');
        authorSpan.className = 'post-author';
        authorSpan.textContent = `${post.author.name}`;

        const timeElement = document.createElement('time');
        timeElement.className = 'post-date';
        timeElement.textContent = new Date(post.createdAt).toLocaleDateString();

        // Like Button for Post
        const likeButton = document.createElement('button');
        const unlikebutton = document.createElement('button')
        likeButton.className = 'like-button';
        unlikebutton.className = 'unlike'

        likeButton.textContent = `Like (${post.likes.length})`;
        unlikebutton.textContent = `UnLike`
        unlikebutton.onclick = ()=>removeLike(post.id,"post",unlikebutton)
        likeButton.onclick = () => likePost(post.id,"post", likeButton);

        metaDiv.appendChild(authorSpan);
        metaDiv.appendChild(timeElement);
        metaDiv.appendChild(likeButton);

        // Comments Section
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-container';

        const commentsList = document.createElement('ul');
        commentsList.className = 'comments-list';

        post.comments.forEach(comment => {
            const commentItem = document.createElement('li');
            commentItem.className = 'comment-item';

            const commentText = document.createElement('p');
            commentText.textContent = `${comment.author.name}: ${comment.content}`;
            console.log(comment.id)

            const commentLikeButton = document.createElement('button');
            commentLikeButton.className = 'comment-like-button';
            commentLikeButton.textContent = 'Like';
            commentLikeButton.textContent = `Like (${comment.likesCount})`;

            commentLikeButton.onclick = () => likePost(comment.id,"comment",commentLikeButton);

            commentItem.appendChild(commentText);
            commentItem.appendChild(commentLikeButton);
            commentsList.appendChild(commentItem);
        });

        const commentForm = document.createElement('form');
        commentForm.className = 'comment-form';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.className = 'comment-input';
        commentInput.placeholder = 'Write a comment...';

        const commentButton = document.createElement('button');
        commentButton.type = 'submit';
        commentButton.className = 'comment-button';
        commentButton.textContent = 'Comment';

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentButton);
        commentForm.onsubmit = (e) => {
            e.preventDefault();
            addComment(post.id, commentInput.value, commentsList);
            commentInput.value = '';
        };

        commentsContainer.appendChild(commentsList);
        commentsContainer.appendChild(commentForm);

        // Append all elements
        li.appendChild(contentDiv);
        li.appendChild(metaDiv);
        li.appendChild(commentsContainer);
        postsList.appendChild(li);
    });
}




async function likePost(itemId,type, button) {
    try {
        const response = await fetch(`http://localhost:8080/api/post/${userId}/${itemId}/${type}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to like post');
        const data = await response.json();
        console.log(data)
        // button.textContent = `Like (${data.likes})`;
    } catch (error) {
        console.error(error);
    }
}
async function removeLike(postId, button) {
    try {
        const response = await fetch(`http://localhost:8080/api/post/${postId}/${userId}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Failed to like post');
        const data = await response.json();
        console.log(data)
        // button.textContent = `Like (${data.likes})`;
    } catch (error) {
        console.error(error);
    }
}



async function addComment(postId, content, commentsList) {
    if (!content.trim()) return;

    try {
        const response = await fetch(`http://localhost:8080/api/user/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content ,
                userId,
                postId
            })
        });

        if (!response.ok) throw new Error('Failed to add comment');
        const newComment = await response.json();

        // Add new comment to UI
        const commentItem = document.createElement('li');
        commentItem.className = 'comment-item';

        const commentText = document.createElement('p');
        commentText.textContent = `You: ${newComment.data.author.name}`;

        // Like Button for New Comment
        const commentLikeButton = document.createElement('button');
        commentLikeButton.className = 'comment-like-button';
        commentLikeButton.textContent = 'Like';
        commentLikeButton.onclick = () => likeComment(newComment.id);

        commentItem.appendChild(commentText);
        commentItem.appendChild(commentLikeButton);
        commentsList.appendChild(commentItem);
    } catch (error) {
        console.error(error);
    }
}




function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
