// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    initStatsAnimation();
    initScrollEffects();
    window.addEventListener('scroll', updateActiveNavLink);
});

// Mobile Menu Toggle - FIXED
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuBtn || !navMenu) {
        console.warn('Burger: #mobileMenuBtn or #navMenu not found');
        return;
    }

    const icon = mobileMenuBtn.querySelector('i');

    function setMenu(open) {
        navMenu.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (icon) {
            icon.classList.toggle('fa-bars', !open);
            icon.classList.toggle('fa-times', open);
        }
        mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenu(!navMenu.classList.contains('active'));
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            setMenu(false);
        }
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Stats Counter Animation
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!statsSection || statNumbers.length === 0) return;

    let statsAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(statsSection);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        const originalValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        const isDistance = originalText.includes('km') || originalText.includes('mi');
        const isPlus = originalText.includes('+');
        const unit = originalText.includes('km') ? ' km' : originalText.includes('mi') ? ' mi' : '';

        if (isNaN(originalValue)) return;

        let currentValue = 0;
        const duration = 2000;
        const increment = originalValue / (duration / 16);

        const timer = setInterval(() => {
            currentValue += increment;

            if (currentValue >= originalValue) {
                clearInterval(timer);
                stat.textContent = originalText;
            } else {
                if (isDistance) {
                    stat.textContent = Math.floor(currentValue).toLocaleString() + unit;
                } else if (isPlus) {
                    stat.textContent = Math.floor(currentValue) + '+';
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }
        }, 16);
    });
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            header.style.padding = '10px 0';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            header.style.padding = '20px 0';
        }
    });

    const fadeElements = document.querySelectorAll('.offer-card, .stat-card, .partner-logo, .gallery-item');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(element);
    });
}

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navMenu a');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - headerHeight - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Form validation (if you add a form later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

window.validateForm = validateForm;
