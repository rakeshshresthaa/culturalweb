// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    setupContactForm();
    setupMapIntegration();
    setupContactInfo();
    setupSocialLinks();
    setupOfficeHours();
    setupContactValidation();
}

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    // Real-time validation
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm(this);
        }
    });

    // Auto-resize textarea
    const textarea = contactForm.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    clearFieldError(field);

    // Validation rules
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'subject':
            if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters long';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Reset textarea height
        const textarea = form.querySelector('textarea');
        if (textarea) {
            textarea.style.height = 'auto';
        }
    }, 2000);
}

// Map Integration
function setupMapIntegration() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Initialize map (using Leaflet as an example)
    if (typeof L !== 'undefined') {
        const map = L.map('map').setView([40.7128, -74.0060], 13); // Default to NYC coordinates
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker for office location
        const officeMarker = L.marker([40.7128, -74.0060]).addTo(map);
        officeMarker.bindPopup(`
            <div class="map-popup">
                <h4>Our Office</h4>
                <p>123 Main Street<br>New York, NY 10001</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Email:</strong> info@organization.com</p>
            </div>
        `);

        // Store map reference
        window.contactMap = map;
    } else {
        // Fallback: show static map or placeholder
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <svg width="100%" height="300" viewBox="0 0 400 300" fill="none">
                    <rect width="400" height="300" fill="#f0f0f0"/>
                    <circle cx="200" cy="150" r="50" fill="#ddd"/>
                    <path d="M180 150 L200 130 L220 150 L200 170 Z" fill="#999"/>
                    <text x="200" y="200" text-anchor="middle" fill="#666">Map Loading...</text>
                </svg>
            </div>
        `;
    }
}

// Contact Information
function setupContactInfo() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const value = this.getAttribute('data-value');
            
            switch (type) {
                case 'phone':
                    window.location.href = `tel:${value}`;
                    break;
                case 'email':
                    window.location.href = `mailto:${value}`;
                    break;
                case 'address':
                    openInMaps(value);
                    break;
            }
        });
    });
}

function openInMaps(address) {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, '_blank');
}

// Social Links
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            const url = this.getAttribute('href');
            
            // Track social media clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'social_media',
                    event_label: platform
                });
            }
            
            // Open in new tab
            window.open(url, '_blank');
        });
    });
}

// Office Hours
function setupOfficeHours() {
    const officeHours = document.querySelector('.office-hours');
    if (!officeHours) return;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const hours = {
        1: { open: 900, close: 1700, label: 'Monday' },
        2: { open: 900, close: 1700, label: 'Tuesday' },
        3: { open: 900, close: 1700, label: 'Wednesday' },
        4: { open: 900, close: 1700, label: 'Thursday' },
        5: { open: 900, close: 1700, label: 'Friday' },
        6: { open: 1000, close: 1400, label: 'Saturday' },
        0: { open: null, close: null, label: 'Sunday' }
    };
    
    const todayHours = hours[currentDay];
    const statusElement = officeHours.querySelector('.office-status');
    
    if (statusElement) {
        if (todayHours.open === null) {
            statusElement.textContent = 'Closed Today';
            statusElement.className = 'office-status closed';
        } else if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
            statusElement.textContent = 'Open Now';
            statusElement.className = 'office-status open';
        } else {
            statusElement.textContent = 'Closed Now';
            statusElement.className = 'office-status closed';
        }
    }
}

// Contact Validation
function setupContactValidation() {
    // Phone number formatting
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }

    // Character counter for message
    const messageInput = document.querySelector('textarea[name="message"]');
    if (messageInput) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        messageInput.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = 1000 - messageInput.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.className = `char-counter ${remaining < 100 ? 'warning' : ''}`;
        }
        
        messageInput.addEventListener('input', updateCounter);
        updateCounter();
    }
}

// FAQ Integration
function setupContactFAQ() {
    const faqItems = document.querySelectorAll('.contact-faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });
}

// Contact Form Analytics
function trackContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Track form interactions
    form.addEventListener('focusin', function(e) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_field_focus', {
                event_category: 'contact_form',
                event_label: e.target.name
            });
        }
    });

    form.addEventListener('submit', function(e) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'contact_form',
                event_label: 'contact_submission'
            });
        }
    });
}

// Accessibility Features
function setupContactAccessibility() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#contact-form';
    skipLink.textContent = 'Skip to contact form';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = form.querySelectorAll(
                    'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Initialize all contact features
function initContactPage() {
    setupContactForm();
    setupMapIntegration();
    setupContactInfo();
    setupSocialLinks();
    setupOfficeHours();
    setupContactValidation();
    setupContactFAQ();
    trackContactForm();
    setupContactAccessibility();
}

// Export functions for use in other scripts
window.contactModule = {
    setupContactForm,
    setupMapIntegration,
    setupContactInfo,
    setupSocialLinks,
    setupOfficeHours,
    setupContactValidation
}; 