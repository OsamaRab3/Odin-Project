document.addEventListener('DOMContentLoaded', () => {
    // -------------------- Login Form Handling (Only in login.html) --------
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) { 
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('mail').value.trim();
            const password = document.getElementById('pass').value.trim();
            
            if (!email || !password) {
                return showError('All fields are required', loginForm);
            }

            try {
                const response = await fetch('http://localhost:8080/api/user/login', { 
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }) 
                });

                const data = await response.json();
                
                if (!response.ok) throw new Error(data.message || 'Login failed');

                localStorage.setItem('token', data.token);
                window.location.href = 'index.html'; 
                
            } catch (error) {
                showError(error.message, loginForm);
            }
        });
    }

    // -------------------- Signup Form Handling (Only in signup.html) ------
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) { 
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!name || !email || !password) {
                return showError('All fields are required', signupForm);
            }

            try {
                const response = await fetch('http://localhost:8080/api/user/signup', { 
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }) 
                });

                const data = await response.json();
                
                if (!response.ok) throw new Error(data.message || 'Signup failed');

                localStorage.setItem('token', data.token);
                window.location.href = 'index.html'; 
                
            } catch (error) {
                showError(error.message, signupForm);
            }
        });
    }

    function showError(message, form) {
        const errorDiv = form.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.textContent = message;
        
        if (!form.contains(errorDiv)) form.prepend(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
});