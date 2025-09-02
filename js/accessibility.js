// Simple Accessibility Settings
document.addEventListener('DOMContentLoaded', function() {
    createAccessibilityPanel();
    loadAccessibilitySettings();
});

function createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.innerHTML = `
        <button class="accessibility-toggle" id="accessibilityToggle" aria-label="Accessibility Settings">
            <i class="fas fa-universal-access"></i>
            <span>Accessibility</span>
        </button>
        <div class="accessibility-content" id="accessibilityContent">
            <h3>Accessibility Settings</h3>
            <div class="setting-group">
                <label for="fontSize">Text Size:</label>
                <select id="fontSize">
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                </select>
            </div>
            <div class="setting-group">
                <label for="contrast">Contrast:</label>
                <select id="contrast">
                    <option value="normal">Normal</option>
                    <option value="high">High Contrast</option>
                </select>
            </div>
            <div class="setting-group">
                <label for="animations">Animations:</label>
                <select id="animations">
                    <option value="enabled">Enabled</option>
                    <option value="reduced">Reduced</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>
            <div class="setting-group">
                <label for="focusIndicator">Focus Indicators:</label>
                <select id="focusIndicator">
                    <option value="normal">Normal</option>
                    <option value="enhanced">Enhanced</option>
                </select>
            </div>
            <button class="reset-btn" id="resetSettings">Reset to Default</button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Toggle panel
    document.getElementById('accessibilityToggle').addEventListener('click', function() {
        const content = document.getElementById('accessibilityContent');
        content.classList.toggle('show');
    });
    
    // Setting change listeners
    document.getElementById('fontSize').addEventListener('change', applyFontSize);
    document.getElementById('contrast').addEventListener('change', applyContrast);
    document.getElementById('animations').addEventListener('change', applyAnimations);
    document.getElementById('focusIndicator').addEventListener('change', applyFocusIndicator);
    document.getElementById('resetSettings').addEventListener('click', resetSettings);
}

function applyFontSize() {
    const fontSize = document.getElementById('fontSize').value;
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    if (fontSize !== 'normal') {
        document.body.classList.add(`font-size-${fontSize}`);
    }
    saveSettings();
}

function applyContrast() {
    const contrast = document.getElementById('contrast').value;
    document.body.className = document.body.className.replace(/contrast-\w+/g, '');
    if (contrast !== 'normal') {
        document.body.classList.add(`contrast-${contrast}`);
    }
    saveSettings();
}

function applyAnimations() {
    const animations = document.getElementById('animations').value;
    document.body.className = document.body.className.replace(/animations-\w+/g, '');
    if (animations !== 'enabled') {
        document.body.classList.add(`animations-${animations}`);
    }
    saveSettings();
}

function applyFocusIndicator() {
    const focusIndicator = document.getElementById('focusIndicator').value;
    document.body.className = document.body.className.replace(/focus-\w+/g, '');
    if (focusIndicator !== 'normal') {
        document.body.classList.add(`focus-${focusIndicator}`);
    }
    saveSettings();
}

function saveSettings() {
    const settings = {
        fontSize: document.getElementById('fontSize').value,
        contrast: document.getElementById('contrast').value,
        animations: document.getElementById('animations').value,
        focusIndicator: document.getElementById('focusIndicator').value
    };
    localStorage.setItem('ukbrum-accessibility', JSON.stringify(settings));
}

function loadAccessibilitySettings() {
    const saved = localStorage.getItem('ukbrum-accessibility');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('fontSize').value = settings.fontSize || 'normal';
        document.getElementById('contrast').value = settings.contrast || 'normal';
        document.getElementById('animations').value = settings.animations || 'enabled';
        document.getElementById('focusIndicator').value = settings.focusIndicator || 'normal';
        
        applyFontSize();
        applyContrast();
        applyAnimations();
        applyFocusIndicator();
    }
}

function resetSettings() {
    document.getElementById('fontSize').value = 'normal';
    document.getElementById('contrast').value = 'normal';
    document.getElementById('animations').value = 'enabled';
    document.getElementById('focusIndicator').value = 'normal';
    
    document.body.className = document.body.className.replace(/font-size-\w+|contrast-\w+|animations-\w+|focus-\w+/g, '');
    
    localStorage.removeItem('ukbrum-accessibility');
}