// FAQ Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initFAQPage();
});

function initFAQPage() {
    setupFAQAccordion();
    setupFAQSearch();
    setupFAQCategories();
    setupFAQFeedback();
    setupFAQSharing();
    setupFAQAnalytics();
    setupFAQKeyboard();
    setupFAQPrint();
}

// Enhanced FAQ Accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (!question || !answer) return;
        
        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingTop = '0';
                        otherAnswer.style.paddingBottom = '0';
                    }
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (!isActive) {
                // Open
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '1rem';
                answer.style.paddingBottom = '1rem';
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
                
                // Track FAQ view
                trackFAQView(item);
            } else {
                // Close
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// FAQ Search Functionality
function setupFAQSearch() {
    const searchInput = document.querySelector('.faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const searchResults = document.querySelector('.faq-search-results');
    const noResults = document.querySelector('.faq-no-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                // Show all items
                faqItems.forEach(item => {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                });
                if (searchResults) searchResults.style.display = 'none';
                if (noResults) noResults.style.display = 'none';
                return;
            }
            
            let hasResults = false;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
                const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
                const category = item.getAttribute('data-category')?.toLowerCase() || '';
                
                const matches = question.includes(query) || answer.includes(query) || category.includes(query);
                
                if (matches) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    hasResults = true;
                    
                    // Highlight matching text
                    highlightText(item, query);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
            
            // Show/hide no results message
            if (noResults) {
                noResults.style.display = hasResults ? 'none' : 'block';
            }
            
            // Show search results count
            if (searchResults) {
                const resultCount = Array.from(faqItems).filter(item => 
                    item.style.display !== 'none'
                ).length;
                searchResults.textContent = `${resultCount} result${resultCount !== 1 ? 's' : ''} found`;
                searchResults.style.display = 'block';
            }
        }, 300);
    });
    
    // Clear search
    const clearSearchBtn = document.querySelector('.faq-search-clear');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
}

function highlightText(element, query) {
    const question = element.querySelector('.faq-question');
    const answer = element.querySelector('.faq-answer');
    
    if (question) {
        const text = question.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark class="search-highlight">${match}</mark>`
        );
        question.innerHTML = highlightedText;
    }
    
    if (answer) {
        const text = answer.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark class="search-highlight">${match}</mark>`
        );
        answer.innerHTML = highlightedText;
    }
}

// FAQ Categories
function setupFAQCategories() {
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Track category selection
            trackFAQCategory(category);
        });
    });
}

// FAQ Feedback System
function setupFAQFeedback() {
    const feedbackButtons = document.querySelectorAll('.faq-feedback-btn');
    
    feedbackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const question = faqItem.querySelector('.faq-question')?.textContent || '';
            const isHelpful = this.getAttribute('data-helpful') === 'true';
            
            // Show feedback modal
            showFeedbackModal(question, isHelpful);
            
            // Track feedback
            trackFAQFeedback(question, isHelpful);
        });
    });
}

function showFeedbackModal(question, isHelpful) {
    const modal = document.createElement('div');
    modal.className = 'modal feedback-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${isHelpful ? 'Thank you!' : 'We\'re sorry to hear that'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${isHelpful ? 
                    'We\'re glad this answer was helpful!' : 
                    'We\'d love to improve this answer. Please let us know how we can help.'
                }</p>
                <form class="feedback-form">
                    <div class="form-group">
                        <label for="feedback-comment">Additional Comments (Optional)</label>
                        <textarea id="feedback-comment" name="comment" rows="3" placeholder="Tell us more..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="feedback-email">Email (Optional)</label>
                        <input type="email" id="feedback-email" name="email" placeholder="your@email.com">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Handle form submission
    const form = modal.querySelector('.feedback-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate submission
        setTimeout(() => {
            showNotification('Thank you for your feedback!', 'success');
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }, 1000);
    });
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.modal-cancel').addEventListener('click', () => {
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

// FAQ Sharing
function setupFAQSharing() {
    const shareButtons = document.querySelectorAll('.faq-share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const question = faqItem.querySelector('.faq-question')?.textContent || '';
            const answer = faqItem.querySelector('.faq-answer')?.textContent || '';
            
            const shareData = {
                title: 'FAQ: ' + question,
                text: answer.substring(0, 100) + '...',
                url: window.location.href + '#' + faqItem.id
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showNotification('FAQ link copied to clipboard!', 'success');
                });
            }
        });
    });
}

// FAQ Analytics
function setupFAQAnalytics() {
    // Track FAQ page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'FAQ',
            page_location: window.location.href
        });
    }
}

function trackFAQView(faqItem) {
    const question = faqItem.querySelector('.faq-question')?.textContent || '';
    const category = faqItem.getAttribute('data-category') || '';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_view', {
            event_category: 'FAQ',
            event_label: question,
            custom_parameter: category
        });
    }
}

function trackFAQCategory(category) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_category', {
            event_category: 'FAQ',
            event_label: category
        });
    }
}

function trackFAQFeedback(question, isHelpful) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_feedback', {
            event_category: 'FAQ',
            event_label: question,
            custom_parameter: isHelpful ? 'helpful' : 'not_helpful'
        });
    }
}

// FAQ Keyboard Navigation
function setupFAQKeyboard() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    document.addEventListener('keydown', function(e) {
        const activeItem = document.querySelector('.faq-item.active');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeItem) {
                    const nextItem = activeItem.nextElementSibling;
                    if (nextItem && nextItem.classList.contains('faq-item')) {
                        nextItem.querySelector('.faq-question').click();
                        nextItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (activeItem) {
                    const prevItem = activeItem.previousElementSibling;
                    if (prevItem && prevItem.classList.contains('faq-item')) {
                        prevItem.querySelector('.faq-question').click();
                        prevItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                break;
                
            case 'Escape':
                // Close all FAQ items
                faqItems.forEach(item => {
                    item.classList.remove('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = '0';
                        answer.style.paddingTop = '0';
                        answer.style.paddingBottom = '0';
                    }
                });
                break;
        }
    });
}

// FAQ Print Functionality
function setupFAQPrint() {
    const printBtn = document.querySelector('.faq-print-btn');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Create print-friendly version
            const printWindow = window.open('', '_blank');
            const faqItems = document.querySelectorAll('.faq-item');
            
            let printContent = `
                <html>
                <head>
                    <title>FAQ - Our Organization</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .faq-item { margin-bottom: 2rem; page-break-inside: avoid; }
                        .faq-question { font-weight: bold; color: #333; margin-bottom: 0.5rem; }
                        .faq-answer { color: #666; }
                        @media print { .faq-item { page-break-inside: avoid; } }
                    </style>
                </head>
                <body>
                    <h1>Frequently Asked Questions</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
            `;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question')?.textContent || '';
                const answer = item.querySelector('.faq-answer')?.textContent || '';
                
                printContent += `
                    <div class="faq-item">
                        <div class="faq-question">${question}</div>
                        <div class="faq-answer">${answer}</div>
                    </div>
                `;
            });
            
            printContent += '</body></html>';
            
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        });
    }
}

// Export functions for use in other scripts
window.faqModule = {
    setupFAQAccordion,
    setupFAQSearch,
    setupFAQCategories,
    setupFAQFeedback,
    setupFAQSharing,
    setupFAQAnalytics,
    setupFAQKeyboard,
    setupFAQPrint
}; 