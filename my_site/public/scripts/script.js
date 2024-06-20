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

function confirmSubscription() {
    var confirmation = confirm("Вы хотите подписаться на наш канал в Telegram?");

    if (confirmation) {
        window.location.href = "https://t.me/+uwEMrh0cOpJhNzhi";
    }
}

function search() {
    var searchText = document.getElementById('search-input').value;
    console.log('Вы выполнили поиск: ' + searchText);
}


document.addEventListener('DOMContentLoaded', function () {
    var h1 = document.querySelector('h1');

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function handleScroll() {
        if (isElementInViewport(h1)) {
            h1.classList.add('fade-in');
            window.removeEventListener('scroll', handleScroll);
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
});


function confirmSubscription() {
    var confirmation = confirm("Вы хотите подписаться на наш канал в Telegram?");

    if (confirmation) {
        window.location.href = "https://t.me/+-P5S3TIpeAgxMjYy";
    }
}

let currentSlide = 1;


function changeSlide(n) {
    showSlide(currentSlide += n);
}


function showSlide(n) {
    let slides = document.getElementsByClassName("slide");

    if (n > slides.length) {
        currentSlide = 1;
    }

    else if (n < 1) {
        currentSlide = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.transform = "translateX(" + ((i - currentSlide + 1) * 100) + "%)";
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
});


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


document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault();
    var modal = document.getElementById('modal');
    modal.showModal();
});

document.getElementById('confirm-logout').addEventListener('click', function () {
    var modal = document.getElementById('modal');
    modal.close();
    window.location.href = 'authorization.html';
});

document.getElementById('cancel-logout').addEventListener('click', function () {
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
