// Check for maintenance mode using JavaScript only
document.addEventListener('DOMContentLoaded', () => {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Don't check maintenance mode on maintenance page or staff login
    if (currentPage === 'maintenance.html' || currentPage === 'info.html') {
        return;
    }
    
    // Check site settings
    fetch('data/site-settings.json')
        .then(response => response.json())
        .then(settings => {
            if (settings.maintenanceMode) {
                window.location.href = 'maintenance.html';
            }
        })
        .catch(error => console.error('Error checking maintenance mode:', error));
});