document.addEventListener('DOMContentLoaded', () => {
  const urls = document.getElementById('url');
  const user = localStorage.getItem('user');

  if (!user) {

      urls.innerHTML = `
          <li><a href="login.html">Login</a></li>
          <li><a href="signup.html">Signup</a></li>
      `;
  } else {
    
      const userName = JSON.parse(user)
      urls.innerHTML = `
          <li><a href="upload.html">Upload Files</a></li>
          <p> welcome ${userName.name} </p>
          <li><a href="#" id="logout">Logout</a></li>
      `;


      // Add a logout click handler
      const logoutLink = document.getElementById('logout');
      logoutLink.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          window.location.href = 'index.html';
      });
  }
});
