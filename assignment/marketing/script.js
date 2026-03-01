// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const pageBody = document.body;

if (hamburger && navMenu) {
    const setMenuState = (isOpen) => {
        hamburger.classList.toggle('active', isOpen);
        navMenu.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        navMenu.setAttribute('aria-hidden', String(!isOpen));
        pageBody.classList.toggle('menu-open', isOpen);
    };

    hamburger.addEventListener('click', () => {
        const nextState = !navMenu.classList.contains('active');
        setMenuState(nextState);
    });

    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const nextState = !navMenu.classList.contains('active');
            setMenuState(nextState);
        }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });

    setMenuState(false);
}

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    item.addEventListener('click', () => {
        // Close all other items
        accordionItems.forEach(other => {
            if (other !== item) {
                other.classList.remove('active');
            }
        });
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Swiper initialization
if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        centeredSlides: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1024: {
                slidesPerView: 1.5,
                spaceBetween: 30,
            }
        }
    });
}