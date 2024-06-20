function showContent(id) {
    var contents = document.getElementsByClassName('content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

function loadUsers() {
    fetch('http://localhost:5000/auth/users')
        .then(response => response.json())
        .then(data => {
            console.log('Полученные данные о пользователях:', data);

            const usersList = document.getElementById('usersList');
            if (usersList) {
                usersList.innerHTML = '';
                document.getElementById('usersCount').textContent = "Общее количество пользователей: " + data.length;

                data.forEach(function (user) {
                    var userBlock = '<div class="user-block" data-role="' + user.role + '">';
                    userBlock += '<div class="user-item">';
                    userBlock += '<img src="images/default.jpeg" alt="Фотография пользователя" title="Фотография пользователя">';
                    userBlock += '<p id="user-username"><b>логин:</b> ' + user.username + '</p>';
                    userBlock += '<p id="user-role"><b>роль:</b> ' + user.role + '</p><br>';

                    if (user.role === 'Администратор' || user.role === 'Разработчик') {
                        userBlock += '<a href="#" id="delete-user" onclick="openDeleteDialog(\'' + user.username + '\')">удалить</a>';
                    }

                    userBlock += '</div></div>';
                    usersList.innerHTML += userBlock;
                });
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function openDeleteDialog() {
    const dialog = document.getElementById('deleteDialog');
    dialog.showModal();
}

document.getElementById('delete-confirm').addEventListener('input', function (e) {
    const deleteButton = document.getElementById('delete-button');
    if (e.target.value === 'УДАЛИТЬ') {
        deleteButton.disabled = false;
    } else {
        deleteButton.disabled = true;
    }
});

function searchUsers() {
    let input = document.getElementById('searchUserInput');
    let filter = input.value.toUpperCase();

    let userBlocks = document.getElementsByClassName('user-block');
    let noUsersMessage = document.getElementById('noUsersMessage');

    let found = false;
    for (let i = 0; i < userBlocks.length; i++) {
        let username = userBlocks[i].getElementsByClassName('user-item')[0].getElementsByTagName('p')[0];
        if (username) {
            let txtValue = username.textContent || username.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                userBlocks[i].style.display = "";
                found = true;
            } else {
                userBlocks[i].style.display = "none";
            }
        }
    }

    noUsersMessage.style.display = found ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    showContent('courses');
    document.getElementById('loadingMessage').style.display = 'block';

    fetch('http://localhost:5000/auth/courses')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingMessage').style.display = 'none';
            const courseList = document.getElementById('courseList');
            courseList.innerHTML = '';
            document.getElementById('coursesCount').textContent = "Общее количество курсов: " + data.length;

            data.forEach(function (course) {
                var courseBlock = '<div class="course-block">';
                courseBlock += '<div class="course-item">';
                courseBlock += '<p id="course-name"><b>' + course.name + '</b></p>';
                courseBlock += '<p id="course-category">' + course.category + '</p><br><br><br>';
                courseBlock += '<a href="course.html?id=' + course._id + '&name=' + encodeURIComponent(course.name) + '&description=' + encodeURIComponent(course.description) + '&sections=' + encodeURIComponent(JSON.stringify(course.sections)) + '">просмотр курса</a>';
                courseBlock += '</div></div>';
                courseList.innerHTML += courseBlock;
            });
        })
        .catch(error => console.error('Ошибка:', error));

    loadUsers();

    var addUserButtonElement = document.getElementById('addUser');
    var addUserDialog = document.getElementById('addUserDialog');
    var cancelButton = document.getElementById('cancelButton');
    var searchUserInput = document.getElementById('searchUserInput');
    searchUserInput.addEventListener('keyup', searchUsers);

    var filterCourseLinks = document.getElementsByClassName('filter-course-link');
    for (let i = 0; i < filterCourseLinks.length; i++) {
        filterCourseLinks[i].addEventListener('click', function (event) {
            event.preventDefault();
            filterCourses(this.dataset.category);
        });
    }

    var filterUserLinks = document.getElementsByClassName('filter-user-link');
    for (let i = 0; i < filterUserLinks.length; i++) {
        filterUserLinks[i].addEventListener('click', function (event) {
            event.preventDefault();
            filterUsers(this.dataset.role);
        });
    }

    addUserButtonElement.addEventListener('click', function () {
        addUserDialog.showModal();
    });

    addUserButton.addEventListener('click', function () {
        addUserFunction();
    });

    cancelButton.addEventListener('click', function () {
        addUserDialog.close();
    });
});

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

function showNotification(message, isSuccess) {
    var notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.right = '20px';
    notification.style.bottom = '20px';
    notification.style.padding = '10px';
    notification.style.color = isSuccess ? 'green' : 'red';
    notification.style.border = '2px solid';
    notification.style.borderColor = isSuccess ? 'green' : 'red';
    notification.style.borderRadius = '5px';
    notification.style.backgroundColor = 'white';
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        document.body.removeChild(notification);
    }, 5000);
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

function filterUsers(role) {
    let userBlocks = document.getElementsByClassName('user-block');
    let noUsersMessage = document.getElementById('noUsersMessage');
    let found = false;
    for (let i = 0; i < userBlocks.length; i++) {
        if (role === 'all' || userBlocks[i].dataset.role === role) {
            userBlocks[i].style.display = "";
            found = true;
        } else {
            userBlocks[i].style.display = "none";
        }
    }
    noUsersMessage.style.display = found ? 'none' : 'block';
}

function addUserFunction() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var role = document.getElementById('role').value;

    fetch('http://localhost:5000/auth/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            role: role
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успех:', data);
            showNotification('Новый пользователь успешно добавлен', true);
            loadUsers();
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            showNotification('Ошибка при добавлении нового пользователя', false);
        });
}

document.getElementById('delete-button').addEventListener('click', function () {
    const username = document.getElementById('delete-user').textContent;
    const reason = document.getElementById('delete-reason').value;

    fetch(`http://localhost:5000/auth/userDelete/${username}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showNotification(data.message);
                loadUsers();
            } else {
                alert('Ошибка при удалении пользователя');
            }
        })
        .catch(error => console.error('Error:', error));
});

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.right = '20px';
    notification.style.bottom = '20px';
    notification.style.padding = '10px';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

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