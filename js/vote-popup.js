// Vote popup functionality
let popupShown = false;

document.addEventListener('DOMContentLoaded', function() {
    // Multiple attempts to show popup
    setTimeout(showVotePopup, 2000);
    setTimeout(() => { if (!popupShown) showVotePopup(); }, 4000);
    setTimeout(() => { if (!popupShown) showVotePopup(); }, 6000);
});

function showVotePopup() {
    // Don't show if already exists or shown
    if (document.querySelector('.vote-popup') || popupShown) return;
    
    popupShown = true;
    
    const popup = document.createElement('div');
    popup.className = 'vote-popup';
    popup.innerHTML = `
        <div class="vote-popup-content">
            <button class="vote-popup-close" onclick="closeVotePopup()">&times;</button>
            <div class="vote-popup-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h3>🌟 Vote for UKBRUM!</h3>
            <p>Support our community and help us grow!</p>
            <div class="vote-buttons">
                <a href="https://melonly.xyz/servers/ukbrum" target="_blank" class="vote-btn primary" onclick="closeVotePopup()">
                    <i class="fas fa-vote-yea"></i> Vote on Melonly
                </a>
                <button class="vote-btn secondary" onclick="closeVotePopup()">Maybe Later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Force show
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
    
    // Auto close after 15 seconds
    setTimeout(closeVotePopup, 15000);
}

function closeVotePopup() {
    const popup = document.querySelector('.vote-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}