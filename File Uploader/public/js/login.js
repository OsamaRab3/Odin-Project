

const loginNameInput = document.getElementById('email');
const loginPassInput = document.getElementById('pass');
const loginForm = document.getElementById('login')

const userId= JSON.stringify(localStorage.getItem("user"))

loginForm.addEventListener('submit', async (e) => {


    e.preventDefault();

        

    const email = loginNameInput.value.trim();
    const password = loginPassInput.value.trim();

    if (!email || !password) {
        showAlert('All fields are required', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/user/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log(response);

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        localStorage.setItem('user', JSON.stringify(data.data.id));
        console.log(data.data.id);

        showAlert('Login successful!', 'success');
        setTimeout(() => window.location.href = '/index.html', 0);

    } catch (error) {
        showAlert(error.message || 'Login error occurred', 'error');
        console.error('Login Error:', error);
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

