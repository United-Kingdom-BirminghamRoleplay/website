// JavaScript replacements for PHP API functions

// Function to update report status
async function updateReportStatus(reportId, newStatus) {
    try {
        // Get current reports data
        const response = await fetch('../data/reports.json');
        const reportsData = await response.json();
        
        // Find the report to update
        let reportFound = false;
        for (let i = 0; i < reportsData.reports.length; i++) {
            if (reportsData.reports[i].id === reportId) {
                // Update status
                reportsData.reports[i].status = newStatus;
                reportFound = true;
                break;
            }
        }
        
        if (!reportFound) {
            throw new Error('Report not found');
        }
        
        // In a real implementation, this would save to a server
        // For this demo, we'll simulate a successful update
        console.log('Report status updated:', encodeURIComponent(reportId), encodeURIComponent(newStatus));
        
        // Return success response
        return {
            message: "Report status updated successfully.",
            reportId: reportId,
            status: newStatus
        };
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
}

// Function to add note to report
async function addReportNote(reportId, noteText) {
    try {
        // Get current reports data
        const response = await fetch('../data/reports.json');
        const reportsData = await response.json();
        
        // Find the report to update
        let reportFound = false;
        for (let i = 0; i < reportsData.reports.length; i++) {
            if (reportsData.reports[i].id === reportId) {
                // Create note
                const note = {
                    text: noteText,
                    author: sessionStorage.getItem('staffUser'),
                    timestamp: new Date().toISOString()
                };
                
                // Initialize notes array if it doesn't exist
                if (!reportsData.reports[i].notes || !Array.isArray(reportsData.reports[i].notes)) {
                    reportsData.reports[i].notes = [];
                }
                
                // Add note to report
                reportsData.reports[i].notes.push(note);
                reportFound = true;
                break;
            }
        }
        
        if (!reportFound) {
            throw new Error('Report not found');
        }
        
        // In a real implementation, this would save to a server
        // For this demo, we'll simulate a successful update
        console.log('Note added to report:', encodeURIComponent(reportId), encodeURIComponent(noteText));
        
        // Return success response
        return {
            message: "Note added successfully.",
            reportId: reportId
        };
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

// Function to save staff note
async function saveStaffNote(title, content, visibility) {
    try {
        // Get current notes data
        const response = await fetch('../data/staff-notes.json');
        const notesData = await response.json();
        
        // Generate unique note ID (prevent duplicates if notes are deleted)
        const existingIds = notesData.notes.map(note => parseInt(note.id.replace('NOTE', '')));
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        const noteId = "NOTE" + String(maxId + 1).padStart(3, '0');
        
        // Create new note
        const newNote = {
            id: noteId,
            title: title,
            content: content,
            visibility: visibility,
            author: sessionStorage.getItem('staffUser'),
            role: sessionStorage.getItem('staffRole'),
            timestamp: new Date().toISOString()
        };
        
        // Add new note to the array
        notesData.notes.push(newNote);
        
        // In a real implementation, this would save to a server
        // For this demo, we'll simulate a successful save
        console.log('Staff note saved:', newNote);
        
        // Return success response
        return {
            message: "Note saved successfully.",
            noteId: noteId
        };
    } catch (error) {
        console.error('Error saving note:', error);
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
        
        // In a real implementation, this would save to a server
        // For this demo, we'll simulate a successful update
        console.log('Maintenance mode toggled:', enabled);
        
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

// Function to get site settings
async function getSiteSettings() {
    try {
        // Get current settings
        const response = await fetch('../data/site-settings.json');
        const settings = await response.json();
        
        return settings;
    } catch (error) {
        console.error('Error getting site settings:', error);
        throw error;
    }
}