document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirectUrl;
    } else {
        document.getElementById('message').innerText = data.message;
    }
});

function goBack() {
    window.history.back();
}