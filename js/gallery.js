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
    let isDragging = false;
    let startX, startY, currentX = 0, currentY = 0;

    // Load gallery images
    fetch('data/gallery.json')
        .then(response => response.json())
        .then(data => {
            galleryGrid.innerHTML = '';
            
            data.images.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const loader = document.createElement('div');
                loader.className = 'gallery-loading';
                loader.innerHTML = '<div class="spinner"></div><span>Loading...</span>';
                galleryItem.appendChild(loader);
                
                const img = document.createElement('img');
                img.alt = image.alt;
                img.title = image.title;
                
                galleryItem.addEventListener('click', () => openModal(image));
                img.addEventListener('click', () => openModal(image));
                
                galleryItem.appendChild(img);
                galleryGrid.appendChild(galleryItem);
                
                img.onload = () => {
                    img.classList.add('loaded');
                    loader.remove();
                };
                img.onerror = () => {
                    loader.remove();
                    galleryItem.innerHTML = '<div class="error-placeholder">Image failed to load</div>';
                };
                img.src = image.src;
            });
        })
        .catch(() => {
            galleryGrid.innerHTML = '<div class="error-message">Error loading gallery</div>';
        });

    function openModal(image) {
        modal.style.display = 'block';
        modalCaption.textContent = image.title || 'UKBRUM ERLC';
        resetZoom();
        modalImg.style.transition = 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        document.title = `${image.title || 'Gallery Image'} - UKBRUM`;
        
        const header = document.querySelector('header');
        if (header) {
            header.style.transition = 'transform 0.3s ease';
            header.style.transform = 'translateY(-100%)';
        }
        
        showNotification('Image Opened', 'fa-expand');
        
        const loader = document.getElementById('modalLoader');
        loader.style.display = 'block';
        modalImg.classList.remove('loaded');
        
        let imageLoaded = false;
        let timerComplete = false;
        
        modalImg.src = image.src;
        modalImg.onload = () => {
            imageLoaded = true;
            if (timerComplete) {
                completeImageLoad();
            }
        };
        
        setTimeout(() => {
            timerComplete = true;
            if (imageLoaded) {
                completeImageLoad();
            }
        }, 3000);
        
        function completeImageLoad() {
            modalImg.classList.add('loaded');
            loader.style.display = 'none';
            brightness = 110;
            contrast = 115;
            saturation = 115;
            hue = 2;
            updateFilters();
            modalImg.style.boxShadow = '0 0 30px rgba(74, 144, 226, 0.3)';
            modalImg.style.borderRadius = '8px';
            setTimeout(() => {
                showNotification('Image Enhancement complete by AI', 'fa-magic');
            }, 200);
        }
    }

    function closeModal() {
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = 'translateY(0)';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            resetZoom();
            resetFilters();
            document.title = 'Key Information - UKBRUM';
        }, 300);
    }
    
    function toggleZoom() {
        isZoomed = !isZoomed;
        if (isZoomed) {
            modalImg.classList.add('zoomed');
            zoomBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
            zoomBtn.title = 'Zoom Out';
            zoomBtn.classList.add('active');
            showNotification('Zoomed In 1.8x', 'fa-search-plus');
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
        currentX = 0;
        currentY = 0;
        modalImg.style.transform = '';
        modalImg.style.cursor = 'zoom-in';
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
    
    modalImg.addEventListener('mousedown', (e) => {
        if (isZoomed) {
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            modalImg.style.cursor = 'grabbing';
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && isZoomed) {
            e.preventDefault();
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            modalImg.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(1.8)`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
        }
    });
    
    modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isDragging) {
            toggleZoom();
        }
    });
    
    modal.addEventListener('click', closeModal);
    
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