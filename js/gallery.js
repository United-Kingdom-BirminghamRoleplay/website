// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('galleryGrid');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementById('closeBtn');
    const zoomBtn = document.getElementById('zoomBtn');
    const brightnessBtn = document.getElementById('brightnessBtn');
    const contrastBtn = document.getElementById('contrastBtn');
    const saturationBtn = document.getElementById('saturationBtn');
    const hueBtn = document.getElementById('hueBtn');
    const blurBtn = document.getElementById('blurBtn');
    const sepiaBtn = document.getElementById('sepiaBtn');
    const resetBtn = document.getElementById('resetBtn');
    let isZoomed = false;
    let brightness = 100;
    let contrast = 100;
    let saturation = 100;
    let hue = 0;
    let blur = 0;
    let sepia = 0;

    // Load gallery images
    fetch('data/gallery.json')
        .then(response => response.json())
        .then(data => {
            galleryGrid.innerHTML = '';
            
            data.images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                // Add loading spinner with text
                const loader = document.createElement('div');
                loader.className = 'gallery-loading';
                loader.innerHTML = '<div class="spinner"></div><span>Loading...</span>';
                galleryItem.appendChild(loader);
                
                const img = document.createElement('img');
                img.alt = image.alt;
                img.title = image.title;
                
                // Add click event to both container and image
                galleryItem.addEventListener('click', () => openModal(image));
                img.addEventListener('click', () => openModal(image));
                
                galleryItem.appendChild(img);
                galleryGrid.appendChild(galleryItem);
                
                // Load image immediately
                img.src = image.src;
                img.onload = () => {
                    img.classList.add('loaded');
                    loader.remove();
                };
                img.onerror = () => {
                    loader.remove();
                    galleryItem.innerHTML = '<div class="error-placeholder">Image failed to load</div>';
                };
            });
        })
        .catch(() => {
            galleryGrid.innerHTML = '<div class="error-message">Error loading gallery</div>';
        });

    // Modal functions
    function openModal(image) {
        modal.style.display = 'block';
        modalCaption.textContent = image.title || 'UKBRUM ERLC';
        resetZoom();
        modalImg.style.transition = 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Set document title for taskbar
        document.title = `${image.title || 'Gallery Image'} - UKBRUM`;
        
        showNotification('Image Opened', 'fa-expand');
        
        // Show loading spinner
        const loader = document.getElementById('modalLoader');
        loader.style.display = 'block';
        modalImg.classList.remove('loaded');
        
        // Fixed 3 second delay or actual load time
        let imageLoaded = false;
        let timerComplete = false;
        
        // Start loading image immediately
        modalImg.src = image.src;
        modalImg.onload = () => {
            imageLoaded = true;
            if (timerComplete) {
                modalImg.classList.add('loaded');
                loader.style.display = 'none';
                // Apply subtle automatic enhancement
                brightness = 110;
                contrast = 115;
                saturation = 115;
                hue = 2;
                updateFilters();
                // Add subtle glow effect
                modalImg.style.boxShadow = '0 0 30px rgba(74, 144, 226, 0.3)';
                modalImg.style.borderRadius = '8px';
                // Show notification after enhancement
                setTimeout(() => {
                    showNotification('Image AI Enhanced', 'fa-magic');
                }, 200);
            }
        };
        
        // 3 second minimum delay
        setTimeout(() => {
            timerComplete = true;
            if (imageLoaded) {
                modalImg.classList.add('loaded');
                loader.style.display = 'none';
                // Apply subtle automatic enhancement
                brightness = 110;
                contrast = 115;
                saturation = 115;
                hue = 2;
                updateFilters();
                // Add subtle glow effect
                modalImg.style.boxShadow = '0 0 30px rgba(74, 144, 226, 0.3)';
                modalImg.style.borderRadius = '8px';
                // Show notification after enhancement
                setTimeout(() => {
                    showNotification('Image AI Enhanced', 'fa-magic');
                }, 200);
            }
        }, 3000);
    }

    function closeModal() {
        modal.style.display = 'none';
        resetZoom();
        resetFilters();
        
        // Restore original document title
        document.title = 'Key Information - UKBRUM';
    }
    
    function toggleZoom() {
        isZoomed = !isZoomed;
        if (isZoomed) {
            modalImg.classList.add('zoomed');
            zoomBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
            zoomBtn.title = 'Zoom Out';
            zoomBtn.classList.add('active');
            showNotification('Zoomed In 2.5x', 'fa-search-plus');
        } else {
            modalImg.classList.remove('zoomed');
            zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
            zoomBtn.title = 'Zoom In';
            zoomBtn.classList.remove('active');
            showNotification('Zoomed Out', 'fa-search-minus');
        }
    }
    
    function resetZoom() {
        isZoomed = false;
        modalImg.classList.remove('zoomed');
        zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomBtn.title = 'Zoom In';
        zoomBtn.classList.remove('active');
    }
    
    function adjustBrightness() {
        brightness = brightness >= 250 ? 25 : brightness + 25;
        updateFilters();
        showNotification(`Brightness: ${brightness}%`, 'fa-sun');
        brightnessBtn.classList.toggle('active', brightness !== 100);
    }
    
    function adjustContrast() {
        contrast = contrast >= 250 ? 25 : contrast + 25;
        updateFilters();
        showNotification(`Contrast: ${contrast}%`, 'fa-adjust');
        contrastBtn.classList.toggle('active', contrast !== 100);
    }
    
    function adjustSaturation() {
        saturation = saturation >= 300 ? 0 : saturation + 50;
        updateFilters();
        showNotification(`Saturation: ${saturation}%`, 'fa-palette');
        saturationBtn.classList.toggle('active', saturation !== 100);
    }
    
    function adjustHue() {
        hue = hue >= 360 ? 0 : hue + 30;
        updateFilters();
        showNotification(`Hue: ${hue}°`, 'fa-rainbow');
        hueBtn.classList.toggle('active', hue !== 0);
    }
    
    function adjustBlur() {
        blur = blur >= 10 ? 0 : blur + 2;
        updateFilters();
        showNotification(`Blur: ${blur}px`, 'fa-eye-slash');
        blurBtn.classList.toggle('active', blur !== 0);
    }
    
    function adjustSepia() {
        sepia = sepia >= 100 ? 0 : sepia + 20;
        updateFilters();
        showNotification(`Sepia: ${sepia}%`, 'fa-camera-retro');
        sepiaBtn.classList.toggle('active', sepia !== 0);
    }
    
    function updateFilters() {
        modalImg.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) sepia(${sepia}%)`;
    }
    
    function resetFilters() {
        brightness = 100;
        contrast = 100;
        saturation = 100;
        hue = 0;
        blur = 0;
        sepia = 0;
        modalImg.style.filter = 'none';
        showNotification('All Filters Reset', 'fa-undo');
        document.querySelectorAll('.modal-btn').forEach(btn => btn.classList.remove('active'));
    }
    
    function showNotification(message, icon) {
        const notification = document.getElementById('enhanceNotification');
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    document.getElementById('closeBigBtn').addEventListener('click', closeModal);
    zoomBtn.addEventListener('click', toggleZoom);
    brightnessBtn.addEventListener('click', adjustBrightness);
    contrastBtn.addEventListener('click', adjustContrast);
    saturationBtn.addEventListener('click', adjustSaturation);
    hueBtn.addEventListener('click', adjustHue);
    blurBtn.addEventListener('click', adjustBlur);
    sepiaBtn.addEventListener('click', adjustSepia);
    resetBtn.addEventListener('click', resetFilters);
    // Image click removed - use zoom button only
    
    modal.addEventListener('click', closeModal);
    
    // Prevent modal from closing when clicking on content
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.querySelector('.modal-controls').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.querySelector('.modal-caption').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.querySelector('.modal-close-big').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'z' || e.key === 'Z') toggleZoom();
    });
});