// Announcement System
class AnnouncementManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const response = await fetch('data/announcements.json');
            const data = await response.json();
            
            if (data.announcement && data.announcement.active) {
                this.showAnnouncement(data.announcement);
            }
        } catch (error) {
            console.log('No announcements to display');
        }
    }

    showAnnouncement(announcement) {
        // Check if user has dismissed this announcement
        const dismissedId = localStorage.getItem('dismissedAnnouncement');
        if (dismissedId === announcement.id) {
            return;
        }

        // Create announcement banner
        const banner = document.createElement('div');
        banner.className = `announcement-banner ${announcement.type}`;
        banner.innerHTML = `
            <div class="announcement-content">
                <div class="announcement-text">
                    <strong>${announcement.title}</strong>
                    <span>${announcement.message}</span>
                    ${announcement.link ? `<a href="${announcement.link.url}" target="_blank">${announcement.link.text}</a>` : ''}
                </div>
                ${announcement.dismissible ? '<button class="announcement-close"><i class="fas fa-times"></i></button>' : ''}
            </div>
        `;

        // Insert at top of body
        document.body.insertBefore(banner, document.body.firstChild);

        // Add dismiss functionality
        if (announcement.dismissible) {
            const closeBtn = banner.querySelector('.announcement-close');
            closeBtn.addEventListener('click', () => {
                localStorage.setItem('dismissedAnnouncement', announcement.id);
                banner.remove();
                this.adjustPageLayout(false);
            });
        }

        // Adjust page layout
        this.adjustPageLayout(true);
    }

    adjustPageLayout(hasAnnouncement) {
        const header = document.querySelector('header');
        if (header) {
            header.style.marginTop = hasAnnouncement ? '50px' : '0';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnnouncementManager();
});