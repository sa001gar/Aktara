// Index page specific functionality

let swiperInitialized = false;

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

// Initialize index page functionality
function initIndexPage() {
    console.log('Initializing index page...');
    
    // Initialize Swiper
    initTrendingSwiper();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initIndexPage);

// Also initialize when window is loaded (fallback)
window.addEventListener('load', () => {
    console.log('Window loaded, ensuring functionality...');
    
    if (!swiperInitialized) {
        console.log('Reinitializing Swiper...');
        initTrendingSwiper();
    }
});
