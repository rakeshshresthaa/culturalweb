// Legal Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initLegalPage();
});

function initLegalPage() {
    setupLegalNavigation();
    setupLegalSearch();
    setupLegalTabs();
    setupLegalPrint();
    setupLegalSharing();
    setupLegalBookmarks();
    setupLegalTableOfContents();
    setupLegalAnalytics();
}

// Legal Document Navigation
function setupLegalNavigation() {
    const legalSections = document.querySelectorAll('.legal-section');
    const navLinks = document.querySelectorAll('.legal-nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight current section on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = '#' + entry.target.id;
                
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === sectionId);
                });
                
                // Update URL hash
                history.pushState(null, null, sectionId);
            }
        });
    }, observerOptions);
    
    legalSections.forEach(section => {
        observer.observe(section);
    });
}

// Legal Document Search
function setupLegalSearch() {
    const searchInput = document.querySelector('.legal-search');
    const legalSections = document.querySelectorAll('.legal-section');
    const searchResults = document.querySelector('.legal-search-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 3) {
                // Show all sections
                legalSections.forEach(section => {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                });
                if (searchResults) searchResults.style.display = 'none';
                return;
            }
            
            let resultCount = 0;
            
            legalSections.forEach(section => {
                const title = section.querySelector('.legal-section-title')?.textContent.toLowerCase() || '';
                const content = section.querySelector('.legal-section-content')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(query) || content.includes(query);
                
                if (matches) {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                    resultCount++;
                    
                    // Highlight matching text
                    highlightLegalText(section, query);
                } else {
                    section.style.display = 'none';
                    section.style.opacity = '0';
                }
            });
            
            // Update search results count
            if (searchResults) {
                searchResults.textContent = `${resultCount} result${resultCount !== 1 ? 's' : ''} found`;
                searchResults.style.display = 'block';
            }
        }, 300);
    });
}

function highlightLegalText(section, query) {
    const title = section.querySelector('.legal-section-title');
    const content = section.querySelector('.legal-section-content');
    
    if (title) {
        const text = title.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark class="legal-highlight">${match}</mark>`
        );
        title.innerHTML = highlightedText;
    }
    
    if (content) {
        const text = content.textContent;
        const highlightedText = text.replace(
            new RegExp(query, 'gi'),
            match => `<mark class="legal-highlight">${match}</mark>`
        );
        content.innerHTML = highlightedText;
    }
}

// Legal Document Tabs
function setupLegalTabs() {
    const tabButtons = document.querySelectorAll('.legal-tab-btn');
    const tabContents = document.querySelectorAll('.legal-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(content => {
                content.classList.toggle('active', content.getAttribute('data-tab') === targetTab);
            });
            
            // Track tab selection
            trackLegalTab(targetTab);
        });
    });
}

// Legal Document Print
function setupLegalPrint() {
    const printBtn = document.querySelector('.legal-print-btn');
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            const printWindow = window.open('', '_blank');
            const legalContent = document.querySelector('.legal-content');
            const documentTitle = document.querySelector('.legal-title')?.textContent || 'Legal Document';
            
            let printContent = `
                <html>
                <head>
                    <title>${documentTitle}</title>
                    <style>
                        body { 
                            font-family: 'Times New Roman', serif; 
                            line-height: 1.6; 
                            margin: 2rem;
                            font-size: 12pt;
                        }
                        .legal-section { 
                            margin-bottom: 2rem; 
                            page-break-inside: avoid; 
                        }
                        .legal-section-title { 
                            font-weight: bold; 
                            font-size: 14pt;
                            margin-bottom: 1rem;
                            color: #000;
                        }
                        .legal-section-content { 
                            text-align: justify;
                        }
                        h1 { font-size: 18pt; margin-bottom: 2rem; }
                        h2 { font-size: 16pt; margin-bottom: 1.5rem; }
                        h3 { font-size: 14pt; margin-bottom: 1rem; }
                        p { margin-bottom: 1rem; }
                        @media print { 
                            .legal-section { page-break-inside: avoid; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${documentTitle}</h1>
                    <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                    <hr>
            `;
            
            if (legalContent) {
                printContent += legalContent.innerHTML;
            }
            
            printContent += '</body></html>';
            
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        });
    }
}

// Legal Document Sharing
function setupLegalSharing() {
    const shareButtons = document.querySelectorAll('.legal-share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.legal-section');
            const title = section?.querySelector('.legal-section-title')?.textContent || 'Legal Document';
            const documentTitle = document.querySelector('.legal-title')?.textContent || 'Legal Document';
            
            const shareData = {
                title: `${documentTitle} - ${title}`,
                text: 'View our legal document',
                url: window.location.href + (section?.id ? '#' + section.id : '')
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showNotification('Legal document link copied to clipboard!', 'success');
                });
            }
        });
    });
}

// Legal Document Bookmarks
function setupLegalBookmarks() {
    const bookmarkButtons = document.querySelectorAll('.legal-bookmark-btn');
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.legal-section');
            const sectionId = section?.id;
            const sectionTitle = section?.querySelector('.legal-section-title')?.textContent || '';
            
            if (sectionId) {
                const bookmarks = JSON.parse(localStorage.getItem('legal-bookmarks') || '[]');
                const existingIndex = bookmarks.findIndex(bookmark => bookmark.id === sectionId);
                
                if (existingIndex >= 0) {
                    // Remove bookmark
                    bookmarks.splice(existingIndex, 1);
                    this.classList.remove('bookmarked');
                    this.setAttribute('title', 'Bookmark this section');
                    showNotification('Bookmark removed', 'info');
                } else {
                    // Add bookmark
                    bookmarks.push({
                        id: sectionId,
                        title: sectionTitle,
                        url: window.location.href + '#' + sectionId,
                        date: new Date().toISOString()
                    });
                    this.classList.add('bookmarked');
                    this.setAttribute('title', 'Remove bookmark');
                    showNotification('Section bookmarked', 'success');
                }
                
                localStorage.setItem('legal-bookmarks', JSON.stringify(bookmarks));
                updateBookmarksList();
            }
        });
        
        // Check if section is bookmarked
        const section = button.closest('.legal-section');
        if (section?.id) {
            const bookmarks = JSON.parse(localStorage.getItem('legal-bookmarks') || '[]');
            const isBookmarked = bookmarks.some(bookmark => bookmark.id === section.id);
            
            if (isBookmarked) {
                button.classList.add('bookmarked');
                button.setAttribute('title', 'Remove bookmark');
            }
        }
    });
}

function updateBookmarksList() {
    const bookmarksList = document.querySelector('.legal-bookmarks-list');
    if (!bookmarksList) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('legal-bookmarks') || '[]');
    
    if (bookmarks.length === 0) {
        bookmarksList.innerHTML = '<p class="no-bookmarks">No bookmarks yet</p>';
        return;
    }
    
    bookmarksList.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-item">
            <a href="${bookmark.url}" class="bookmark-link">
                <h4>${bookmark.title}</h4>
                <span class="bookmark-date">${new Date(bookmark.date).toLocaleDateString()}</span>
            </a>
            <button class="bookmark-remove" data-id="${bookmark.id}">&times;</button>
        </div>
    `).join('');
    
    // Add remove bookmark functionality
    bookmarksList.querySelectorAll('.bookmark-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookmarkId = this.getAttribute('data-id');
            const bookmarks = JSON.parse(localStorage.getItem('legal-bookmarks') || '[]');
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
            localStorage.setItem('legal-bookmarks', JSON.stringify(updatedBookmarks));
            updateBookmarksList();
            
            // Update bookmark button state
            const bookmarkBtn = document.querySelector(`[data-section="${bookmarkId}"] .legal-bookmark-btn`);
            if (bookmarkBtn) {
                bookmarkBtn.classList.remove('bookmarked');
                bookmarkBtn.setAttribute('title', 'Bookmark this section');
            }
        });
    });
}

// Table of Contents
function setupLegalTableOfContents() {
    const tocContainer = document.querySelector('.legal-toc');
    if (!tocContainer) return;
    
    const legalSections = document.querySelectorAll('.legal-section');
    let tocHTML = '<h3>Table of Contents</h3><ul>';
    
    legalSections.forEach((section, index) => {
        const title = section.querySelector('.legal-section-title')?.textContent || `Section ${index + 1}`;
        const id = section.id || `section-${index + 1}`;
        
        if (!section.id) {
            section.id = id;
        }
        
        tocHTML += `
            <li>
                <a href="#${id}" class="toc-link" data-section="${id}">
                    ${title}
                </a>
            </li>
        `;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
    
    // Add click handlers for TOC links
    tocContainer.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// Legal Analytics
function setupLegalAnalytics() {
    // Track legal page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Legal Documents',
            page_location: window.location.href
        });
    }
}

function trackLegalTab(tabName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'legal_tab', {
            event_category: 'Legal',
            event_label: tabName
        });
    }
}

// Export functions for use in other scripts
window.legalModule = {
    setupLegalNavigation,
    setupLegalSearch,
    setupLegalTabs,
    setupLegalPrint,
    setupLegalSharing,
    setupLegalBookmarks,
    setupLegalTableOfContents,
    setupLegalAnalytics
}; 