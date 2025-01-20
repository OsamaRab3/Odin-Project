
document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
        const messageElement = document.getElementById('alert-message');
        if (messageElement) {
            messageElement.textContent = 'You need to log in or sign up first.';
            messageElement.style.display = 'block';
        }


        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const keyElement = document.getElementById('key');
    if (keyElement) {
        const key = keyElement.value;
        console.log('Key:', key);
    }

    const res = await fetch(api.join, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key })
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
    console.log('Key is valid');
} else {
    console.error(data.message || 'Invalid key or unauthorized access');
}
});
