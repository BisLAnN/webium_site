var images = ['1.jpg', 'course-image.jpg', '2.jpg', '3.jpg', '4.jpg'];

document.addEventListener('DOMContentLoaded', function () {
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

                courseBlock += '<br></br><a href="developer_course_edit.html?id=' + course._id + '&name=' + encodeURIComponent(course.name) + '&description=' + encodeURIComponent(course.description) + '&sections=' + encodeURIComponent(JSON.stringify(course.sections)) + '">просмотр</a>';
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