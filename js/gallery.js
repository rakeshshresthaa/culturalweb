// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('gallery-search');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const executeFiltering = () => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const searchTerm = searchInput.value.toLowerCase().trim();

        galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const itemText = item.querySelector('.gallery-info')?.textContent.toLowerCase() || '';

            const categoryMatch = activeFilter === 'all' || itemCategory === activeFilter;
            const searchMatch = itemText.includes(searchTerm);

            if (categoryMatch && searchMatch) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            executeFiltering();
        });
    });

    searchInput.addEventListener('input', executeFiltering);

    // Any other gallery logic (like a lightbox) would go here
});

function initGallery() {
    // Get DOM elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const videoItems = document.querySelectorAll('.video-item');
    const galleryGrid = document.getElementById('photo-gallery');
    const videoGrid = document.getElementById('video-gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const videoModal = document.getElementById('video-modal');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoIframe = document.getElementById('video-iframe');
    const expandButtons = document.querySelectorAll('.gallery-expand');
    const playButtons = document.querySelectorAll('.video-play');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class on button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                item.classList.add('hidden'); // Hide all items initially
                item.style.animation = 'none'; // Reset animation
                
                if (filter === 'all' || item.dataset.category === filter) {
                    // Use a timeout to re-trigger the animation
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.style.animation = ''; // Let CSS handle animation
                    }, 50);
                }
            });
        });
    });

    // View toggle functionality
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active view button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle view
            if (view === 'list') {
                galleryGrid.classList.add('list-view');
                videoGrid.classList.add('list-view');
            } else {
                galleryGrid.classList.remove('list-view');
                videoGrid.classList.remove('list-view');
            }
        });
    });

    // Lightbox functionality for photos
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const imageSrc = this.getAttribute('data-src');
            const item = this.closest('.gallery-item');
            const title = item.querySelector('.gallery-info h3').textContent;
            const description = item.querySelector('.gallery-info p').textContent;
            
            // Set lightbox content
            lightboxImage.src = imageSrc;
            lightboxImage.alt = title;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            // Show lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Video modal functionality
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.getAttribute('data-video-id');
            
            // Set video iframe source
            videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            
            // Show video modal
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close video modal
    videoModalClose.addEventListener('click', function() {
        videoModal.classList.remove('active');
        videoIframe.src = '';
        document.body.style.overflow = '';
    });

    // Close modals on backdrop click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            videoIframe.src = '';
            document.body.style.overflow = '';
        }
    });

    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            videoModal.classList.remove('active');
            videoIframe.src = '';
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add loading animation
    addLoadingAnimation();
}

function filterItems(items, filter) {
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            // Add animation delay for staggered effect
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
        }
    });
}

function addLoadingAnimation() {
    // Add fade-in animation to gallery items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all gallery and video items
    document.querySelectorAll('.gallery-item, .video-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scroll behavior for filter section
window.addEventListener('scroll', debounce(function() {
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        const scrollTop = window.pageYOffset;
        const filterTop = filterSection.offsetTop;
        
        if (scrollTop > filterTop - 100) {
            filterSection.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            filterSection.style.boxShadow = 'none';
        }
    }
}, 10));

// Add keyboard navigation for gallery items
document.addEventListener('keydown', function(e) {
    const activeItems = document.querySelectorAll('.gallery-item:not(.hidden), .video-item:not(.hidden)');
    const currentIndex = Array.from(activeItems).findIndex(item => 
        item === document.activeElement || item.contains(document.activeElement)
    );

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % activeItems.length;
        activeItems[nextIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? activeItems.length - 1 : currentIndex - 1;
        activeItems[prevIndex].focus();
    }
});

// Add focus management for accessibility
document.querySelectorAll('.gallery-item, .video-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    
    item.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    item.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Add loading states for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.style.opacity = '0.5';
        this.style.filter = 'grayscale(100%)';
        // Add error placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-error';
        placeholder.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            <span>Image not available</span>
        `;
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--text-muted);
        `;
        this.parentNode.appendChild(placeholder);
    });
}); 