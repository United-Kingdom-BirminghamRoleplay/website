
let popupShown = false;
const POPUP_KEY = "ukbrum_vote_closed"; 
const AUTO_CLOSE_DELAY = 10000;
const SHOW_DELAYS = [2000, 4000, 6000]; 

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(POPUP_KEY)) return;


  SHOW_DELAYS.forEach(delay => {
    setTimeout(() => {
      if (!popupShown) showVotePopup();
    }, delay);
  });
});
function showVotePopup() {
  if (popupShown) return;
  popupShown = true;

  const popup = document.createElement("div");
  popup.className = "vote-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.innerHTML = `
    <div class="vote-popup-content">
      <button class="vote-popup-close" aria-label="Close popup">&times;</button>
      <div class="vote-popup-icon"><i class="fas fa-trophy"></i></div>
      <h3>🌟 Vote for UKBRUM!</h3>
      <p>Support our community and help us grow!</p>
      <div class="vote-buttons">
        <a href="https://melonly.xyz/servers/ukbrum" 
           target="_blank" 
           rel="noopener" 
           class="vote-btn primary">
          <i class="fas fa-vote-yea"></i> Vote on Melonly
        </a>
        <button class="vote-btn secondary">Maybe Later</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

 
  requestAnimationFrame(() => popup.classList.add("show"));

 
  popup.querySelector(".vote-popup-close").addEventListener("click", () => closeVotePopup(popup, true));
  popup.querySelector(".vote-btn.secondary").addEventListener("click", () => closeVotePopup(popup, true));
  popup.querySelector(".vote-btn.primary").addEventListener("click", () => closeVotePopup(popup, true));


  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeVotePopup(popup, true);
  }, { once: true });


  setTimeout(() => closeVotePopup(popup), AUTO_CLOSE_DELAY);
}

function closeVotePopup(popup, remember = false) {
  if (!popup) return;
  popup.classList.remove("show");
  popup.classList.add("hide");
  setTimeout(() => popup.remove(), 300);

  if (remember) {
    localStorage.setItem(POPUP_KEY, "true");
  }
}
