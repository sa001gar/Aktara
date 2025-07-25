// Index page specific functionality

let aosInitialized = false;
let swiperInitialized = false;

// Initialize AOS with error handling and refresh capability
function initAOS() {
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                disable: false,
                startEvent: 'DOMContentLoaded',
                initClassName: 'aos-init',
                animatedClassName: 'aos-animate',
                useClassNames: false,
                disableMutationObserver: false,
                debounceDelay: 50,
                throttleDelay: 99,
            });
            aosInitialized = true;
            console.log('AOS initialized successfully');
            
            // Force refresh AOS after a short delay
            setTimeout(() => {
                AOS.refresh();
                console.log('AOS refreshed');
            }, 500);
            
        } catch (error) {
            console.error('AOS initialization failed:', error);
        }
    } else {
        console.warn('AOS library not loaded');
    }
}

// Refresh AOS animations
function refreshAOS() {
    if (typeof AOS !== 'undefined' && aosInitialized) {
        try {
            AOS.refresh();
            console.log('AOS refreshed manually');
        } catch (error) {
            console.error('AOS refresh failed:', error);
        }
    }
}

// Initialize Swiper for trending videos
function initTrendingSwiper() {
    if (typeof Swiper !== 'undefined') {
        try {
            const swiperContainer = document.querySelector('.trendingVideosSwiper');
            if (swiperContainer) {
                const trendingSwiper = new Swiper('.trendingVideosSwiper', {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                    centeredSlides: false,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 2.2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3.2,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 4.2,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 5.2,
                            spaceBetween: 24,
                        }
                    },
                    on: {
                        init: function() {
                            console.log('Swiper initialized successfully');
                            swiperInitialized = true;
                            // Refresh AOS after Swiper is fully initialized
                            setTimeout(() => {
                                refreshAOS();
                            }, 300);
                        },
                        slideChange: function() {
                            // Refresh AOS on slide change to ensure animations work
                            setTimeout(() => {
                                refreshAOS();
                            }, 100);
                        }
                    }
                });
            } else {
                console.warn('Swiper container not found');
            }
        } catch (error) {
            console.error('Swiper initialization failed:', error);
        }
    } else {
        console.warn('Swiper library not loaded');
    }
}

// Setup intersection observer to refresh AOS for elements after videos
function setupAOSRefreshObserver() {
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Refresh AOS when sections come into view
                    setTimeout(() => {
                        refreshAOS();
                    }, 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe sections after the video section
        const sectionsToObserve = [
            '.py-12.lg\\:py-16.bg-gradient-to-br.from-red-50.to-gray-50', // Heritage section
            '#products-section', // Products section
            '.py-12.lg\\:py-16.bg-white:nth-of-type(n+3)' // Other sections after videos
        ];

        sectionsToObserve.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                observer.observe(element);
            }
        });

        // Also observe all elements with AOS attributes after the video section
        const videoSection = document.querySelector('.py-8.lg\\:py-12.bg-white');
        if (videoSection) {
            const allAOSElements = document.querySelectorAll('[data-aos]');
            let foundVideoSection = false;
            
            allAOSElements.forEach(element => {
                if (foundVideoSection || element.closest('.py-8.lg\\:py-12.bg-white') === videoSection) {
                    foundVideoSection = true;
                    if (element.closest('.py-8.lg\\:py-12.bg-white') !== videoSection) {
                        observer.observe(element);
                    }
                }
            });
        }
    }
}

// Force AOS refresh on scroll (throttled)
let scrollTimeout;
function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (aosInitialized) {
            refreshAOS();
        }
    }, 150);
}

// Initialize index page functionality
function initIndexPage() {
    console.log('Initializing index page...');
    
    // Initialize AOS first
    initAOS();
    
    // Initialize Swiper after a small delay
    setTimeout(() => {
        initTrendingSwiper();
    }, 200);
    
    // Setup AOS refresh observer after both are initialized
    setTimeout(() => {
        setupAOSRefreshObserver();
        
        // Add scroll listener for AOS refresh
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Force refresh AOS after everything is loaded
        setTimeout(() => {
            refreshAOS();
        }, 1000);
        
    }, 500);
}

// Reinitialize AOS when window is resized
function handleResize() {
    setTimeout(() => {
        if (aosInitialized) {
            refreshAOS();
        }
    }, 300);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initIndexPage);

// Also initialize when window is loaded (fallback)
window.addEventListener('load', () => {
    console.log('Window loaded, ensuring AOS works...');
    
    setTimeout(() => {
        if (!aosInitialized || !document.querySelector('[data-aos].aos-animate')) {
            console.log('Reinitializing AOS...');
            initAOS();
        } else {
            refreshAOS();
        }
    }, 500);
});

// Handle window resize
window.addEventListener('resize', handleResize);

// Manual refresh function for debugging
window.refreshAOSManually = function() {
    console.log('Manual AOS refresh triggered');
    refreshAOS();
};