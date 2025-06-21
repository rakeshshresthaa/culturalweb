// Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initHomePage();
});

function initHomePage() {
    setupHeroAnimations();
    setupInteractiveCards();
    setupNewsletterSignup();
    setupStatsCounter();
    setupTestimonialsSlider();
    setupFeaturedContent();
    setupScrollEffects();
    setupQuickActions();
}

// Hero Section Animations
function setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    // Animate hero elements on page load
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }
    }, 300);
    
    setTimeout(() => {
        if (heroSubtitle) {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }
    }, 600);
    
    setTimeout(() => {
        if (heroButtons) {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }
    }, 900);
    
    setTimeout(() => {
        if (heroImage) {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }
    }, 1200);
    
    // Parallax effect for hero background
    window.addEventListener('scroll', window.siteUtils.throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }, 16));
}

// Interactive Navigation Cards
function setupInteractiveCards() {
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach((card, index) => {
        // Staggered animation on page load
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            // Animate icon
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            
            // Reset icon
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click tracking
        card.addEventListener('click', function() {
            const link = this.getAttribute('href');
            const title = this.querySelector('h3')?.textContent || 'Navigation Card';
            
            // Track navigation clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'navigation',
                    event_label: title,
                    custom_parameter: link
                });
            }
        });
    });
}

// Newsletter Signup
function setupNewsletterSignup() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        // Simulate subscription
        setTimeout(() => {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Reset form
            newsletterForm.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
            
            // Track newsletter signup
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'engagement',
                    event_label: 'homepage_newsletter'
                });
            }
        }, 2000);
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        const isValid = email === '' || isValidEmail(email);
        
        this.classList.toggle('error', !isValid);
        
        // Show/hide error message
        let errorMsg = this.parentNode.querySelector('.error-message');
        if (!isValid && !errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Please enter a valid email address';
            this.parentNode.appendChild(errorMsg);
        } else if (isValid && errorMsg) {
            errorMsg.remove();
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Stats Counter Animation
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Testimonials Slider
function setupTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!testimonials.length) return;
    
    let current = 0;
    let autoplayInterval;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
            testimonial.style.transform = `translateX(${(i - index) * 100}%)`;
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === testimonials.length - 1;
    }
    
    function nextTestimonial() {
        current = (current + 1) % testimonials.length;
        showTestimonial(current);
    }
    
    function prevTestimonial() {
        current = current === 0 ? testimonials.length - 1 : current - 1;
        showTestimonial(current);
    }
    
    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            current = index;
            showTestimonial(current);
            resetAutoplay();
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextTestimonial();
            resetAutoplay();
        });
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Pause autoplay on hover
    const sliderContainer = document.querySelector('.testimonials-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        sliderContainer.addEventListener('mouseleave', startAutoplay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
            resetAutoplay();
        }
    });
    
    showTestimonial(current);
    startAutoplay();
}

// Featured Content
function setupFeaturedContent() {
    const featuredItems = document.querySelectorAll('.featured-item');
    
    featuredItems.forEach(item => {
        // Lazy load images
        const image = item.querySelector('img[data-src]');
        if (image) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        image.src = image.dataset.src;
                        image.classList.remove('lazy');
                        observer.unobserve(image);
                    }
                });
            });
            observer.observe(image);
        }
        
        // Hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollElements.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', window.siteUtils.throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Quick Actions
function setupQuickActions() {
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch (action) {
                case 'join':
                    window.location.href = 'membership.html';
                    break;
                case 'events':
                    window.location.href = 'events.html';
                    break;
                case 'contact':
                    window.location.href = 'contact.html';
                    break;
                case 'gallery':
                    window.location.href = 'gallery.html';
                    break;
                case 'donate':
                    showDonationModal();
                    break;
                case 'volunteer':
                    showVolunteerModal();
                    break;
            }
            
            // Track quick action clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quick_action', {
                    event_category: 'engagement',
                    event_label: action
                });
            }
        });
    });
}

function showDonationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal donation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Support Our Mission</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Your donation helps us continue our important work in the community.</p>
                <div class="donation-options">
                    <button class="donation-amount" data-amount="25">$25</button>
                    <button class="donation-amount" data-amount="50">$50</button>
                    <button class="donation-amount" data-amount="100">$100</button>
                    <button class="donation-amount" data-amount="custom">Custom</button>
                </div>
                <div class="custom-amount" style="display: none;">
                    <input type="number" placeholder="Enter amount" min="1">
                </div>
                <button class="btn btn-primary donate-btn">Donate Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Handle donation amount selection
    modal.querySelectorAll('.donation-amount').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.donation-amount').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const amount = this.getAttribute('data-amount');
            if (amount === 'custom') {
                modal.querySelector('.custom-amount').style.display = 'block';
            } else {
                modal.querySelector('.custom-amount').style.display = 'none';
            }
        });
    });
    
    // Handle donation
    modal.querySelector('.donate-btn').addEventListener('click', function() {
        const selectedAmount = modal.querySelector('.donation-amount.selected');
        const customAmount = modal.querySelector('.custom-amount input').value;
        
        let amount = selectedAmount?.getAttribute('data-amount');
        if (amount === 'custom') {
            amount = customAmount;
        }
        
        if (amount && amount > 0) {
            showNotification(`Thank you for your $${amount} donation!`, 'success');
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        } else {
            showNotification('Please select or enter a valid amount', 'error');
        }
    });
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

function showVolunteerModal() {
    const modal = document.createElement('div');
    modal.className = 'modal volunteer-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Join Our Volunteer Team</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>We're always looking for dedicated volunteers to help our community.</p>
                <form class="volunteer-form">
                    <div class="form-group">
                        <label for="volunteer-name">Full Name</label>
                        <input type="text" id="volunteer-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="volunteer-email">Email</label>
                        <input type="email" id="volunteer-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="volunteer-interests">Areas of Interest</label>
                        <select id="volunteer-interests" name="interests" required>
                            <option value="">Select an area</option>
                            <option value="events">Event Planning</option>
                            <option value="outreach">Community Outreach</option>
                            <option value="admin">Administrative Support</option>
                            <option value="technical">Technical Support</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="volunteer-message">Why would you like to volunteer?</label>
                        <textarea id="volunteer-message" name="message" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Application</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Handle form submission
    modal.querySelector('.volunteer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        setTimeout(() => {
            showNotification('Thank you for your interest in volunteering! We\'ll be in touch soon.', 'success');
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }, 2000);
    });
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Export functions for use in other scripts
window.homeModule = {
    setupHeroAnimations,
    setupInteractiveCards,
    setupNewsletterSignup,
    setupStatsCounter,
    setupTestimonialsSlider,
    setupFeaturedContent,
    setupScrollEffects,
    setupQuickActions
};

// Nepali Hero Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const devanagariGreeting = document.getElementById('devanagari-greeting');
    const ctaButton = document.getElementById('cta-button');
    const paperPlane = document.getElementById('paper-plane');
    const particlesContainer = document.getElementById('particles');
    
    // Check if elements exist (for pages without Nepali hero)
    if (!devanagariGreeting || !ctaButton || !paperPlane || !particlesContainer) {
        return;
    }
    
    // Initialize Howler.js for sound
    const singingBowl = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
        volume: 0.3,
        preload: true
    });

    // GSAP Animation for Devanagari text
    gsap.set(devanagariGreeting, { opacity: 0, y: 50 });
    gsap.to(devanagariGreeting, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    });

    // Particle effect on hover
    devanagariGreeting.addEventListener('mouseenter', function() {
        singingBowl.play();
        createParticles();
    });

    // Morph animation on scroll
    let isMorphed = false;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100 && !isMorphed) {
            morphToEnglish();
            isMorphed = true;
        } else if (window.scrollY <= 100 && isMorphed) {
            morphToDevanagari();
            isMorphed = false;
        }
    });

    // CTA Button click animation
    ctaButton.addEventListener('click', function() {
        singingBowl.play();
        animatePaperPlane();
    });

    function createParticles() {
        const rect = devanagariGreeting.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particlesContainer.appendChild(particle);

            anime({
                targets: particle,
                translateX: anime.random(-100, 100),
                translateY: anime.random(-100, 100),
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                duration: 1000,
                easing: 'easeOutExpo',
                complete: function() {
                    particle.remove();
                }
            });
        }
    }

    function morphToEnglish() {
        gsap.to(devanagariGreeting, {
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: function() {
                const progress = this.progress();
                if (progress < 0.5) {
                    devanagariGreeting.textContent = 'नमस्ते';
                } else {
                    devanagariGreeting.textContent = 'Namaste';
                    devanagariGreeting.classList.add('morphed');
                }
            }
        });
    }

    function morphToDevanagari() {
        gsap.to(devanagariGreeting, {
            duration: 0.6,
            ease: "power2.inOut",
            onUpdate: function() {
                const progress = this.progress();
                if (progress < 0.5) {
                    devanagariGreeting.textContent = 'Namaste';
                } else {
                    devanagariGreeting.textContent = 'नमस्ते';
                    devanagariGreeting.classList.remove('morphed');
                }
            }
        });
    }

    function animatePaperPlane() {
        const rect = ctaButton.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const endX = window.innerWidth - 100;
        const endY = window.innerHeight - 200;

        paperPlane.style.left = startX + 'px';
        paperPlane.style.top = startY + 'px';
        paperPlane.style.opacity = '1';

        gsap.to(paperPlane, {
            x: endX - startX,
            y: endY - startY,
            rotation: 360,
            duration: 2,
            ease: "power2.inOut",
            onComplete: function() {
                paperPlane.style.opacity = '0';
            }
        });
    }

    // Mobile touch support
    if ('ontouchstart' in window) {
        devanagariGreeting.addEventListener('touchstart', function() {
            singingBowl.play();
            createParticles();
        });
    }
}); 