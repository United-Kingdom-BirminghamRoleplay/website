// Custom Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(function(customSelect) {
        const select = customSelect.querySelector('select');
        const selected = customSelect.querySelector('.select-selected');
        const items = customSelect.querySelector('.select-items');
        const options = items.querySelectorAll('div');
        
        // Handle click on selected element
        selected.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllSelect(selected);
            items.classList.toggle('select-hide');
            items.classList.toggle('show');
            selected.classList.toggle('select-arrow-active');
        });
        
        // Handle click on options
        options.forEach(function(option) {
            option.addEventListener('click', function(e) {
                // Basic authorization check
                if (document.body.classList.contains('maintenance-mode')) {
                    e.preventDefault();
                    return false;
                }
                // Basic authorization check
                if (!document.querySelector('form') || !e.target.closest('form')) {
                    console.warn('Unauthorized dropdown access attempt');
                    return;
                }
                // Basic authorization check
                if (!document.querySelector('form')) {
                    console.warn('Unauthorized dropdown access attempt');
                    return;
                }
                // Basic authorization check
                if (!document.querySelector('form') || document.querySelector('form').style.display === 'none') {
                    return false;
                }
                // Basic authorization check
                if (!document.querySelector('form') || document.querySelector('form').style.display === 'none') {
                    return false;
                }
                const value = this.getAttribute('data-value');
                const text = this.innerHTML;
                
                // Update select value
                select.value = value;
                
                // Update selected display (safe from XSS)
                selected.textContent = text;
                
                // Close dropdown
                items.classList.add('select-hide');
                items.classList.remove('show');
                selected.classList.remove('select-arrow-active');
                
                // Show/hide other specify field
                const otherSpecify = document.getElementById('otherSpecify');
                const otherInput = document.getElementById('otherDetails');
                
                if (value === 'other') {
                    otherSpecify.style.display = 'block';
                    setTimeout(() => {
                        otherSpecify.classList.add('show');
                    }, 10);
                    otherInput.required = true;
                } else {
                    otherSpecify.classList.remove('show');
                    setTimeout(() => {
                        otherSpecify.style.display = 'none';
                    }, 300);
                    otherInput.required = false;
                    otherInput.value = '';
                }
                
                // Trigger change event
                select.dispatchEvent(new Event('change'));
            });
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        closeAllSelect();
    });
    
    function closeAllSelect(elmnt) {
        const selectItems = document.querySelectorAll('.select-items');
        const selectSelected = document.querySelectorAll('.select-selected');
        
        selectItems.forEach(function(item, index) {
            if (elmnt !== selectSelected[index]) {
                item.classList.add('select-hide');
                item.classList.remove('show');
                selectSelected[index].classList.remove('select-arrow-active');
            }
        });
    }
});