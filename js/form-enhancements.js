// Form Enhancements: Validation, Animations, Smart Features
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const progressFill = document.getElementById('progressFill');
    const autoSave = document.getElementById('autoSave');
    const titleCounter = document.getElementById('titleCounter');
    const detailsCounter = document.getElementById('detailsCounter');
    
    let autoSaveTimeout;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            updateProgress();
            updateCharCounter(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    function validateField(field) {
        const group = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing validation classes
        group.classList.remove('valid', 'invalid');
        
        if (field.required && !value) {
            isValid = false;
        } else if (field.id === 'discordTag' && value) {
            // Discord tag validation - more flexible
            const discordRegex = /^.{2,32}#[0-9]{4}$/;
            isValid = discordRegex.test(value) || value.includes('@');
        } else if (field.type === 'url' && value) {
            // URL validation
            try {
                new URL(value);
            } catch {
                isValid = false;
            }
        } else if (field.id === 'reportTitle' && value) {
            isValid = value.length >= 5;
        } else if (field.id === 'reportDetails' && value) {
            isValid = value.length >= 20;
        }
        
        // Apply validation class
        if (value) {
            group.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        return isValid;
    }
    
    function updateProgress() {
        const totalFields = inputs.length;
        let filledFields = 0;
        
        inputs.forEach(input => {
            if (input.value.trim() && validateField(input)) {
                filledFields++;
            }
        });
        
        const progress = (filledFields / totalFields) * 100;
        progressFill.style.width = progress + '%';
    }
    
    function updateCharCounter(field) {
        if (field.id === 'reportTitle') {
            const count = field.value.length;
            const max = field.maxLength;
            titleCounter.textContent = `${count}/${max}`;
            
            if (count > max * 0.9) titleCounter.className = 'char-counter danger';
            else if (count > max * 0.7) titleCounter.className = 'char-counter warning';
            else titleCounter.className = 'char-counter';
        }
        
        if (field.id === 'reportDetails') {
            const count = field.value.length;
            const max = field.maxLength || 2000;
            detailsCounter.textContent = `${count}/${max}`;
            
            if (count > max * 0.9) detailsCounter.className = 'char-counter danger';
            else if (count > max * 0.7) detailsCounter.className = 'char-counter warning';
            else detailsCounter.className = 'char-counter';
        }
    }
    

    

    

    
    // Smart Discord tag suggestions
    const discordInput = document.getElementById('discordTag');
    if (discordInput) {
        discordInput.addEventListener('input', function() {
            let value = this.value;
            if (value && !value.includes('#') && !value.includes('@') && value.length > 2) {
                // Auto-suggest adding # if user types numbers at the end
                const match = value.match(/^(.+?)(\d{1,4})$/);
                if (match && match[2].length === 4) {
                    this.value = match[1] + '#' + match[2];
                }
            }
        });
    }
    

    
    // Clear form functionality
    const clearBtn = form.querySelector('button[type="reset"]');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear all inputs
            inputs.forEach(input => {
                input.value = '';
                const group = input.closest('.form-group');
                if (group) {
                    group.classList.remove('valid', 'invalid');
                }
            });
            

            
            // Reset counters
            if (titleCounter) titleCounter.textContent = '0/100';
            if (detailsCounter) detailsCounter.textContent = '0/2000';
            
            // Reset progress
            progressFill.style.width = '0%';
            

        });
    }
    
    // Initialize
    updateProgress();
    
    // Update character counters on page load
    inputs.forEach(input => {
        updateCharCounter(input);
    });
});