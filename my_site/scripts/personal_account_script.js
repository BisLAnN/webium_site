document.addEventListener('DOMContentLoaded', function () {
    const username = 'user';
    document.getElementById('loadingMessage').style.display = 'block';
    fetch(`http://localhost:5000/auth/personalAccount/${username}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingMessage').style.display = 'none';
            const courseList = document.getElementById('courseList');
            courseList.innerHTML = '';

            if (data.courses) {
                data.courses.forEach(function (course) {
                    var courseBlock = '<div class="course-block">';
                    courseBlock += '<div class="course-item">';
                    courseBlock += '<p id="course-name">' + course.name + '</p>';
                    courseBlock += '<a href="user_course.html?id=' + course._id + '&name=' + encodeURIComponent(course.name) + '&description=' + encodeURIComponent(course.description) + '&sections=' + encodeURIComponent(JSON.stringify(course.sections)) + '">продолжить</a>';
                    courseBlock += '</div></div>';
                    courseList.innerHTML += courseBlock;
                });
            } else {
                console.error('Ошибка: courses is undefined');
            }
        })
        .catch(error => console.error('Ошибка:', error));
});
