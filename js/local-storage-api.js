// Local Storage API - Replacement for PHP backend

// Get reports from localStorage
function getReports() {
    try {
        const storedReports = localStorage.getItem('ukbrum_reports');
        if (storedReports) {
            return JSON.parse(storedReports);
        }
    } catch (error) {
        console.error('Error getting reports:', error);
    }
    return { reports: [] };
}

// Update report status
function updateReportStatus(reportId, newStatus) {
    try {
        const data = getReports();
        let reportFound = false;
        
        for (let i = 0; i < data.reports.length; i++) {
            if (data.reports[i].id === reportId) {
                data.reports[i].status = newStatus;
                reportFound = true;
                break;
            }
        }
        
        if (!reportFound) {
            throw new Error('Report not found');
        }
        
        localStorage.setItem('ukbrum_reports', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
}

// Add note to report
function addReportNote(reportId, noteText) {
    try {
        const data = getReports();
        let reportFound = false;
        
        for (let i = 0; i < data.reports.length; i++) {
            if (data.reports[i].id === reportId) {
                const note = {
                    text: noteText,
                    author: sessionStorage.getItem('staffUser'),
                    timestamp: new Date().toISOString()
                };
                
                if (!data.reports[i].notes) {
                    data.reports[i].notes = [];
                }
                
                data.reports[i].notes.push(note);
                reportFound = true;
                break;
            }
        }
        
        if (!reportFound) {
            throw new Error('Report not found');
        }
        
        localStorage.setItem('ukbrum_reports', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error adding note to report:', error);
        throw error;
    }
}

// Get staff notes from localStorage
function getStaffNotes() {
    try {
        const storedNotes = localStorage.getItem('ukbrum_staff_notes');
        if (storedNotes) {
            return JSON.parse(storedNotes);
        }
    } catch (error) {
        console.error('Error getting staff notes:', error);
    }
    return { notes: [] };
}

// Save staff note
function saveStaffNote(title, content, visibility) {
    try {
        const data = getStaffNotes();
        
        const note = {
            id: 'NOTE' + Date.now(),
            title: title,
            content: content,
            visibility: visibility,
            author: sessionStorage.getItem('staffUser'),
            role: sessionStorage.getItem('staffRole'),
            timestamp: new Date().toISOString()
        };
        
        data.notes.push(note);
        localStorage.setItem('ukbrum_staff_notes', JSON.stringify(data));
        
        return { success: true, noteId: note.id };
    } catch (error) {
        console.error('Error saving staff note:', error);
        throw error;
    }
}

// Get site settings from localStorage
function getSiteSettings() {
    try {
        const storedSettings = localStorage.getItem('ukbrum_site_settings');
        if (storedSettings) {
            return JSON.parse(storedSettings);
        }
    } catch (error) {
        console.error('Error getting site settings:', error);
    }
    return {
        siteName: 'UKBRUM Roleplay',
        siteDescription: 'United Kingdom Birmingham Roleplay Community',
        discordLink: 'https://discord.gg/ukbrum',
        maintenanceMode: false
    };
}

// Save site settings
function saveSiteSettings(settings) {
    try {
        localStorage.setItem('ukbrum_site_settings', JSON.stringify(settings));
        return { success: true };
    } catch (error) {
        console.error('Error saving site settings:', error);
        throw error;
    }
}