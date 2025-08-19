// Maintenance mode check
fetch('data/site-settings.json')
    .then(response => response.json())
    .then(data => {
        if (data.maintenanceMode && !window.location.pathname.includes('maintenance.html')) {
            window.location.href = 'maintenance.html';
        }
    })
    .catch(() => {
        // If can't load settings, assume not in maintenance
    });