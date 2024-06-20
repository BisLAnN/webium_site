document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    var name = decodeURIComponent(urlParams.get('name'));
    var description = decodeURIComponent(urlParams.get('description'));
    var sections = JSON.parse(decodeURIComponent(urlParams.get('sections')));

    var courseNameElement = document.getElementById('courseName');
    courseNameElement.textContent = name;
    courseNameElement.setAttribute('readonly', true);

    var descriptionElement = document.getElementById('description');
    descriptionElement.textContent = description;
    descriptionElement.setAttribute('readonly', true);

    var sectionsDiv = document.getElementById('sections');
    sections.forEach((section, index) => {
        var sectionElement = document.createElement('div');
        sectionElement.id = 'section_' + index;
        sectionElement.innerHTML = "<b>Раздел:</b> " + section.section_name;
        sectionsDiv.appendChild(sectionElement);

        var lessonsDiv = document.createElement('div');
        lessonsDiv.id = 'lessons_' + index;
        section.lessons.forEach((lesson, lessonIndex) => {
            var lessonElement = document.createElement('div');
            lessonElement.id = 'lesson_' + lessonIndex;
            lessonElement.innerHTML ='<p></p>' + lesson.lesson_description;
            lessonsDiv.appendChild(lessonElement);

            var br = document.createElement('br');
            lessonsDiv.appendChild(br);
        });
        sectionsDiv.appendChild(lessonsDiv);
    });

    var subscribeBtn = document.getElementById('subscribeBtn');
    subscribeBtn.addEventListener('click', function() {
        var courseId = id;
        subscribeToCourse(courseId);
    });

    var courseImageElement = document.querySelector('.course-image');
    courseImageElement.style.backgroundColor = getRandomColor();

    const loginLink = document.querySelector('.navbar-menu li a[href="authorization.html"]');
    const educationLink = document.querySelector('#my-education');
    const token = localStorage.getItem('token');

    if (token) {
        loginLink.textContent = 'Выйти';
        loginLink.href = '#';
        loginLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });

        educationLink.textContent = 'Мое обучение';
    } else {
        educationLink.style.display = 'none';
    }
});

function goBack() {
    window.history.back();
}

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function getRandomColor() {
    var colors = ['#F5F6FA', '#F3F0EF', '#F0F0F3', '#E8EAF0'];
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

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

function subscribeToCourse(courseId) {
    var token = localStorage.getItem('token');
    if (!token) {
        alert('Пожалуйста, войдите в систему для подписки на курс.');
        return;
    }

    fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: courseId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('Ошибка при подписке на курс');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});
