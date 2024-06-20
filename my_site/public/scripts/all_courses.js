document.addEventListener('DOMContentLoaded', function () {

    var images = ['1.jpg', 'course-image.jpg', '2.jpg', '3.jpg', '4.jpg'];

    document.getElementById('loadingMessage').style.display = 'block';
    fetch('http://localhost:5000/auth/courses')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingMessage').style.display = 'none';
            const courseList = document.getElementById('courseList');
            courseList.innerHTML = '';
            data.forEach(function (course) {
                var courseBlock = '<div class="course-block">';
                courseBlock += '<div class="course-item">';
                courseBlock += '<p id="course-name">' + course.name + '</p>';

                var randomImage = images[Math.floor(Math.random() * images.length)];
                courseBlock += '<img src="images/' + randomImage + '" class="course-image" alt="Картинка курса" title="Картинка курса"/>';

                courseBlock += '<br><br><a href="course.html?id=' + course._id + '&name=' + encodeURIComponent(course.name) + '&description=' + encodeURIComponent(course.description) + '&sections=' + encodeURIComponent(JSON.stringify(course.sections)) + '">перейти на курс</a>';
                courseBlock += '</div></div>';
                courseList.innerHTML += courseBlock;
            });
        })
        .catch(error => console.error('Ошибка:', error));
});


window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    }

    else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function searchCourses() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();

    let courseBlocks = document.getElementsByClassName('course-block');
    let noCoursesMessage = document.getElementById('noCoursesMessage');

    let found = false;
    for (let i = 0; i < courseBlocks.length; i++) {
        let title = courseBlocks[i].getElementsByClassName('course-item')[0].getElementsByTagName('p')[0];
        if (title) {
            let txtValue = title.textContent || title.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                courseBlocks[i].style.display = "";
                found = true;
            } else {
                courseBlocks[i].style.display = "none";
            }
        }
    }

    noCoursesMessage.style.display = found ? 'none' : 'block';
}

function filterCourses(category) {
    let courseBlocks = document.getElementsByClassName('course-block');
    let noCoursesMessage = document.getElementById('noCoursesMessage');
    let found = false;
    for (let i = 0; i < courseBlocks.length; i++) {
        if (category === 'all' || courseBlocks[i].dataset.category === category) {
            courseBlocks[i].style.display = "";
            found = true;
        } else {
            courseBlocks[i].style.display = "none";
        }
    }
    noCoursesMessage.style.display = found ? 'none' : 'block';
}

var filterCourseLinks = document.getElementsByClassName('filter-course-link');
for (let i = 0; i < filterCourseLinks.length; i++) {
    filterCourseLinks[i].addEventListener('click', function (event) {
        event.preventDefault();
        filterCourses(this.dataset.category);
    });
}

document.addEventListener('DOMContentLoaded', function () {
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
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});