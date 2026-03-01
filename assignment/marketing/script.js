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

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuState(false);
            hamburger.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    document.addEventListener('click', (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedHamburger = hamburger.contains(event.target);
        if (!clickedInsideMenu && !clickedHamburger && navMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });

    setMenuState(false);
}

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
    }

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

    item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            item.click();
        }
    });
});

// Swiper initialization
const initTestimonialsSwiper = () => {
    const swiperElement = document.querySelector('.mySwiper');

    if (!swiperElement || typeof Swiper === 'undefined' || swiperElement.dataset.swiperInitialized === 'true') {
        return;
    }

    const totalSlides = swiperElement.querySelectorAll('.swiper-wrapper > .swiper-slide').length;
    const mobilePrev = document.getElementById('mobile-prev');
    const mobileNext = document.getElementById('mobile-next');
    const mobileCount = document.getElementById('mobile-slide-count');

    const swiperInstance = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: false,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 1.5,
                spaceBetween: 30,
            }
        }
    });

    const updateMobileCount = () => {
        if (!mobileCount || totalSlides === 0) {
            return;
        }

        const visibleSlide = swiperInstance.activeIndex + 1;
        mobileCount.textContent = `${visibleSlide} / ${totalSlides}`;
    };

    if (mobilePrev) {
        mobilePrev.addEventListener('click', () => {
            swiperInstance.slidePrev();
        });
    }

    if (mobileNext) {
        mobileNext.addEventListener('click', () => {
            swiperInstance.slideNext();
        });
    }

    swiperInstance.on('slideChange', updateMobileCount);
    swiperInstance.on('resize', updateMobileCount);
    updateMobileCount();
    swiperElement.dataset.swiperInitialized = 'true';
};

initTestimonialsSwiper();
window.addEventListener('load', initTestimonialsSwiper);

const allImages = document.querySelectorAll('img');
allImages.forEach((image, index) => {
    if (index > 0 && !image.hasAttribute('loading')) {
        image.setAttribute('loading', 'lazy');
    }
    if (!image.hasAttribute('decoding')) {
        image.setAttribute('decoding', 'async');
    }
});