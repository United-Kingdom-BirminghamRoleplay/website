// Check if current department is under development
document.addEventListener('DOMContentLoaded', async function() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    console.log('Current page:', currentPage);
    
    try {
        const response = await fetch('../data/under-development.json');
        const data = await response.json();
        console.log('Development data:', data);
        
        if (data.departments.includes(currentPage)) {
            console.log('Showing development overlay');
            showDevelopmentOverlay();
        }
    } catch (error) {
        console.error('Development check failed:', error);
        // Try alternative path
        try {
            const response2 = await fetch('data/under-development.json');
            const data2 = await response2.json();
            if (data2.departments.includes(currentPage)) {
                showDevelopmentOverlay();
            }
        } catch (error2) {
            console.error('Alternative path failed:', error2);
        }
    }
});

function showDevelopmentOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'development-overlay';
    overlay.innerHTML = `
        <div class="development-modal">
            <div class="icon-container">
                <i class="fas fa-tools"></i>
            </div>
            <h2>Under Development</h2>
            <p>This page is currently being worked on. Please check back later.</p>
            <div class="dev-actions">
                <button class="btn primary-btn" onclick="window.location.href='../index.html'">
                    <i class="fas fa-home"></i> Home
                </button>
                <button class="btn secondary-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                    Continue
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}