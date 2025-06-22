// Events Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initEventsPage();
});

function initEventsPage() {
    // Initialize all event-related functionality
    setupEventFiltering();
    setupEventCalendar();
    setupEventRegistration();
    setupEventCountdown();
    setupEventSearch();
    setupEventSharing();
    setupEventReminders();
}

// Event Filtering System
function setupEventFiltering() {
    const filterButtons = document.querySelectorAll('.event-filter-btn');
    const eventItems = document.querySelectorAll('.event-item');
    const eventGrid = document.querySelector('.events-grid');
    
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter events
            filterEvents(filter);
        });
    });

    function filterEvents(filter) {
        eventItems.forEach(item => {
            const categories = item.getAttribute('data-categories')?.split(',') || [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Event Calendar Functionality
function setupEventCalendar() {
    const calendarContainer = document.querySelector('.events-calendar');
    if (!calendarContainer) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav prev">&lt;</button>
                <h3>${new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <button class="calendar-nav next">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
        `;

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const hasEvents = checkForEvents(date);
            
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';
            if (hasEvents) dayClass += ' has-events';
            
            calendarHTML += `<div class="${dayClass}" data-date="${date.toISOString().split('T')[0]}">${date.getDate()}</div>`;
        }

        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;

        // Add event listeners
        setupCalendarNavigation();
        setupCalendarDayClicks();
    }

    function checkForEvents(date) {
        // Check if there are events on this date
        const eventItems = document.querySelectorAll('.event-item');
        return Array.from(eventItems).some(item => {
            const eventDate = new Date(item.getAttribute('data-date'));
            return eventDate.toDateString() === date.toDateString();
        });
    }

    function setupCalendarNavigation() {
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        document.querySelector('.calendar-nav.prev').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });

        document.querySelector('.calendar-nav.next').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }

    function setupCalendarDayClicks() {
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', function() {
                const date = this.getAttribute('data-date');
                if (date) {
                    showEventsForDate(date);
                }
            });
        });
    }

    function showEventsForDate(date) {
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach(item => {
            const eventDate = item.getAttribute('data-date');
            if (eventDate === date) {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.classList.add('highlight');
                setTimeout(() => item.classList.remove('highlight'), 2000);
            }
        });
    }

    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
}

// Event Registration System
function setupEventRegistration() {
    const registerButtons = document.querySelectorAll('.event-register-btn');
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const eventId = this.getAttribute('data-event-id');
            const eventTitle = this.getAttribute('data-event-title');
            
            // Check if user is logged in (simulate)
            if (!isUserLoggedIn()) {
                showNotification('Please log in to register for events', 'warning');
                return;
            }
            
            // Show registration modal
            showRegistrationModal(eventId, eventTitle);
        });
    });
}

function showRegistrationModal(eventId, eventTitle) {
    const modal = document.createElement('div');
    modal.className = 'modal registration-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Register for Event</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <h4>${eventTitle}</h4>
                <form class="registration-form">
                    <div class="form-group">
                        <label for="attendee-name">Full Name</label>
                        <input type="text" id="attendee-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="attendee-email">Email</label>
                        <input type="email" id="attendee-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="attendee-phone">Phone</label>
                        <input type="tel" id="attendee-phone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="attendee-count">Number of Attendees</label>
                        <select id="attendee-count" name="count" required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="special-requests">Special Requests</label>
                        <textarea id="special-requests" name="requests" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Handle form submission
    const form = modal.querySelector('.registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        
        // Simulate registration
        setTimeout(() => {
            showNotification('Registration successful! Check your email for confirmation.', 'success');
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }, 2000);
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
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Event Countdown Timer
function setupEventCountdown() {
    const countdownElements = document.querySelectorAll('.event-countdown');
    
    countdownElements.forEach(element => {
        const eventDate = new Date(element.getAttribute('data-event-date'));
        
        function updateCountdown() {
            const now = new Date();
            const timeLeft = eventDate - now;
            
            if (timeLeft <= 0) {
                element.innerHTML = '<span class="countdown-expired">Event has started!</span>';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            element.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// Event Search Functionality
function setupEventSearch() {
    const searchInput = document.querySelector('.events-search');
    const eventItems = document.querySelectorAll('.event-item');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', window.siteUtils.debounce(() => {
        const query = searchInput.value.toLowerCase().trim();
        
        eventItems.forEach(item => {
            const title = item.querySelector('.event-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.event-description')?.textContent.toLowerCase() || '';
            const category = item.getAttribute('data-categories')?.toLowerCase() || '';
            
            const matches = title.includes(query) || description.includes(query) || category.includes(query);
            
            if (matches || query === '') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }, 300));
}

// Event Sharing
function setupEventSharing() {
    const shareButtons = document.querySelectorAll('.event-share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventTitle = this.getAttribute('data-event-title');
            const eventUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: eventTitle,
                    url: eventUrl
                });
            } else {
                // Fallback: copy to clipboard
                const shareText = `${eventTitle}\n\n${eventUrl}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showNotification('Event link copied to clipboard!', 'success');
                });
            }
        });
    });
}

// Event Reminders
function setupEventReminders() {
    const reminderButtons = document.querySelectorAll('.event-reminder-btn');
    
    reminderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            const eventTitle = this.getAttribute('data-event-title');
            const eventDate = this.getAttribute('data-event-date');
            
            if ('Notification' in window && Notification.permission === 'granted') {
                scheduleReminder(eventId, eventTitle, eventDate);
                this.textContent = 'Reminder Set';
                this.disabled = true;
            } else if ('Notification' in window && Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        scheduleReminder(eventId, eventTitle, eventDate);
                        this.textContent = 'Reminder Set';
                        this.disabled = true;
                    }
                });
            }
        });
    });
}

function scheduleReminder(eventId, eventTitle, eventDate) {
    const eventTime = new Date(eventDate);
    const reminderTime = new Date(eventTime.getTime() - (60 * 60 * 1000)); // 1 hour before
    
    const timeUntilReminder = reminderTime.getTime() - Date.now();
    
    if (timeUntilReminder > 0) {
        setTimeout(() => {
            new Notification('Event Reminder', {
                body: `${eventTitle} starts in 1 hour!`,
                icon: '/favicon.ico'
            });
        }, timeUntilReminder);
    }
}

// Utility Functions
function isUserLoggedIn() {
    // Simulate user login check
    return localStorage.getItem('user-logged-in') === 'true';
}

function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Export functions for use in other scripts
window.eventsModule = {
    setupEventFiltering,
    setupEventCalendar,
    setupEventRegistration,
    setupEventCountdown,
    setupEventSearch,
    setupEventSharing,
    setupEventReminders
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('event-modal');
    const modalClose = document.querySelector('.modal-close');
    const learnMoreButtons = document.querySelectorAll('.event-learn-more');

    // Function to open the modal and populate it with data
    const openModal = (eventCard) => {
        const title = eventCard.querySelector('.event-detail-title').textContent;
        const imageSrc = eventCard.querySelector('.event-detail-image').src;
        const meta = eventCard.querySelector('.event-detail-meta').innerHTML;
        const description = eventCard.querySelector('.event-detail-description').textContent;

        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-image').src = imageSrc;
        modal.querySelector('.modal-meta').innerHTML = meta;
        modal.querySelector('.modal-description').textContent = description;

        modal.style.display = 'block';
    };

    // Add click event to all "Learn More" buttons
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const eventCard = e.target.closest('.event-detail-card');
            openModal(eventCard);
        });
    });

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Close the modal when the close button is clicked
    modalClose.addEventListener('click', closeModal);

    // Close the modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close the modal with the Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Handle clicking on upcoming events to scroll to details
    const upcomingEventItems = document.querySelectorAll('.upcoming-events-list .event-list-item');
    upcomingEventItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger scroll if clicking on the "options" (ellipsis)
            if (e.target.closest('.event-item-options')) {
                return;
            }

            const targetId = item.dataset.targetId;
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Smoothly scroll to the target element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Add a temporary highlight effect
                    targetElement.style.transition = 'box-shadow 0.3s ease-in-out';
                    targetElement.style.boxShadow = `0 0 25px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color-faded')}`;
                    
                    setTimeout(() => {
                        targetElement.style.boxShadow = '';
                    }, 1500); // Highlight for 1.5 seconds
                }
            }
        });
    });
}); 