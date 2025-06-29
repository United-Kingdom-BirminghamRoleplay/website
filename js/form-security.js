// Emergency Form Security System
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('data/form-status.json');
        const status = await response.json();
        
        if (!status.formEnabled) {
            disableForm(status.message, status.discordLink);
        }
    } catch (error) {
        console.error('Form security check failed:', error);
    }
});

function disableForm(message, discordLink) {
    const formContainer = document.querySelector('.form-container');
    const reportForm = document.getElementById('reportForm');
    
    if (formContainer && reportForm) {
        // Disable form
        formContainer.classList.add('disabled');
        reportForm.style.pointerEvents = 'none';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'form-disabled-overlay';
        overlay.innerHTML = `
            <div class="form-disabled-modal">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>SECURITY ALERT</h2>
                <div class="security-code">ERROR CODE: SEC-001</div>
                <p>${message}</p>
                <a href="${discordLink}" class="btn">
                    <i class="fab fa-discord"></i> Report via Discord
                </a>
            </div>
        `;
        
        formContainer.appendChild(overlay);
        
        // Disable all form inputs
        const inputs = reportForm.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.pointerEvents = 'none';
        });
    }
}
