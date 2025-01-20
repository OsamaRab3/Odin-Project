import { api } from './api.js';

document.getElementById('singup_form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const FirstName = document.getElementById('fname').value.trim();
    const LastName = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!FirstName || !LastName || !email || !password) {
        alert('All fields are required');
        return;
    }

    const data = {
        FirstName, 
        LastName,  
        email,
        password
    };

    try {
        
        const response = await fetch(api.singup, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const res = await response.json();

        if (res.status === 'success') {
            alert('User created successfully');
            window.location.href = 'index.html';
        } else {
            alert(res.message || 'User creation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});