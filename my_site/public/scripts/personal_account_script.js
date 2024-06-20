document.addEventListener('DOMContentLoaded', function () {

    var images = ['1.jpg', 'course-image.jpg', '2.jpg', '3.jpg', '4.jpg'];
    const username = 'user';
    document.getElementById('loadingMessage').style.display = 'block';
    fetch(`http://localhost:5000/auth/personalAccount/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('loadingMessage').style.display = 'none';
            const courseList = document.getElementById('courseList');
            courseList.innerHTML = '';

            if (data.courses && data.courses.length > 0) {
                data.courses.forEach(function (course) {
                    var courseBlock = '<div class="course-block">';
                    courseBlock += '<div class="course-item">';

                    var randomImage = images[Math.floor(Math.random() * images.length)];
                    courseBlock += '<img src="images/' + randomImage + '" class="course-image" alt="Картинка курса" title="Картинка курса"/>';

                    courseBlock += '<p id="course-name">' + course.name + '</p><br>';
                    courseBlock += '<a href="user_course.html?id=' + course._id + '&name=' + encodeURIComponent(course.name) + '&description=' + encodeURIComponent(course.description) + '&sections=' + encodeURIComponent(JSON.stringify(course.sections)) + '">продолжить обучение</a>';
                    courseBlock += '</div></div>';
                    courseList.innerHTML += courseBlock;
                });
            } else {
                console.error('Ошибка: courses is undefined or empty');
            }
        })
        .catch(error => {
            document.getElementById('loadingMessage').style.display = 'none';
            console.error('Ошибка:', error);
        });
});


document.getElementById('logout-button').addEventListener('click', function(event) {
    event.preventDefault();
    var modal = document.getElementById('modal');
    modal.showModal();
});

document.getElementById('confirm-logout').addEventListener('click', function() {
    var modal = document.getElementById('modal');
    modal.close();
    window.location.href='authorization.html';
});

document.getElementById('cancel-logout').addEventListener('click', function() {
    var modal = document.getElementById('modal');
    modal.close();
});

document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.querySelector('.navbar-menu li a[href="authorization.html"]');
    const token = localStorage.getItem('token');

    if (token) {
        loginLink.textContent = 'Выйти';
        loginLink.href = '#';
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});