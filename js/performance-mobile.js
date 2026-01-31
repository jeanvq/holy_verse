// Mobile Performance & UX Enhancements
// Lazy loading, haptic feedback, y optimizaciones de rendimiento

// 1. Lazy Loading Implementation
const LazyLoader = {
    init() {
        if ('IntersectionObserver' in window) {
            this.setupImageLazyLoading();
            this.setupSectionLazyLoading();
        }
    },

    setupImageLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('lazy-loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },

    setupSectionLazyLoading() {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.loaded) {
                    entry.target.dataset.loaded = 'true';
                    // Trigger any section-specific loading
                    const event = new Event('sectionLoaded');
                    entry.target.dispatchEvent(event);
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0
        });

        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }
};

// 2. Haptic Feedback System
const HapticFeedback = {
    // Check device capability
    isSupported() {
        return 'vibrate' in navigator || 'webkitVibrate' in navigator;
    },

    // Light tap feedback
    tap() {
        if (this.isSupported()) {
            navigator.vibrate(10);
        }
    },

    // Medium feedback
    medium() {
        if (this.isSupported()) {
            navigator.vibrate(20);
        }
    },

    // Strong feedback (success)
    success() {
        if (this.isSupported()) {
            navigator.vibrate([10, 5, 10]);
        }
    },

    // Error feedback
    error() {
        if (this.isSupported()) {
            navigator.vibrate([30, 10, 30]);
        }
    },

    // Pattern feedback
    pattern(pattern) {
        if (this.isSupported() && Array.isArray(pattern)) {
            navigator.vibrate(pattern);
        }
    }
};

// 3. Touch Feedback Enhancement
function setupTouchFeedback() {
    const feedbackElements = document.querySelectorAll(
        'button, a, [role="button"], .action-btn, .modal-close'
    );

    feedbackElements.forEach(element => {
        // Haptic feedback on touch
        element.addEventListener('touchstart', () => {
            HapticFeedback.tap();
            element.style.opacity = '0.8';
        }, { passive: true });

        element.addEventListener('touchend', () => {
            element.style.opacity = '1';
        }, { passive: true });

        // Click feedback
        element.addEventListener('click', () => {
            HapticFeedback.tap();
        });
    });

    // Special feedback for form actions
    document.querySelectorAll('input[type="submit"], .primary-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            HapticFeedback.medium();
        });
    });
}

// 4. Smooth Scrolling Optimization
function optimizeScrolling() {
    // Disable scroll animations during heavy lifting
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Perform scroll-dependent updates here
                updateScrollBasedElements(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

function updateScrollBasedElements(scrollY) {
    // Update navbar opacity or other scroll-dependent effects
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const opacity = Math.min(scrollY / 100, 1);
        navbar.style.boxShadow = `0 ${Math.min(scrollY / 10, 8)}px 24px rgba(0, 0, 0, ${opacity * 0.2})`;
    }
}

// 5. Reduce Animations on Scroll
function disableScrollAnimations() {
    const styles = document.createElement('style');
    styles.innerHTML = `
        @media (prefers-reduced-motion: no-preference) {
            @media (max-width: 768px) {
                body.scrolling * {
                    animation: none !important;
                }
            }
        }
    `;
    document.head.appendChild(styles);

    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            document.body.classList.add('scrolling');
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
            isScrolling = false;
        }, 100);
    }, { passive: true });
}

// 6. Image Optimization Helper
function optimizeImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Add loading="lazy" if not present
        if (!img.loading) {
            img.loading = 'lazy';
        }

        // Add decoding="async"
        if (!img.decoding) {
            img.decoding = 'async';
        }

        // Optimize for WebP on supported browsers
        if (img.src.endsWith('.png') || img.src.endsWith('.jpg')) {
            const webpSrc = img.src.replace(/\.(png|jpg)$/i, '.webp');
            const source = document.createElement('source');
            source.srcset = webpSrc;
            source.type = 'image/webp';

            if (img.parentElement.tagName === 'PICTURE') {
                img.parentElement.insertBefore(source, img);
            }
        }

        // Error handling
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
        }, { once: true });
    });
}

// 7. Smart Animation Cleanup
function setupAnimationCleanup() {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 1000) {
                console.warn('Slow animation detected:', entry.name, entry.duration);
            }
        }
    });

    try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
        // Performance Observer not supported
    }
}

// 8. Memory-Efficient Modal Handling
function setupModalPerformance() {
    const modals = document.querySelectorAll('.modal, .modal-overlay, #botPanel');

    modals.forEach(modal => {
        let scrollPos = 0;

        // Store scroll position when modal opens
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!modal.classList.contains('hidden')) {
                    scrollPos = window.scrollY;
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                    document.body.style.top = `-${scrollPos}px`;
                } else {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollPos);
                }
            });
        });

        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    });
}

// 9. Network Status Detection
function monitorNetworkStatus() {
    function updateConnectionStatus() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const effectiveType = connection.effectiveType;

            if (effectiveType === '4g' || effectiveType === 'wifi') {
                document.body.classList.add('fast-connection');
                document.body.classList.remove('slow-connection');
            } else if (effectiveType === '3g' || effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                document.body.classList.remove('fast-connection');
            }

            console.log('Network: ' + effectiveType);
        }
    }

    updateConnectionStatus();

    if (navigator.connection) {
        navigator.connection.addEventListener('change', updateConnectionStatus);
    }
}

// 10. Prefetch Resources
function setupResourcePrefetch() {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'js/ai.js';
    document.head.appendChild(link);

    // Prefetch API endpoints
    if ('dns-prefetch' in document.head) {
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = 'https://rest.api.bible';
        document.head.appendChild(dnsPrefetch);
    }
}

// Initialize all performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Start lazy loading
    LazyLoader.init();

    // Setup touch feedback
    setupTouchFeedback();

    // Optimize scrolling
    optimizeScrolling();

    // Disable scroll animations
    disableScrollAnimations();

    // Setup modal performance
    setupModalPerformance();

    // Monitor network
    monitorNetworkStatus();

    // Setup resource prefetch
    setupResourcePrefetch();

    // Setup animation cleanup
    setupAnimationCleanup();

    // Optimize images
    optimizeImageLoading();

    console.log('✅ Mobile Performance Optimizations Loaded');
}, { once: true });

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HapticFeedback, LazyLoader };
}
