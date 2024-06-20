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
    }

    else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

document.addEventListener('DOMContentLoaded', function () {
    var courseImageElement = document.querySelector('.course-image');
    courseImageElement.style.backgroundColor = getRandomColor();
});

var colors = ['#F5F6FA', '#F3F0EF', '#F0F0F3', '#E8EAF0'];

function getRandomColor() {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}