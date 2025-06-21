// Membership Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initMembershipPage();
});

function initMembershipPage() {
    setupMembershipTiers();
    setupMembershipForm();
    setupBenefitsAnimation();
    setupFAQSection();
    setupPricingToggle();
    setupMembershipCalculator();
    setupTestimonials();
    setupProgressTracker();
}

// Membership Tiers Interaction
function setupMembershipTiers() {
    const tierCards = document.querySelectorAll('.tier-card');
    const tierButtons = document.querySelectorAll('.tier-action button');
    
    tierCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Tier selection
    tierButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tierCard = this.closest('.tier-card');
            const tierName = tierCard.querySelector('h3')?.textContent || 'Membership Tier';
            const tierPrice = tierCard.querySelector('.price')?.textContent || '';
            
            // Update form with selected tier
            const tierSelect = document.querySelector('#membership-tier');
            if (tierSelect) {
                const tierValue = getTierValue(tierName);
                tierSelect.value = tierValue;
            }
            
            // Scroll to form
            const form = document.querySelector('#membership-form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight form
                form.classList.add('highlight');
                setTimeout(() => form.classList.remove('highlight'), 2000);
            }
            
            // Track tier selection
            trackTierSelection(tierName, tierPrice);
        });
    });
}

function getTierValue(tierName) {
    const tierMap = {
        'Basic': 'basic',
        'Premium': 'premium',
        'Enterprise': 'enterprise'
    };
    return tierMap[tierName] || 'basic';
}

// Membership Form Handling
function setupMembershipForm() {
    const form = document.getElementById('membership-form');
    if (!form) return;
    
    const formFields = form.querySelectorAll('input, select, textarea');
    
    // Real-time validation
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateMembershipField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateMembershipForm()) {
            submitMembershipForm(this);
        }
    });
    
    // Auto-save form data
    setupFormAutoSave();
}

function validateMembershipField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Validation rules
    switch (fieldName) {
        case 'fullName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Full name must be at least 2 characters long';
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
            
        case 'tier':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a membership tier';
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

function validateMembershipForm() {
    const form = document.getElementById('membership-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateMembershipField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function submitMembershipForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    // Collect form data
    const formData = new FormData(form);
    const membershipData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        tier: formData.get('tier'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        terms: formData.get('terms') === 'on'
    };
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Welcome to our community! Your membership application has been submitted successfully.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Track successful membership
        trackMembershipSignup(membershipData);
        
        // Show welcome modal
        showWelcomeModal(membershipData);
    }, 2000);
}

function setupFormAutoSave() {
    const form = document.getElementById('membership-form');
    const formFields = form.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            localStorage.setItem('membership-form-draft', JSON.stringify(data));
        });
    });
    
    // Restore form data on page load
    const savedData = localStorage.getItem('membership-form-draft');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

// Benefits Animation
function setupBenefitsAnimation() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    benefitCards.forEach(card => {
        observer.observe(card);
    });
}

// FAQ Section
function setupFAQSection() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Pricing Toggle (Monthly/Annual)
function setupPricingToggle() {
    const pricingToggle = document.querySelector('.pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    
    if (!pricingToggle) return;
    
    pricingToggle.addEventListener('change', function() {
        const isAnnual = this.checked;
        
        monthlyPrices.forEach(price => {
            price.style.display = isAnnual ? 'none' : 'block';
        });
        
        annualPrices.forEach(price => {
            price.style.display = isAnnual ? 'block' : 'none';
        });
        
        // Update pricing display
        updatePricingDisplay(isAnnual);
    });
}

function updatePricingDisplay(isAnnual) {
    const priceElements = document.querySelectorAll('.tier-price .price');
    
    priceElements.forEach(element => {
        const tier = element.closest('.tier-card').querySelector('h3').textContent;
        const newPrice = getPricing(tier, isAnnual);
        element.textContent = newPrice;
    });
}

function getPricing(tier, isAnnual) {
    const pricing = {
        'Basic': { monthly: '$25', annual: '$250' },
        'Premium': { monthly: '$50', annual: '$500' },
        'Enterprise': { monthly: '$100', annual: '$1000' }
    };
    
    const tierPricing = pricing[tier] || pricing['Basic'];
    return isAnnual ? tierPricing.annual : tierPricing.monthly;
}

// Membership Calculator
function setupMembershipCalculator() {
    const calculatorForm = document.querySelector('.membership-calculator');
    if (!calculatorForm) return;
    
    const inputs = calculatorForm.querySelectorAll('input, select');
    const resultElement = document.querySelector('.calculator-result');
    
    inputs.forEach(input => {
        input.addEventListener('change', calculateMembershipValue);
        input.addEventListener('input', calculateMembershipValue);
    });
    
    function calculateMembershipValue() {
        const tier = calculatorForm.querySelector('[name="tier"]')?.value || 'basic';
        const events = parseInt(calculatorForm.querySelector('[name="events"]')?.value || 0);
        const workshops = parseInt(calculatorForm.querySelector('[name="workshops"]')?.value || 0);
        const networking = parseInt(calculatorForm.querySelector('[name="networking"]')?.value || 0);
        
        const tierValues = {
            basic: { events: 50, workshops: 100, networking: 200 },
            premium: { events: 100, workshops: 200, networking: 400 },
            enterprise: { events: 200, workshops: 400, networking: 800 }
        };
        
        const values = tierValues[tier] || tierValues.basic;
        const totalValue = (events * values.events) + (workshops * values.workshops) + (networking * values.networking);
        
        if (resultElement) {
            resultElement.textContent = `Estimated Value: $${totalValue.toLocaleString()}`;
        }
    }
}

// Testimonials
function setupTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonials.length) return;
    
    let current = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            current = index;
            showTestimonial(current);
        });
    });
    
    // Auto-advance
    setInterval(() => {
        current = (current + 1) % testimonials.length;
        showTestimonial(current);
    }, 5000);
    
    showTestimonial(current);
}

// Progress Tracker
function setupProgressTracker() {
    const progressBar = document.querySelector('.membership-progress');
    if (!progressBar) return;
    
    const targetMembers = 1000;
    const currentMembers = 856; // This would come from your backend
    
    const percentage = (currentMembers / targetMembers) * 100;
    progressBar.style.width = `${percentage}%`;
    
    const progressText = progressBar.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${currentMembers} / ${targetMembers} members`;
    }
}

// Welcome Modal
function showWelcomeModal(membershipData) {
    const modal = document.createElement('div');
    modal.className = 'modal welcome-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Welcome to Our Community!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="welcome-content">
                    <div class="welcome-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <h4>Welcome, ${membershipData.fullName}!</h4>
                    <p>Thank you for joining our community as a ${membershipData.tier} member. We're excited to have you on board!</p>
                    <div class="welcome-next-steps">
                        <h5>What's Next?</h5>
                        <ul>
                            <li>Check your email for confirmation and welcome materials</li>
                            <li>Join our community forum</li>
                            <li>Browse upcoming events</li>
                            <li>Connect with other members</li>
                        </ul>
                    </div>
                    <div class="welcome-actions">
                        <a href="events.html" class="btn btn-primary">View Events</a>
                        <a href="contact.html" class="btn btn-secondary">Get Help</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
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

// Analytics Tracking
function trackTierSelection(tierName, tierPrice) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tier_selection', {
            event_category: 'membership',
            event_label: tierName,
            value: parseInt(tierPrice.replace(/[^0-9]/g, ''))
        });
    }
}

function trackMembershipSignup(membershipData) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'membership_signup', {
            event_category: 'membership',
            event_label: membershipData.tier,
            custom_parameter: membershipData.newsletter ? 'newsletter_yes' : 'newsletter_no'
        });
    }
}

// Export functions for use in other scripts
window.membershipModule = {
    setupMembershipTiers,
    setupMembershipForm,
    setupBenefitsAnimation,
    setupFAQSection,
    setupPricingToggle,
    setupMembershipCalculator,
    setupTestimonials,
    setupProgressTracker
}; 