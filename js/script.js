document.addEventListener('DOMContentLoaded', () => {
    // Site is now permanently in dark mode - no theme toggle needed
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });
    
    // Sticky header effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '0.5rem 0';
        } else {
            header.style.padding = '1rem 0';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Logo animation effect
    const logo = document.querySelector('.logo img');
    if (logo) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = logo.getBoundingClientRect();
            const logoX = rect.left + rect.width / 2;
            const logoY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to logo center
            const distX = clientX - logoX;
            const distY = clientY - logoY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            // Only apply effect when mouse is close to logo
            if (distance < 300) {
                const strength = Math.max(10, 100 - distance / 3);
                const glowColor = `rgba(255, 255, 255, ${0.2 - distance/3000})`;
                
                logo.style.filter = `drop-shadow(0 0 ${strength}px ${glowColor})`;
            } else {
                logo.style.filter = '';
            }
        });
    }
    
    // Enhanced scroll reveal animation with intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.department-card, .about-text, .join .container').forEach(el => {
        revealObserver.observe(el);
    });
});