document.getElementById('publish_button').addEventListener('click', async () => {
    const course_name = document.getElementById('course_name').value;
    const course_description = document.getElementById('course_description').value;

    const section_names = document.querySelectorAll('input[name="section_name"]');
    const lesson_names = document.querySelectorAll('input[name="lesson_name"]');
    const lesson_descriptions = document.querySelectorAll('textarea[name="lesson_description"]');
    const fileInputs = document.querySelectorAll('input[name="file_input"]');

    for (let i = 0; i < section_names.length; i++) {
        if (!section_names[i].value || !lesson_names[i].value || !lesson_descriptions[i].value || !fileInputs[i].files.length) {
            alert('Пожалуйста, заполните все поля и выберите файлы');
            return;
        }
    }

    const sections = [];

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';

    const loadingDiv = document.createElement('div');
    overlay.appendChild(loadingDiv);

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Добавляем ваш курс в базу';
    loadingText.style.color = 'white';
    overlay.appendChild(loadingText);

    const successDiv = document.createElement('div');
    successDiv.style.display = 'none';
    overlay.appendChild(successDiv);

    const successText = document.createElement('p');
    successText.textContent = 'Ваш курс успешно добавлен';
    successText.style.color = 'white';
    successText.style.display = 'none';
    overlay.appendChild(successText);

    document.body.appendChild(overlay);

    for (let i = 0; i < section_names.length; i++) {
        const formData = new FormData();
        formData.append('file_input', fileInputs[i].files[0]);
        formData.append('name', course_name);
        formData.append('description', course_description);
        formData.append('section_name', section_names[i].value);
        formData.append('lesson_name', lesson_names[i].value);
        formData.append('lesson_description', lesson_descriptions[i].value);

        try {
            const response = await fetch('/uploads', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке файла');
            }

            const data = await response.json();
            const fileUrl = data.fileUrl;

            sections.push({
                section_name: section_names[i].value,
                lessons: [{
                    lesson_name: lesson_names[i].value,
                    lesson_description: lesson_descriptions[i].value,
                    course_link: fileUrl
                }]
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    const courseData = {
        name: course_name,
        description: course_description,
        sections: sections
    };

    try {
        const courseResponse = await fetch('http://localhost:5000/auth/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        if (!courseResponse.ok) {
            throw new Error('Ошибка при добавлении нового курса');
        }

        loadingDiv.style.display = 'none';
        loadingText.style.display = 'none';
        successDiv.style.display = 'block';
        successText.style.display = 'block';
        setTimeout(function () {
            window.location.href = 'positive_addition_course.html';
        }, 1000);

        document.getElementById('course_name').value = '';
        document.getElementById('course_description').value = '';
        document.getElementById('lesson_description').value = '';
        document.getElementById('lesson_name').value = '';
        document.querySelectorAll('input[name="section_name"]').forEach(input => input.value = '');
        document.querySelectorAll('input[name="file_input"]').forEach(input => input.value = '');

    } catch (error) {
        alert('Ошибка:', error);
    } finally {
        document.body.removeChild(overlay);
    }
});


// window.addEventListener('beforeunload', function (e) {

//     var inputs = document.getElementsByTagName('input');

//     for (var i = 0; i < inputs.length; i++) {
//         if (inputs[i].value !== '') {
//             var message = 'Все введенные данные будут удалены!';
//             e.returnValue = message;
//             return message;
//         }
//     }
// });


const form = document.querySelector('form');
const addLessonButton = document.createElement('button');
addLessonButton.type = 'button';
addLessonButton.textContent = 'Добавить урок';
addLessonButton.className = 'add_lesson';
form.appendChild(addLessonButton);

document.addEventListener('click', function(event) {
    if (event.target && event.target.className == 'add_lesson') {
        event.preventDefault();
        const lessonHTML = `
            <div class="lesson">
                <div class="form-group">
                    <label>название урока:</label>
                    <input type="text" name="lesson_name" class="lesson_name">
                </div>
                <div class="form-group">
                    <label>описание урока:</label>
                    <textarea name="lesson_description" class="lesson_description"></textarea>
                </div>
                <div class="form-group">
                    <label>выбери файл урока:</label>
                    <input type="file" name="file_input">
                </div>
                <a href="#" class="remove_lesson">Удалить урок</a>
            </div>
        `;

        const fragment = document.createRange().createContextualFragment(lessonHTML);
        form.insertBefore(fragment, addLessonButton);
    }

    if (event.target && event.target.className == 'remove_lesson') {
        event.preventDefault();
        const lesson = event.target.closest('.lesson');
        if (lesson) {
            lesson.remove();
        }
    }
});


document.getElementById('add_section').addEventListener('click', function () {
    const sectionHTML = `
        <div class="section">
            <div class="form-group">
                <label>название раздела:</label>
                <input type="text" name="section_name" class="section_name">
            </div>
            <div class="form-group">
                <label>название урока:</label>
                <input type="text" name="lesson_name" class="lesson_name">
            </div>
            <div class="form-group">
                <label>описание урока:</label>
                <textarea name="lesson_description" class="lesson_description"></textarea>
            </div>
            <div class="form-group">
                <label>выбери файл урока:</label>
                <input type="file" name="file_input">
            </div>
            <a href="#" class="remove_section">Удалить раздел</a>
            <button type="button" class="add_lesson">Добавить урок</button>
        </div>
    `;

    const fragment = document.createRange().createContextualFragment(sectionHTML);
    const newSection = document.querySelector('form').appendChild(fragment);

    newSection.querySelector('.add_lesson').addEventListener('click', function(event) {
        event.preventDefault();
        const lessonHTML = `
            <div class="lesson">
                <div class="form-group">
                    <label>название урока:</label>
                    <input type="text" name="lesson_name" class="lesson_name">
                </div>
                <div class="form-group">
                    <label>описание урока:</label>
                    <textarea name="lesson_description" class="lesson_description"></textarea>
                </div>
                <div class="form-group">
                    <label>выбери файл урока:</label>
                    <input type="file" name="file_input">
                </div>
                <a href="#" class="remove_lesson">Удалить урок</a>
            </div>
        `;

        const lessonFragment = document.createRange().createContextualFragment(lessonHTML);
        newSection.insertBefore(lessonFragment, newSection.querySelector('.add_lesson'));
    });
});

document.addEventListener('click', function(event) {
    if (event.target && event.target.className == 'remove_section') {
        event.preventDefault();
        const section = event.target.closest('.section');
        if (section) {
            section.remove();
        }
    }

    if (event.target && event.target.className == 'remove_lesson') {
        event.preventDefault();
        const lesson = event.target.closest('.lesson');
        if (lesson) {
            lesson.remove();
        }
    }
});

function goBack() {
    window.history.back();
}