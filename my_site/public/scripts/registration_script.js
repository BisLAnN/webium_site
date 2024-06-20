function goBack() {
    window.history.back();
}

async function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const messageElement = document.getElementById('message');

    if (!privacyPolicy.checked) {
        showMessage('Пожалуйста, согласитесь с политикой конфеденциальности', 'error');
        return;
    }

    if (password.value !== confirmPassword.value) {
        showMessage('Пароли не совпадают', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, username: username.value, password: password.value }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            updateInputStyles(username, 'success');
            updateInputStyles(password, 'success');
            updateInputStyles(confirmPassword, 'success');

            setTimeout(() => {
                window.location.href = './authorization.html';
            }, 2000);
        }

        else {
            showMessage('Ошибка регистрации: ' + data.message, 'error');
            updateInputStyles(username, 'error');
            updateInputStyles(password, 'error');
            updateInputStyles(confirmPassword, 'error');
        }


    }

    catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        showMessage('Произошла ошибка при регистрации', 'error');
    }
}

function showMessage(message, messageType) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;


    messageElement.classList.remove('success', 'error');


    if (messageType === 'success') {
        messageElement.classList.add('success');
    } else if (messageType === 'error') {
        messageElement.classList.add('error');
    }
}

function updateInputStyles(inputElement, styleType) {

    inputElement.classList.remove('success-input', 'error-input');

    if (styleType === 'success') {
        inputElement.classList.add('success-input');
    } else if (styleType === 'error') {
        inputElement.classList.add('error-input');
    }
}

window.onload = function () {
    const registerButton = document.querySelector('.btn');
    const privacyPolicy = document.getElementById('privacyPolicy');

    privacyPolicy.onchange = function () {
        registerButton.disabled = !this.checked;
    };

    registerButton.disabled = true;
};