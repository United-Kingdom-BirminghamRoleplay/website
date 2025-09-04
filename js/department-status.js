// Department Status System
class DepartmentStatusManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Determine correct path based on current location
            const basePath = window.location.pathname.includes('/departments/') ? '../data/' : 'data/';
            
            const [statusResponse, devResponse] = await Promise.all([
                fetch(basePath + 'department-status.json'),
                fetch(basePath + 'under-development.json')
            ]);
            
            const statusData = await statusResponse.json();
            const devData = await devResponse.json();
            this.checkDepartmentStatus(statusData.departments, devData.departments);
        } catch (error) {
            console.log('Department status data not available');
        }
    }

    checkDepartmentStatus(departments, underDevelopment = []) {
        // Get current page department
        const currentPage = window.location.pathname;
        let departmentKey = null;

        if (currentPage.includes('police.html')) departmentKey = 'police';
        else if (currentPage.includes('rmp.html')) departmentKey = 'rmp';
        else if (currentPage.includes('fire.html')) departmentKey = 'fire';
        else if (currentPage.includes('ambulance.html')) departmentKey = 'ambulance';
        else if (currentPage.includes('highways.html')) departmentKey = 'highways';

        if (departmentKey && departments[departmentKey] && departments[departmentKey].status === 'closed') {
            this.showClosureNotice(departments[departmentKey]);
        }

        // Update main page department cards
        this.updateDepartmentCards(departments, underDevelopment);
    }

    showClosureNotice(departmentData) {
        // Hide all page content
        document.body.style.overflow = 'hidden';
        const content = document.body.innerHTML;
        
        // Replace entire page with closure notice
        document.body.innerHTML = `
            <div class="department-closure-overlay">
                <div class="closure-modal">
                    <div class="closure-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Department Temporarily Closed</h2>
                    <p class="closure-reason">${departmentData.reason}</p>
                    ${departmentData.expectedReopen ? `<p class="reopen-date"><i class="fas fa-calendar"></i> Expected to reopen: ${departmentData.expectedReopen}</p>` : ''}
                    ${departmentData.contact ? `<p class="closure-contact"><i class="fas fa-info-circle"></i> ${departmentData.contact}</p>` : ''}
                    <div class="closure-actions">
                        <a href="../index.html" class="btn primary-btn">
                            <i class="fas fa-home"></i> Return Home
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    updateDepartmentCards(departments, underDevelopment = []) {
        // Update cards on main page
        const cards = document.querySelectorAll('.department-card');
        cards.forEach(card => {
            const link = card.querySelector('a[href*="departments/"]');
            if (!link) return;

            let departmentKey = null;
            if (link.href.includes('police.html')) departmentKey = 'police';
            else if (link.href.includes('rmp.html')) departmentKey = 'rmp';
            else if (link.href.includes('fire.html')) departmentKey = 'fire';
            else if (link.href.includes('ambulance.html')) departmentKey = 'ambulance';
            else if (link.href.includes('highways.html')) departmentKey = 'highways';

            if (departmentKey) {
                // Check if department is closed
                if (departments[departmentKey] && departments[departmentKey].status === 'closed') {
                    card.classList.add('department-closed');
                    card.style.position = 'relative';
                    
                    if (!card.querySelector('.closure-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'closure-badge';
                        badge.innerHTML = '<i class="fas fa-lock"></i> Temporarily Closed';
                        card.appendChild(badge);
                    }

                    const button = card.querySelector('.btn');
                    if (button) {
                        button.textContent = 'View Status';
                    }
                }
                // Check if department is under development
                else if (underDevelopment.includes(departmentKey)) {
                    card.style.position = 'relative';
                    
                    if (!card.querySelector('.development-badge')) {
                        const badge = document.createElement('div');
                        badge.className = 'development-badge';
                        badge.innerHTML = '<i class="fas fa-wrench"></i> Under Development';
                        card.appendChild(badge);
                    }
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DepartmentStatusManager();
});