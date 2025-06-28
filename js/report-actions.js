// Additional report actions

// Delete report
function deleteReport(reportId) {
    try {
        const data = getReports();
        const reportIndex = data.reports.findIndex(report => report.id === reportId);
        
        if (reportIndex === -1) {
            throw new Error('Report not found');
        }
        
        // Remove the report
        data.reports.splice(reportIndex, 1);
        
        localStorage.setItem('ukbrum_reports', JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
}

// Flag report
function flagReport(reportId, flagged = true) {
    try {
        const data = getReports();
        let reportFound = false;
        
        for (let i = 0; i < data.reports.length; i++) {
            if (data.reports[i].id === reportId) {
                data.reports[i].flagged = flagged;
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
        console.error('Error flagging report:', error);
        throw error;
    }
}