// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});

function initAboutPage() {
    setupTeamInteractions();
    setupTimelineAnimations();
    setupMissionVision();
    setupValuesSection();
    setupHistoryTimeline();
    setupStatsCounter();
    setupTeamModal();
    setupScrollAnimations();
}

// Team Member Interactions
function setupTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const memberCard = member.querySelector('.team-card');
        const memberInfo = member.querySelector('.team-info');
        const socialLinks = member.querySelectorAll('.social-link');
        
        if (memberCard) {
            // Hover effects
            memberCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                if (memberInfo) memberInfo.style.opacity = '1';
            });
            
            memberCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                if (memberInfo) memberInfo.style.opacity = '0.8';
            });
            
            // Click to show detailed info
            memberCard.addEventListener('click', function() {
                showTeamMemberModal(member);
            });
        }
        
        // Social link interactions
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                const platform = this.getAttribute('data-platform');
                const url = this.getAttribute('href');
                
                // Track social media clicks
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'team_social',
                        event_label: platform
                    });
                }
                
                window.open(url, '_blank');
            });
        });
    });
}

// Team Member Modal
function showTeamMemberModal(member) {
    const name = member.querySelector('.team-name')?.textContent || 'Team Member';
    const role = member.querySelector('.team-role')?.textContent || 'Role';
    const bio = member.querySelector('.team-bio')?.textContent || 'Bio not available';
    const image = member.querySelector('.team-image')?.src || '';
    const socialLinks = member.querySelectorAll('.social-link');
    
    const modal = document.createElement('div');
    modal.className = 'modal team-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="team-modal-content">
                    <div class="team-modal-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="team-modal-info">
                        <h4>${role}</h4>
                        <p>${bio}</p>
                        <div class="team-modal-social">
                            ${Array.from(socialLinks).map(link => `
                                <a href="${link.href}" class="social-link" data-platform="${link.getAttribute('data-platform')}" target="_blank">
                                    ${link.innerHTML}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
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

// Timeline Animations
function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Mission & Vision Section
function setupMissionVision() {
    const missionSection = document.querySelector('.mission-section');
    const visionSection = document.querySelector('.vision-section');
    
    if (missionSection) {
        const missionText = missionSection.querySelector('.mission-text');
        if (missionText) {
            // Animate text on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateText(entry.target);
                    }
                });
            });
            observer.observe(missionText);
        }
    }
    
    if (visionSection) {
        const visionText = visionSection.querySelector('.vision-text');
        if (visionText) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateText(entry.target);
                    }
                });
            });
            observer.observe(visionText);
        }
    }
}

function animateText(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    typeWriter();
}

// Values Section
function setupValuesSection() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        // Staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
        
        // Click to expand
        card.addEventListener('click', function() {
            const description = this.querySelector('.value-description');
            if (description) {
                description.style.maxHeight = description.style.maxHeight ? null : description.scrollHeight + 'px';
                this.classList.toggle('expanded');
            }
        });
    });
}

// History Timeline
function setupHistoryTimeline() {
    const timelineItems = document.querySelectorAll('.history-timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add click to expand functionality
        const year = item.querySelector('.timeline-year');
        const content = item.querySelector('.timeline-content');
        
        if (year && content) {
            year.addEventListener('click', function() {
                const isExpanded = item.classList.contains('expanded');
                
                // Close other items
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('expanded');
                        const otherContent = otherItem.querySelector('.timeline-content');
                        if (otherContent) otherContent.style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('expanded');
                content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';
            });
        }
    });
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

// Scroll Animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    
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
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Team Modal
function setupTeamModal() {
    // This is handled in showTeamMemberModal function
}

// Parallax Effects
function setupParallaxEffects() {
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

// Interactive Map (if exists)
function setupInteractiveMap() {
    const mapContainer = document.querySelector('.location-map');
    if (!mapContainer) return;
    
    // Initialize map if Leaflet is available
    if (typeof L !== 'undefined') {
        const map = L.map('location-map').setView([40.7128, -74.0060], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add office marker
        const marker = L.marker([40.7128, -74.0060]).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <h4>Our Office</h4>
                <p>123 Main Street<br>New York, NY 10001</p>
            </div>
        `);
    }
}

// Testimonials Slider (if exists)
function setupTestimonialsSlider() {
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

// Export functions for use in other scripts
window.aboutModule = {
    setupTeamInteractions,
    setupTimelineAnimations,
    setupMissionVision,
    setupValuesSection,
    setupHistoryTimeline,
    setupStatsCounter,
    setupTeamModal,
    setupScrollAnimations
}; 