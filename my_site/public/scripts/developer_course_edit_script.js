function goBack() {
    window.history.back();
}

function saveChanges() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const updatedData = {};

    const courseName = document.getElementById('courseName')?.textContent.trim();
    if (!courseName) {
        showNotification('Название курса не может быть пустым', 'error');
        return;
    }
    updatedData.name = courseName;

    const description = document.getElementById('description')?.textContent.trim();
    if (!description) {
        showNotification('Описание курса не может быть пустым', 'error');
        return;
    }
    updatedData.description = description;

    const sectionsContainer = document.getElementById('sections');
    if (!sectionsContainer) {
        showNotification('Контейнер для разделов не найден', 'error');
        return;
    }

    const updatedSections = Array.from(sectionsContainer.children).map(sectionDiv => {
        const sectionNameDiv = sectionDiv.querySelector('.section_name span');
        if (!sectionNameDiv) {
            showNotification('Элемент section_name не найден', 'error');
            throw new Error('Invalid section structure');
        }

        let sectionName = sectionNameDiv.textContent.trim();
        if (!sectionName) {
            showNotification('Название раздела не может быть пустым', 'error');
            throw new Error('Invalid section name');
        }

        const lessonsContainer = sectionDiv.querySelector('.lessons');
        if (!lessonsContainer) {
            showNotification('Контейнер для уроков не найден', 'error');
            throw new Error('Invalid section structure');
        }

        const updatedLessons = Array.from(lessonsContainer.children).map(lessonDiv => {
            const lessonNameSpan = lessonDiv.querySelector('.lesson_name span');
            const lessonDescriptionSpan = lessonDiv.querySelector('.lesson_description span');
            const courseLinkInput = lessonDiv.querySelector('.course_link input');

            if (!lessonNameSpan || !lessonDescriptionSpan || !courseLinkInput) {
                showNotification('Элементы lesson_name, lesson_description или course_link не найдены', 'error');
                throw new Error('Invalid lesson structure');
            }

            const lessonName = lessonNameSpan.textContent.trim();
            const lessonDescription = lessonDescriptionSpan.textContent.trim();
            let courseLink = courseLinkInput.value.trim();

            if (!lessonName || !lessonDescription || !courseLink) {
                showNotification('Все поля урока должны быть заполнены', 'error');
                throw new Error('Invalid lesson data');
            }

            // Убираем префикс localhost если он присутствует
            const localhostPrefix = 'http://localhost:5000';
            if (courseLink.startsWith(localhostPrefix)) {
                courseLink = courseLink.replace(localhostPrefix, '');
            }

            return {
                lesson_name: lessonName,
                lesson_description: lessonDescription,
                course_link: courseLink // Добавляем ссылку на файл урока
            };
        });

        return {
            section_name: sectionName,
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
    sectionDiv.style.border = '1px solid #ccc';
    sectionDiv.style.padding = '10px';
    sectionDiv.style.margin = '10px 0';

    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section_header';
    sectionDiv.appendChild(sectionHeader);

    const sectionName = document.createElement('div');
    sectionName.contentEditable = 'true';
    sectionName.innerHTML = '<span style="font-weight: bold;">Раздел: </span><span></span>';
    sectionName.className = 'section_name';
    sectionHeader.appendChild(sectionName);

    const deleteSectionButton = document.createElement('button');
    deleteSectionButton.textContent = 'Удалить данный раздел';
    deleteSectionButton.onclick = () => sectionDiv.remove();
    sectionHeader.appendChild(deleteSectionButton);

    const toggleLessonsButton = document.createElement('button');
    toggleLessonsButton.textContent = 'Показать уроки';
    toggleLessonsButton.onclick = () => {
        lessonsContainer.style.display = lessonsContainer.style.display === 'none' ? 'block' : 'none';
        toggleLessonsButton.textContent = lessonsContainer.style.display === 'none' ? 'Показать уроки' : 'Скрыть уроки';
    };
    sectionHeader.appendChild(toggleLessonsButton);

    const lessonsContainer = document.createElement('div');
    lessonsContainer.className = 'lessons';
    lessonsContainer.style.borderTop = '1px solid #ccc';
    lessonsContainer.style.paddingTop = '10px';
    lessonsContainer.style.display = 'none';
    sectionDiv.appendChild(lessonsContainer);

    const addLessonButton = document.createElement('button');
    addLessonButton.textContent = 'Добавить Урок';
    addLessonButton.onclick = () => addLesson(lessonsContainer);
    sectionDiv.appendChild(addLessonButton);

    sectionsContainer.appendChild(sectionDiv);
}

function addLesson(lessonsContainer) {
    const lessonDiv = document.createElement('div');
    lessonDiv.className = 'lesson';
    lessonDiv.style.border = '1px solid #ccc';
    lessonDiv.style.padding = '10px';
    lessonDiv.style.margin = '10px 0';

    const lessonName = document.createElement('div');
    lessonName.contentEditable = 'true';
    lessonName.innerHTML = '<span style="font-weight: bold;">Название урока:</span> <span></span>';
    lessonName.className = 'lesson_name';
    lessonDiv.appendChild(lessonName);

    const lessonDescription = document.createElement('div');
    lessonDescription.contentEditable = 'true';
    lessonDescription.innerHTML = '<span style="font-weight: bold;">Описание урока:</span> <span></span>';
    lessonDescription.className = 'lesson_description';
    lessonDiv.appendChild(lessonDescription);

    const courseLink = document.createElement('div');
    courseLink.className = 'course_link';
    courseLink.innerHTML = '<span style="font-weight: bold;">Ссылка на файл урока:</span> <input type="url" value="#">';
    lessonDiv.appendChild(courseLink);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'file_input';
    lessonDiv.appendChild(fileInput);

    const deleteLessonButton = document.createElement('button');
    deleteLessonButton.textContent = '- урок';
    deleteLessonButton.onclick = () => lessonDiv.remove();
    lessonDiv.appendChild(deleteLessonButton);

    lessonsContainer.appendChild(lessonDiv);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const name = decodeURIComponent(urlParams.get('name'));
    const description = decodeURIComponent(urlParams.get('description'));
    const sections = JSON.parse(decodeURIComponent(urlParams.get('sections')));

    document.getElementById('courseName').textContent = name;
    document.getElementById('description').textContent = description;

    const sectionsDiv = document.getElementById('sections');
    sectionsDiv.innerHTML = '';
    sections.forEach((section) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section';
        sectionElement.style.border = '1px solid #ccc';
        sectionElement.style.padding = '10px';
        sectionElement.style.margin = '10px 0';

        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section_header';
        sectionElement.appendChild(sectionHeader);

        const sectionName = document.createElement('div');
        sectionName.contentEditable = 'true';
        sectionName.innerHTML = `<span><b>${section.section_name}</b></span>`;
        sectionName.className = 'section_name';
        sectionHeader.appendChild(sectionName);

        const deleteSectionButton = document.createElement('button');
        deleteSectionButton.textContent = 'Удалить данный раздел';
        deleteSectionButton.onclick = () => sectionElement.remove();
        sectionHeader.appendChild(deleteSectionButton);

        const toggleLessonsButton = document.createElement('button');
        toggleLessonsButton.textContent = 'Показать уроки';
        toggleLessonsButton.onclick = () => {
            lessonsContainer.style.display = lessonsContainer.style.display === 'none' ? 'block' : 'none';
            toggleLessonsButton.textContent = lessonsContainer.style.display === 'none' ? 'Показать уроки' : 'Скрыть уроки';
        };
        sectionHeader.appendChild(toggleLessonsButton);

        const lessonsContainer = document.createElement('div');
        lessonsContainer.className = 'lessons';
        lessonsContainer.style.borderTop = '1px solid #ccc';
        lessonsContainer.style.paddingTop = '10px';
        lessonsContainer.style.display = 'none';
        sectionElement.appendChild(lessonsContainer);

        section.lessons.forEach((lesson) => {
            const lessonDiv = document.createElement('div');
            lessonDiv.className = 'lesson';
            lessonDiv.style.border = '1px solid #ccc';
            lessonDiv.style.padding = '10px';
            lessonDiv.style.margin = '10px 0';

            const lessonName = document.createElement('div');
            lessonName.contentEditable = 'true';
            lessonName.innerHTML = `<span>${lesson.lesson_name}</span>`;
            lessonName.className = 'lesson_name';
            lessonDiv.appendChild(lessonName);

            const lessonDescription = document.createElement('div');
            lessonDescription.contentEditable = 'true';
            lessonDescription.innerHTML = `<span>${lesson.lesson_description}</span>`;
            lessonDescription.className = 'lesson_description';
            lessonDiv.appendChild(lessonDescription);

            const courseLink = document.createElement('div');
            courseLink.className = 'course_link';
            courseLink.innerHTML = `<span style="font-weight: bold;">Ссылка на файл урока:</span> <input type="url" value="${lesson.course_link}">`;
            lessonDiv.appendChild(courseLink);

            const courseFile = document.createElement('embed');
            courseFile.className = 'course_file';
            courseFile.width = '900px';
            courseFile.height = '500px';
            courseFile.src = `${lesson.course_link}`;
            lessonDiv.appendChild(courseFile);
            
            const lineBreak = document.createElement('br');
            lessonDiv.appendChild(lineBreak);
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.className = 'file_input';
            lessonDiv.appendChild(fileInput);

            lessonDiv.appendChild(lineBreak);
            const deleteLessonButton = document.createElement('button');
            deleteLessonButton.textContent = '- урок';
            deleteLessonButton.onclick = () => lessonDiv.remove();
            lessonDiv.appendChild(deleteLessonButton);

            lessonsContainer.appendChild(lessonDiv);
        });

        const addLessonButton = document.createElement('button');
        addLessonButton.textContent = '+ урок';
        addLessonButton.onclick = () => addLesson(lessonsContainer);
        sectionElement.appendChild(addLessonButton);

        sectionsDiv.appendChild(sectionElement);
    });

    var messageElement = document.createElement('div');
    messageElement.innerHTML = "<b>Внимание!</b> Включен режим редактирования контента";
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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    notification.style.color = type === 'success' ? '#155724' : '#721c24';
    notification.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    hamburger.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});