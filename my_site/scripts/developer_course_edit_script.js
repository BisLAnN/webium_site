function goBack() {
    window.history.back();
}

function saveChanges() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const updatedData = {};

    const courseName = document.getElementById('courseName').textContent.trim();
    if (!courseName) {
        showNotification('Название курса не может быть пустым', 'error');
        return;
    }
    updatedData.name = courseName;

    const description = document.getElementById('description').textContent.trim();
    if (!description) {
        showNotification('Описание курса не может быть пустым', 'error');
        return;
    }
    updatedData.description = description;

    const sectionsContainer = document.getElementById('sections');
    const updatedSections = Array.from(sectionsContainer.children).map(sectionDiv => {
        const sectionNameInput = sectionDiv.querySelector('.section_name').value.trim();
        if (!sectionNameInput) {
            showNotification('Название раздела не может быть пустым', 'error');
            throw new Error('Invalid section name');
        }

        const lessonsContainer = sectionDiv.querySelector('.lessons');
        const updatedLessons = Array.from(lessonsContainer ? lessonsContainer.children : []).map(lessonDiv => {
            const lessonNameInput = lessonDiv.querySelector('.lesson_name').value.trim();
            const lessonDescriptionInput = lessonDiv.querySelector('.lesson_description').value.trim();
            const courseLinkInput = lessonDiv.querySelector('.course_link').value.trim();

            if (!lessonNameInput || !lessonDescriptionInput || !courseLinkInput) {
                showNotification('Все поля урока должны быть заполнены', 'error');
                throw new Error('Invalid lesson data');
            }

            return {
                lesson_name: lessonNameInput,
                lesson_description: lessonDescriptionInput,
                course_link: courseLinkInput,
            };
        });

        return {
            section_name: sectionNameInput,
            lessons: updatedLessons,
        };
    }).filter(Boolean);

    if (updatedSections.length > 0) {
        updatedData.sections = updatedSections;
    } else {
        showNotification('Должен быть хотя бы один раздел', 'error');
        return;
    }

    fetch(`http://localhost:5000/auth/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Успех:', data);
        showNotification('Изменения успешно сохранены!', 'success');
        setTimeout(() => {
            window.location.href = 'developer.html';
        }, 5000);
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showNotification('Ошибка сохранения данных', 'error');
    });
}

function addSection() {
    const sectionsContainer = document.getElementById('sections');

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    const sectionNameInput = document.createElement('input');
    sectionNameInput.type = 'text';
    sectionNameInput.placeholder = 'Название раздела';
    sectionNameInput.className = 'section_name';
    sectionDiv.appendChild(sectionNameInput);

    const deleteSectionButton = document.createElement('button');
    deleteSectionButton.textContent = 'Удалить Раздел';
    deleteSectionButton.onclick = () => sectionDiv.remove();
    sectionDiv.appendChild(deleteSectionButton);

    const lessonsContainer = document.createElement('div');
    lessonsContainer.className = 'lessons';

    const addLessonButton = document.createElement('button');
    addLessonButton.textContent = 'Добавить Урок';
    addLessonButton.onclick = () => addLesson(lessonsContainer);
    sectionDiv.appendChild(addLessonButton);

    sectionDiv.appendChild(lessonsContainer);
    sectionsContainer.appendChild(sectionDiv);
}

function addLesson(lessonsContainer) {
    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson';

    const lessonNameInput = document.createElement('input');
    lessonNameInput.type = 'text';
    lessonNameInput.placeholder = 'Название урока';
    lessonNameInput.className = 'lesson_name';
    lessonDiv.appendChild(lessonNameInput);

    const lessonDescriptionInput = document.createElement('input');
    lessonDescriptionInput.type = 'text';
    lessonDescriptionInput.placeholder = 'Описание урока';
    lessonDescriptionInput.className = 'lesson_description';
    lessonDiv.appendChild(lessonDescriptionInput);

    const courseLinkInput = document.createElement('input');
    courseLinkInput.type = 'text';
    courseLinkInput.placeholder = 'Ссылка на курс';
    courseLinkInput.className = 'course_link';
    lessonDiv.appendChild(courseLinkInput);

    const deleteLessonButton = document.createElement('button');
    deleteLessonButton.textContent = 'Удалить Урок';
    deleteLessonButton.onclick = () => lessonDiv.remove();
    lessonDiv.appendChild(deleteLessonButton);

    lessonsContainer.appendChild(lessonDiv);
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const name = decodeURIComponent(urlParams.get('name'));
    const description = decodeURIComponent(urlParams.get('description'));
    const sections = JSON.parse(decodeURIComponent(urlParams.get('sections')));

    document.getElementById('courseName').textContent = name;
    document.getElementById('description').textContent = description;

    const sectionsDiv = document.getElementById('sections');
    sections.forEach((section, index) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section';

        const sectionNameInput = document.createElement('input');
        sectionNameInput.type = 'text';
        sectionNameInput.value = section.section_name;
        sectionNameInput.className = 'section_name';
        sectionElement.appendChild(sectionNameInput);

        const deleteSectionButton = document.createElement('button');
        deleteSectionButton.textContent = 'Удалить Раздел';
        deleteSectionButton.onclick = () => sectionElement.remove();
        sectionElement.appendChild(deleteSectionButton);

        const lessonsContainer = document.createElement('div');
        lessonsContainer.className = 'lessons';

        section.lessons.forEach((lesson, lessonIndex) => {
            const lessonDiv = document.createElement('div');
            lessonDiv.className = 'lesson';

            const lessonNameInput = document.createElement('input');
            lessonNameInput.type = 'text';
            lessonNameInput.value = lesson.lesson_name;
            lessonNameInput.className = 'lesson_name';
            lessonDiv.appendChild(lessonNameInput);

            const lessonDescriptionInput = document.createElement('input');
            lessonDescriptionInput.type = 'text';
            lessonDescriptionInput.value = lesson.lesson_description;
            lessonDescriptionInput.className = 'lesson_description';
            lessonDiv.appendChild(lessonDescriptionInput);

            const courseLinkInput = document.createElement('input');
            courseLinkInput.type = 'text';
            courseLinkInput.value = lesson.course_link;
            courseLinkInput.className = 'course_link';
            lessonDiv.appendChild(courseLinkInput);

            const deleteLessonButton = document.createElement('button');
            deleteLessonButton.textContent = 'Удалить Урок';
            deleteLessonButton.onclick = () => lessonDiv.remove();
            lessonDiv.appendChild(deleteLessonButton);

            lessonsContainer.appendChild(lessonDiv);

            // Add embed for course link
            const courseEmbed = document.createElement('embed');
            courseEmbed.src = lesson.course_link;
            courseEmbed.type = 'application/pdf';
            courseEmbed.width = '100%';
            courseEmbed.height = '400px';
            lessonDiv.appendChild(courseEmbed);
        });

        const addLessonButton = document.createElement('button');
        addLessonButton.textContent = 'Добавить Урок';
        addLessonButton.onclick = () => addLesson(lessonsContainer);
        sectionElement.appendChild(addLessonButton);

        sectionElement.appendChild(lessonsContainer);
        sectionsDiv.appendChild(sectionElement);
    });

    var messageElement = document.createElement('div');
    messageElement.innerHTML = "<b>Вниамние!</b> Включен режим редактирования контента";
    messageElement.style.position = 'fixed';
    messageElement.style.right = '20px';
    messageElement.style.bottom = '20px';
    messageElement.style.padding = '10px';
    messageElement.style.backgroundColor = '#f8d7da';
    messageElement.style.color = '#721c24';
    messageElement.style.border = '1px solid #f5c6cb';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';

    document.body.appendChild(messageElement);

    setTimeout(function () {
        document.body.removeChild(messageElement);
    }, 5000);
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.right = '20px';
    notification.style.bottom = '20px';
    notification.style.padding = '10px';
    notification.style.color = type === 'error' ? 'red' : 'green';
    notification.style.backgroundColor = type === 'error' ? '#F8D7DA' : '#BADBAD';
    notification.style.border = type === 'error' ? 'red solid 1px' : 'green solid 1px';
    notification.style.borderRadius = '12px';

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
