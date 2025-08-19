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
        // Create elements safely to prevent XSS
        const modal = document.createElement('div');
        modal.className = 'form-disabled-modal';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-triangle';
        
        const title = document.createElement('h2');
        title.textContent = 'SECURITY ALERT';
        
        const code = document.createElement('div');
        code.className = 'security-code';
        code.textContent = 'ERROR CODE: SEC-001';
        
        const messageP = document.createElement('p');
        messageP.textContent = message; // Safe text content
        
        const link = document.createElement('a');
        link.href = discordLink;
        link.className = 'btn';
        link.innerHTML = '<i class="fab fa-discord"></i> Report via Discord';
        
        modal.appendChild(icon);
        modal.appendChild(title);
        modal.appendChild(code);
        modal.appendChild(messageP);
        modal.appendChild(link);
        overlay.appendChild(modal);
        
        formContainer.appendChild(overlay);
        
        // Disable all form inputs
        const inputs = reportForm.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.pointerEvents = 'none';
        });
    }
}