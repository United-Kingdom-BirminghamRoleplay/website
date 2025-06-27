// Function to load site settings using JavaScript only
function loadSiteSettings() {
    // Get settings directly from JSON file
    fetch('../data/site-settings.json')
        .then(response => response.json())
        .then(settings => {
            document.getElementById('siteName').value = settings.siteName || 'UKBRUM Roleplay';
            document.getElementById('siteDescription').value = settings.siteDescription || 'United Kingdom Birmingham Roleplay Community';
            document.getElementById('discordLink').value = settings.discordLink || 'https://discord.gg/ukbrum';
            document.getElementById('maintenanceMode').checked = settings.maintenanceMode || false;
        })
        .catch(error => {
            console.error('Error loading site settings:', error);
        });
}

// Add event listener to site settings tab
document.addEventListener('DOMContentLoaded', () => {
    const siteSettingsTab = document.querySelector('.admin-tab[data-tab="site-settings"]');
    if (siteSettingsTab) {
        siteSettingsTab.addEventListener('click', loadSiteSettings);
    }
});