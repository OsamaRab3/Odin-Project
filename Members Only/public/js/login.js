import { api } from './api.js';

const emailElement = document.getElementById('email');
const passwordElement = document.getElementById('password');

if (!emailElement || !passwordElement) {
    alert('Email or password field is missing');
}

document.getElementById('login_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();

    if (!email || !password) {
        alert('Email or password cannot be empty');
        return;
    }

    try {
        const res = await fetch(api.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
            localStorage.setItem('token', data.token);
            
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed, please try again');
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});
