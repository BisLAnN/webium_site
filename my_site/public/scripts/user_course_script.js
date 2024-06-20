function goBack() {
    window.history.back();
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
            lessonDiv.style.position = 'relative';

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

            const courseFile = document.createElement('embed');
            courseFile.className = 'course_file';
            courseFile.width = '900px';
            courseFile.height = '500px';
            courseFile.src = `${lesson.course_link}`;
            lessonDiv.appendChild(courseFile);

            const completionCheckbox = document.createElement('input');
            completionCheckbox.type = 'checkbox';
            completionCheckbox.className = 'completion-checkbox';
            completionCheckbox.style.position = 'absolute';
            completionCheckbox.style.top = '10px';
            completionCheckbox.style.right = '10px';
            completionCheckbox.onchange = updateProgress;
            lessonDiv.appendChild(completionCheckbox);

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = 'нажми сюда, если данный урок был освоен →';
            checkboxLabel.style.position = 'absolute';
            checkboxLabel.style.top = '10px';
            checkboxLabel.style.right = '35px';
            checkboxLabel.style.opacity = '0.7';
            checkboxLabel.style.fontSize = '12px';
            lessonDiv.appendChild(checkboxLabel);

            lessonsContainer.appendChild(lessonDiv);
        });

        sectionsDiv.appendChild(sectionElement);
    });

    loadProgress();

    function updateProgress() {
        const lessons = document.querySelectorAll('.lesson');
        let totalLessons = lessons.length;
        let completedLessons = 0;

        lessons.forEach(lesson => {
            if (lesson.querySelector('.completion-checkbox').checked) {
                completedLessons++;
            }
        });

        const progress = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;
        const progressBar = document.getElementById('courseProgress');
        const progressText = document.getElementById('progressText');

        progressBar.value = progress;
        progressText.textContent = `${progress.toFixed(2)}%`;

        saveProgress();
    }

    function saveProgress() {
        const lessons = document.querySelectorAll('.lesson');
        let progressState = [];

        lessons.forEach(lesson => {
            const isChecked = lesson.querySelector('.completion-checkbox').checked;
            progressState.push(isChecked);
        });

        localStorage.setItem('progressState', JSON.stringify(progressState));
    }

    function loadProgress() {
        const progressState = JSON.parse(localStorage.getItem('progressState'));
        if (progressState) {
            const lessons = document.querySelectorAll('.lesson');
            lessons.forEach((lesson, index) => {
                lesson.querySelector('.completion-checkbox').checked = progressState[index];
            });

            updateProgress();
        }
    }
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