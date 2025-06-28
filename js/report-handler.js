// Discord webhook function
async function submitToDiscord(reportData) {
    const webhookUrl = 'https://discord.com/api/webhooks/1388568324043964579/tEwAqTdUH7rPZoaGyhsWyrqKLs0L6ip2ZADc8sObKsuEnelBIDO1rDcxQaFEx2RRiamN';
    
    const embed = {
        title: "New Report Submitted",
        color: 0x3498db,
        fields: [
            { name: "Report ID", value: reportData.id, inline: true },
            { name: "Type", value: reportData.type, inline: true },
            { name: "Username", value: reportData.username, inline: true },
            { name: "Discord Tag", value: reportData.discordTag, inline: true },
            { name: "Title", value: reportData.title, inline: false },
            { name: "Details", value: reportData.details.substring(0, 1000), inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "UKBRUM Report System" }
    };
    
    if (reportData.evidence) {
        embed.fields.push({ name: "Evidence URL", value: reportData.evidence.substring(0, 500), inline: false });
    }
    
    if (reportData.otherDetails) {
        embed.fields.push({ name: "Other Details", value: reportData.otherDetails.substring(0, 500), inline: false });
    }
    
    if (window.uploadedFiles && window.uploadedFiles.length > 0) {
        const fileInfo = window.uploadedFiles.map(f => {
            const fileName = f.name || f;
            const fileSize = f.size ? ` (${(f.size / 1024).toFixed(1)}KB)` : '';
            return `${fileName}${fileSize}`;
        }).join('\n');
        
        embed.fields.push({ name: "Uploaded Files", value: fileInfo.substring(0, 1000), inline: false });
        
        embed.fields.push({ name: "Note", value: "Files uploaded but cannot be viewed on GitHub Pages hosting. Consider using a file hosting service for evidence.", inline: false });
    }

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    } catch (error) {
        console.error('Discord webhook error:', error);
    }
}

// Handle report form submissions
document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');
    const formSuccess = document.getElementById('formSuccess');
    const newReportBtn = document.getElementById('newReportBtn');
    
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(reportForm);
            const reportData = {
                type: formData.get('reportType') || 'other',
                username: formData.get('username') || 'Anonymous',
                discordTag: formData.get('discordTag') || 'N/A',
                title: formData.get('reportTitle') || 'Untitled Report',
                details: formData.get('reportDetails') || 'No details provided',
                evidence: formData.get('evidence') || '',
                otherDetails: formData.get('otherDetails') || '',
                files: window.uploadedFiles || []
            };
            
            // Generate a unique ID for the report
            reportData.id = 'REP' + Date.now();
            reportData.timestamp = new Date().toISOString();
            reportData.status = 'pending';
            reportData.notes = [];
            
            // Get existing reports from localStorage or create empty array
            let reportsData = { reports: [] };
            try {
                const existingData = localStorage.getItem('ukbrum_reports');
                if (existingData) {
                    reportsData = JSON.parse(existingData);
                    if (!reportsData.reports) {
                        reportsData.reports = [];
                    }
                }
            } catch (error) {
                console.error('Error parsing reports data:', error);
                reportsData = { reports: [] };
            }
            
            // Add new report
            reportsData.reports.push(reportData);
            
            // Save back to localStorage
            localStorage.setItem('ukbrum_reports', JSON.stringify(reportsData));
            
            // Submit to Discord
            submitToDiscord(reportData);
            
            console.log('Report submitted:', reportData);
            
            // Show success message
            reportForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Clear form
            reportForm.reset();
        });
    }
    
    if (newReportBtn) {
        newReportBtn.addEventListener('click', () => {
            formSuccess.style.display = 'none';
            reportForm.style.display = 'block';
        });
    }
});
