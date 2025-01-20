import { api } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
    const join = document.getElementById('join');
    const joinUs = document.getElementById('joinUs');
    const message = document.getElementById('message');
    const token = localStorage.getItem('token');

    if (!join || !message) {
        console.error('Required DOM elements not found.');
        return;
    }

    if (!token) {
        join.innerHTML = `
            <h2>Join the Clubhouse</h2>
            <p>Ready to join the Clubhouse? Sign up today to start your journey!</p>
            <a href="signup.html" class="btn">Sign Up Now</a>
            <p>Already a member? <a href="login.html" class="btn">Log In</a> to unlock member-exclusive features.</p>
        `;
    } else {

        (async function () {
            const resultDiv = document.createElement('div');
            joinUs.innerHTML=`  <a href="joinUs.html" >Join the Clubhouse</a>`

            try {
                if (!api || !api.message) {
                    throw new Error('API endpoint is not defined.');
                }

                const res = await fetch(api.message, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`);
                }

                const data = await res.json();
                resultDiv.innerHTML = data.message;
                message.appendChild(resultDiv);
            } catch (error) {
                console.error('Fetch error:', error);
                resultDiv.innerHTML = `
                    <p class="error">Failed to fetch messages. Please try again later.</p>
                `;
                message.appendChild(resultDiv);
            }
        })();
    }
});
