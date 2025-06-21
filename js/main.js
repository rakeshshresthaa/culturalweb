// Sticky Navbar Active State
function setActiveNav() {
    const links = document.querySelectorAll('.nav-link');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Mobile Nav Toggle
function setupMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Dark Mode Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const darkModeKey = 'site-theme';
    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem(darkModeKey, theme);
    }
    // Initial theme
    const savedTheme = localStorage.getItem(darkModeKey);
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(current);
    });
}

// FAQ Accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// Testimonial Slider
function setupTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!testimonials.length) return;
    let current = 0;
    function showTestimonial(idx) {
        testimonials.forEach((t, i) => t.classList.toggle('active', i === idx));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            current = idx;
            showTestimonial(current);
        });
    });
    showTestimonial(current);
}

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    setupMobileNav();
    setupThemeToggle();
    setupFAQAccordion();
    setupTestimonialSlider();
}); 