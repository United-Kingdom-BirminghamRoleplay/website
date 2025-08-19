// Check for maintenance mode using localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Don't check maintenance mode on maintenance page or staff login
    if (currentPage === 'maintenance.html' || currentPage === 'info.html') {
        return;
    }
    
    // Check site settings in localStorage
    try {
        const storedSettings = localStorage.getItem('ukbrum_site_settings');
        if (storedSettings) {
            const settings = JSON.parse(storedSettings);
            if (settings.maintenanceMode) {
                window.location.href = 'maintenance.html';
            }
        }
    } catch (error) {
        console.error('Error checking maintenance mode:', error);
    }
});