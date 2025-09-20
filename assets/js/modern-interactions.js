// Modern Interactions for Thou Simp/SERENE E-commerce

document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax scrolling effect for hero section
    function initParallax() {
        const heroVideo = document.querySelector('.bg-video');
        if (heroVideo) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                heroVideo.style.transform = `translateY(${parallax}px)`;
            });
        }
    }
    
    // Intersection Observer for animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all products for animation
        document.querySelectorAll('.product').forEach(product => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(30px)';
            product.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(product);
        });
    }
    
    // Enhanced search functionality
    function initEnhancedSearch() {
        const searchInput = document.querySelector('#q');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.toLowerCase();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        highlightProducts(query);
                    }, 300);
                } else {
                    clearHighlights();
                }
            });
        }
    }
    
    function highlightProducts(query) {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const title = product.querySelector('.product-title');
            if (title && title.textContent.toLowerCase().includes(query)) {
                product.style.transform = 'scale(1.02)';
                product.style.boxShadow = '0 15px 50px rgba(255, 107, 107, 0.3)';
                title.style.color = 'var(--primary-color)';
            }
        });
    }
    
    function clearHighlights() {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const title = product.querySelector('.product-title');
            product.style.transform = '';
            product.style.boxShadow = '';
            if (title) title.style.color = '';
        });
    }
    
    // Add to cart with ripple effect
    function initRippleEffect() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-cart')) {
                const button = e.target.closest('.btn-cart');
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    }
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Initialize all features
    initParallax();
    initScrollAnimations();
    initEnhancedSearch();
    initRippleEffect();
    initLazyLoading();
    initSmoothScrolling();
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove any loading overlays
        const loadingOverlays = document.querySelectorAll('.loading-overlay');
        loadingOverlays.forEach(overlay => overlay.remove());
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            document.querySelectorAll('.dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Log Core Web Vitals if available
            if ('web-vitals' in window) {
                // This would require the web-vitals library
                // getCLS, getFID, getLCP, getFCP, getTTFB
            }
        });
    }
    
});

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount);
    }
};
