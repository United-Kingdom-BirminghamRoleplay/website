// Handle settings save button
document.addEventListener('DOMContentLoaded', () => {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const siteName = document.getElementById('siteName').value;
            const siteDescription = document.getElementById('siteDescription').value;
            const discordLink = document.getElementById('discordLink').value;
            const maintenanceMode = document.getElementById('maintenanceMode').checked;
            
            // Save settings via JavaScript function
            toggleMaintenanceMode(maintenanceMode)
                .then(data => {
                    alert('Settings saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving settings:', error);
                    alert('Error saving settings. Please try again.');
                });
        });
    }
});