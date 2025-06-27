// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const loggedInUser = sessionStorage.getItem('staffUser');
    const loggedInRole = sessionStorage.getItem('staffRole');
    
    if (!loggedInUser || !loggedInRole) {
        // Redirect to login page if not logged in
        window.location.href = '../info.html#login-section';
        return;
    }
    
    // Set user info
    document.getElementById('userName').textContent = loggedInUser;
    document.getElementById('userRole').textContent = capitalizeFirstLetter(loggedInRole);
    
    // Show admin section for admin, management, and founder roles
    if (['admin', 'management', 'founder'].includes(loggedInRole)) {
        document.getElementById('adminSection').style.display = 'block';
    } else {
        document.getElementById('adminSection').style.display = 'none';
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.parentElement.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Update page title
            pageTitle.textContent = link.querySelector('span').textContent;
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check if dark mode is enabled
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('staffUser');
        sessionStorage.removeItem('staffRole');
        window.location.href = '../index.html';
    });
    
    // Load data
    loadReports();
    loadStaffNotes();
    loadSiteSettings();
    
    // Report modal
    const reportModal = document.getElementById('reportModal');
    const closeReportModal = reportModal.querySelector('.close-modal');
    
    closeReportModal.addEventListener('click', () => {
        reportModal.style.display = 'none';
    });
    
    // Add Note modal
    const addNoteModal = document.getElementById('addNoteModal');
    const closeNoteModal = addNoteModal.querySelector('.close-modal');
    const cancelNoteBtn = addNoteModal.querySelector('.cancel-btn');
    const addNoteBtn = document.getElementById('addNoteBtn');
    
    addNoteBtn.addEventListener('click', () => {
        addNoteModal.style.display = 'block';
    });
    
    closeNoteModal.addEventListener('click', () => {
        addNoteModal.style.display = 'none';
    });
    
    cancelNoteBtn.addEventListener('click', () => {
        addNoteModal.style.display = 'none';
    });
    
    // Add Note form submission
    const addNoteForm = document.getElementById('addNoteForm');
    
    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        const visibility = document.getElementById('noteVisibility').value;
        
        saveStaffNote(title, content, visibility)
            .then(() => {
                addNoteModal.style.display = 'none';
                loadStaffNotes(); // Reload notes
                
                // Clear form
                addNoteForm.reset();
            })
            .catch(error => {
                console.error('Error saving note:', error);
                alert('Error saving note. Please try again.');
            });
    });
    
    // Settings form submission
    const settingsForm = document.getElementById('settingsForm');
    
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const siteName = document.getElementById('siteName').value;
        const siteDescription = document.getElementById('siteDescription').value;
        const discordLink = document.getElementById('discordLink').value;
        const maintenanceMode = document.getElementById('maintenanceMode').checked;
        
        saveSiteSettings({
            siteName,
            siteDescription,
            discordLink,
            maintenanceMode
        })
            .then(() => {
                alert('Settings saved successfully!');
            })
            .catch(error => {
                console.error('Error saving settings:', error);
                alert('Error saving settings. Please try again.');
            });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === reportModal) {
            reportModal.style.display = 'none';
        }
        if (e.target === addNoteModal) {
            addNoteModal.style.display = 'none';
        }
    });
});

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Load reports
async function loadReports() {
    try {
        const response = await fetch('../data/reports.json');
        const data = await response.json();
        const reports = data.reports || [];
        
        // Update counts
        document.getElementById('reportsCount').textContent = reports.length;
        document.getElementById('pendingReportsCount').textContent = reports.filter(r => r.status === 'pending').length;
        document.getElementById('resolvedReportsCount').textContent = reports.filter(r => r.status === 'resolved').length;
        
        // Sort reports by date (newest first)
        reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Populate recent reports table (limit to 5)
        const recentReportsTable = document.getElementById('recentReportsTable');
        if (recentReportsTable) {
            recentReportsTable.innerHTML = '';
            
            const recentReports = reports.slice(0, 5);
            
            if (recentReports.length === 0) {
                recentReportsTable.innerHTML = '<tr><td colspan="4">No reports found</td></tr>';
            } else {
                recentReports.forEach(report => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${report.id}</td>
                        <td>${capitalizeFirstLetter(report.type)}</td>
                        <td>${report.title}</td>
                        <td><span class="status-badge ${report.status}">${capitalizeFirstLetter(report.status)}</span></td>
                    `;
                    recentReportsTable.appendChild(row);
                    
                    // Add click event to view report details
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => {
                        showReportDetails(report);
                    });
                });
            }
        }
        
        // Populate full reports table
        const reportsTableBody = document.getElementById('reportsTableBody');
        if (reportsTableBody) {
            reportsTableBody.innerHTML = '';
            
            if (reports.length === 0) {
                reportsTableBody.innerHTML = '<tr><td colspan="7">No reports found</td></tr>';
            } else {
                reports.forEach(report => {
                    const date = new Date(report.timestamp);
                    const formattedDate = date.toLocaleDateString();
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${report.id}</td>
                        <td>${capitalizeFirstLetter(report.type)}</td>
                        <td>${report.title}</td>
                        <td>${report.username}</td>
                        <td>${formattedDate}</td>
                        <td><span class="status-badge ${report.status}">${capitalizeFirstLetter(report.status)}</span></td>
                        <td>
                            <button class="action-btn view-report" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    `;
                    reportsTableBody.appendChild(row);
                    
                    // Add click event to view button
                    const viewBtn = row.querySelector('.view-report');
                    viewBtn.addEventListener('click', () => {
                        showReportDetails(report);
                    });
                });
            }
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Show report details in modal
function showReportDetails(report) {
    const modal = document.getElementById('reportModal');
    
    // Populate modal with report data
    document.getElementById('modalReportTitle').textContent = report.title;
    document.getElementById('modalReportId').textContent = report.id;
    document.getElementById('modalReportType').textContent = capitalizeFirstLetter(report.type);
    document.getElementById('modalReportUser').textContent = report.username;
    document.getElementById('modalReportDiscord').textContent = report.discordTag;
    
    const date = new Date(report.timestamp);
    document.getElementById('modalReportDate').textContent = date.toLocaleString();
    
    document.getElementById('modalReportStatus').textContent = capitalizeFirstLetter(report.status);
    document.getElementById('modalReportDetails').textContent = report.details;
    
    if (report.evidence) {
        document.getElementById('modalReportEvidence').innerHTML = `<a href="${report.evidence}" target="_blank">${report.evidence}</a>`;
    } else {
        document.getElementById('modalReportEvidence').textContent = 'No evidence provided';
    }
    
    // Populate notes history
    const notesHistory = document.getElementById('reportNotesHistory');
    notesHistory.innerHTML = '';
    
    if (report.notes && report.notes.length > 0) {
        report.notes.forEach(note => {
            const noteDate = new Date(note.timestamp);
            const formattedNoteDate = noteDate.toLocaleString();
            
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.innerHTML = `
                <p class="note-text">${note.text}</p>
                <div class="note-meta">
                    <span class="note-author">${note.author}</span>
                    <span class="note-time">${formattedNoteDate}</span>
                </div>
            `;
            
            notesHistory.appendChild(noteElement);
        });
    } else {
        notesHistory.innerHTML = '<p class="no-notes">No notes added yet</p>';
    }
    
    // Add event listeners to status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newStatus = btn.getAttribute('data-status');
            
            updateReportStatus(report.id, newStatus)
                .then(() => {
                    document.getElementById('modalReportStatus').textContent = capitalizeFirstLetter(newStatus);
                    loadReports(); // Reload reports to update counts and tables
                })
                .catch(error => {
                    console.error('Error updating report status:', error);
                    alert('Error updating report status. Please try again.');
                });
        });
    });
    
    // Add note button
    document.getElementById('addReportNoteBtn').addEventListener('click', () => {
        const noteText = document.getElementById('reportNoteText').value;
        
        if (!noteText) {
            alert('Please enter a note.');
            return;
        }
        
        addReportNote(report.id, noteText)
            .then(() => {
                // Clear textarea
                document.getElementById('reportNoteText').value = '';
                
                // Reload report details to show new note
                loadReports().then(() => {
                    // Find the report again with updated data
                    fetch('../data/reports.json')
                        .then(response => response.json())
                        .then(data => {
                            const updatedReport = data.reports.find(r => r.id === report.id);
                            if (updatedReport) {
                                showReportDetails(updatedReport);
                            }
                        });
                });
            })
            .catch(error => {
                console.error('Error adding note:', error);
                alert('Error adding note. Please try again.');
            });
    });
    
    // Show modal
    modal.style.display = 'block';
}

// Load staff notes
async function loadStaffNotes() {
    try {
        const response = await fetch('../data/staff-notes.json');
        const data = await response.json();
        const notes = data.notes || [];
        
        // Update count
        document.getElementById('notesCount').textContent = notes.length;
        
        // Sort notes by date (newest first)
        notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Filter notes based on visibility and user role
        const userRole = sessionStorage.getItem('staffRole');
        const userName = sessionStorage.getItem('staffUser');
        
        const visibleNotes = notes.filter(note => {
            // Notes visible to all staff
            if (note.visibility === 'all') return true;
            
            // Notes visible only to the author
            if (note.visibility === 'private' && note.author === userName) return true;
            
            // Notes visible to moderators and up
            if (note.visibility === 'moderators' && ['moderator', 'admin', 'management', 'founder'].includes(userRole)) return true;
            
            // Notes visible to admins and up
            if (note.visibility === 'admins' && ['admin', 'management', 'founder'].includes(userRole)) return true;
            
            // Notes visible to management and founders
            if (note.visibility === 'management' && ['management', 'founder'].includes(userRole)) return true;
            
            return false;
        });
        
        // Populate recent notes list (limit to 3)
        const recentNotesList = document.getElementById('recentNotesList');
        if (recentNotesList) {
            recentNotesList.innerHTML = '';
            
            const recentNotes = visibleNotes.slice(0, 3);
            
            if (recentNotes.length === 0) {
                recentNotesList.innerHTML = '<p class="no-notes">No notes found</p>';
            } else {
                recentNotes.forEach(note => {
                    const date = new Date(note.timestamp);
                    const formattedDate = date.toLocaleDateString();
                    
                    const noteElement = document.createElement('div');
                    noteElement.className = 'note-item';
                    noteElement.innerHTML = `
                        <div class="note-header">
                            <h4 class="note-title">${note.title}</h4>
                            <span class="note-date">${formattedDate}</span>
                        </div>
                        <div class="note-content">
                            <p>${note.content}</p>
                        </div>
                        <div class="note-footer">
                            <span class="note-author">By: ${note.author}</span>
                            <span class="note-visibility">
                                <i class="fas fa-eye"></i> ${capitalizeFirstLetter(note.visibility)}
                            </span>
                        </div>
                    `;
                    recentNotesList.appendChild(noteElement);
                });
            }
        }
        
        // Populate staff notes grid
        const staffNotesList = document.getElementById('staffNotesList');
        if (staffNotesList) {
            staffNotesList.innerHTML = '';
            
            if (visibleNotes.length === 0) {
                staffNotesList.innerHTML = '<div class="no-notes" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No notes found</div>';
            } else {
                visibleNotes.forEach(note => {
                    const date = new Date(note.timestamp);
                    const formattedDate = date.toLocaleDateString();
                    
                    const noteCard = document.createElement('div');
                    noteCard.className = 'note-card';
                    noteCard.innerHTML = `
                        <div class="note-header">
                            <h4 class="note-title">${note.title}</h4>
                            <span class="note-date">${formattedDate}</span>
                        </div>
                        <div class="note-content">
                            <p>${note.content}</p>
                        </div>
                        <div class="note-footer">
                            <span class="note-author">By: ${note.author}</span>
                            <span class="note-visibility">
                                <i class="fas fa-eye"></i> ${capitalizeFirstLetter(note.visibility)}
                            </span>
                        </div>
                    `;
                    staffNotesList.appendChild(noteCard);
                });
            }
        }
    } catch (error) {
        console.error('Error loading staff notes:', error);
    }
}

// Load site settings
async function loadSiteSettings() {
    try {
        const response = await fetch('../data/site-settings.json');
        const settings = await response.json();
        
        document.getElementById('siteName').value = settings.siteName || '';
        document.getElementById('siteDescription').value = settings.siteDescription || '';
        document.getElementById('discordLink').value = settings.discordLink || '';
        document.getElementById('maintenanceMode').checked = settings.maintenanceMode || false;
    } catch (error) {
        console.error('Error loading site settings:', error);
    }
}

// Update report status
async function updateReportStatus(reportId, newStatus) {
    try {
        // In a real implementation, this would save to a server
        console.log('Updating report status:', reportId, newStatus);
        return { success: true };
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
}

// Add note to report
async function addReportNote(reportId, noteText) {
    try {
        // In a real implementation, this would save to a server
        console.log('Adding note to report:', reportId, noteText);
        return { success: true };
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
}

// Save staff note
async function saveStaffNote(title, content, visibility) {
    try {
        // In a real implementation, this would save to a server
        console.log('Saving staff note:', title, content, visibility);
        return { success: true, noteId: 'NOTE' + Date.now() };
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
}

// Save site settings
async function saveSiteSettings(settings) {
    try {
        // In a real implementation, this would save to a server
        console.log('Saving site settings:', settings);
        return { success: true };
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}