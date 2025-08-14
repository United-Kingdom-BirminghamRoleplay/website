// Function to save site settings
async function saveSiteSettings(settings) {
    try {
        // In a real implementation, this would save to a server
        // For this demo, we'll simulate a successful save
        console.log('Site settings saved:', settings);
        
        // Return success response
        return {
            message: "Settings saved successfully.",
            settings: settings
        };
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

// Function to toggle maintenance mode
async function toggleMaintenanceMode(enabled) {
    try {
        // Get current settings
        const response = await fetch('../data/site-settings.json');
        const settings = await response.json();
        
        // Update maintenance mode setting
        settings.maintenanceMode = enabled;
        
        // Save updated settings
        await saveSiteSettings(settings);
        
        // Return success response
        return {
            message: "Maintenance mode " + (enabled ? "enabled" : "disabled") + " successfully.",
            maintenanceMode: settings.maintenanceMode
        };
    } catch (error) {
        console.error('Error toggling maintenance mode:', error);
        throw error;
    }
}