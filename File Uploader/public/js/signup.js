const signupNameInput = document.getElementById('username');
const signupEmailInput = document.getElementById('mail');
const signupPassInput = document.getElementById('password');
// const loginForm = document.getElementById('login');
const signupForm = document.getElementById('signup');
const userId= JSON.stringify(localStorage.getItem("user"))



signupForm.addEventListener('submit', async (e) => {

        
    e.preventDefault();
    
    const username = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPassInput.value.trim();

    if (!username || !password || !email) {
        showAlert('All fields are required', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/user/signup`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: username, email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        localStorage.setItem('user', JSON.stringify(data.data.id));
        showAlert('Signup successful!', 'success');
        setTimeout(() => window.location.href = 'login.html', 0);
        
    } catch (error) {
        showAlert(error.message || 'Signup error occurred', 'error');
        console.error('Signup Error:', error);
    }
});


function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.form-container') || document.body;
    container.prepend(alertDiv);

    setTimeout(() => alertDiv.remove(), 3000);
}