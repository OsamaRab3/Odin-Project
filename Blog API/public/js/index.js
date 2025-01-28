const token = localStorage.getItem('token');
const links = document.getElementById('links');

if (!token) {
    links.innerHTML += 
    `   <li><a href="login.html">Login</a></li>
        <li><a href="signup.html">Signup</a></li>`;
} else {
   
    links.innerHTML += `<li><a href="#" onclick="logout()">Logout</a></li>`;
    
 
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        window.location.href = 'index.html';
    }
}


function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}