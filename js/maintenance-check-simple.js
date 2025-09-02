// Simple maintenance check
if (!window.location.pathname.includes('maintenance.html')) {
    fetch('data/site-settings.json')
        .then(response => response.json())
        .then(data => {
            console.log('Maintenance mode:', data.maintenanceMode);
            if (data.maintenanceMode === true) {
                window.location.href = 'maintenance.html';
            }
        })
        .catch(error => {
            console.log('Maintenance check failed:', error);
        });
}