// Check for maintenance mode
fetch('data/site-settings.json')
    .then(response => response.json())
    .then(settings => {
        if (settings.maintenanceMode) {
            // Don't redirect if already on maintenance page or staff login
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage !== 'maintenance.html' && currentPage !== 'info.html') {
                window.location.href = 'maintenance.html';
            }
        }
    })
    .catch(error => console.error('Error checking maintenance mode:', error));