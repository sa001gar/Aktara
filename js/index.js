// Custom Trending Videos Slider

let trendingSlider = null;
let trendingSliderAutoplay = null;
let trendingSliderPaused = false;

function getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1280) return 5.2;
    if (width >= 1024) return 4.2;
    if (width >= 768) return 3.2;
    if (width >= 640) return 2.2;
    return 1.2;
}

function initTrendingSlider() {
    const container = document.querySelector('.trendingVideosSwiper');
    if (!container) return;

    const wrapper = container.querySelector('.swiper-wrapper') || container.children[0];
    if (!wrapper) return;

    const slides = Array.from(wrapper.children);
    if (slides.length === 0) return;

    // Remove any previous clones
    slides.forEach(slide => slide.classList.remove('is-clone'));

    // Clone slides for looping
    const clonesBefore = [];
    const clonesAfter = [];
    const slidesPerView = Math.ceil(getSlidesPerView());
    for (let i = 0; i < slidesPerView; i++) {
        const cloneBefore = slides[slides.length - 1 - i].cloneNode(true);
        cloneBefore.classList.add('is-clone');
        clonesBefore.unshift(cloneBefore);

        const cloneAfter = slides[i].cloneNode(true);
        cloneAfter.classList.add('is-clone');
        clonesAfter.push(cloneAfter);
    }
    clonesBefore.forEach(clone => wrapper.insertBefore(clone, wrapper.firstChild));
    clonesAfter.forEach(clone => wrapper.appendChild(clone));

    // Set wrapper style
    wrapper.style.display = 'flex';
    wrapper.style.transition = 'transform 0.5s';
    wrapper.style.willChange = 'transform';

    // Set slide style
    const setSlideStyles = () => {
        const spv = getSlidesPerView();
        const slideWidth = 100 / spv;
        Array.from(wrapper.children).forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.marginRight = '16px';
        });
        if (window.innerWidth >= 640) wrapper.style.gap = '20px';
        if (window.innerWidth >= 768) wrapper.style.gap = '24px';
        if (window.innerWidth >= 1024) wrapper.style.gap = '24px';
        if (window.innerWidth >= 1280) wrapper.style.gap = '24px';
    };

    setSlideStyles();

    // State
    let currentIndex = slidesPerView;
    let totalSlides = slides.length;
    let slideCount = wrapper.children.length;

    // Move to slide
    function goTo(index, animate = true) {
        const spv = getSlidesPerView();
        const slideWidth = wrapper.children[0].offsetWidth + parseInt(getComputedStyle(wrapper).gap || 16);
        wrapper.style.transition = animate ? 'transform 0.5s' : 'none';
        wrapper.style.transform = `translateX(-${index * slideWidth}px)`;
        currentIndex = index;
    }

    // Next/Prev
    function nextSlide() {
        if (trendingSliderPaused) return;
        goTo(currentIndex + 1);
        if (currentIndex === totalSlides + slidesPerView) {
            setTimeout(() => {
                goTo(slidesPerView, false);
            }, 500);
        }
    }
    function prevSlide() {
        goTo(currentIndex - 1);
        if (currentIndex === 0) {
            setTimeout(() => {
                goTo(totalSlides, false);
            }, 500);
        }
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        trendingSliderAutoplay = setInterval(nextSlide, 3000);
    }
    function stopAutoplay() {
        if (trendingSliderAutoplay) clearInterval(trendingSliderAutoplay);
    }

    // Pause on interaction
    wrapper.addEventListener('mouseenter', () => {
        trendingSliderPaused = true;
        stopAutoplay();
    });
    wrapper.addEventListener('mouseleave', () => {
        trendingSliderPaused = false;
        startAutoplay();
    });

    // Responsive
    window.addEventListener('resize', () => {
        setSlideStyles();
        goTo(currentIndex, false);
    });

    // Init
    goTo(currentIndex, false);
    startAutoplay();

    // Expose for fallback
    trendingSlider = {
        next: nextSlide,
        prev: prevSlide,
        goTo,
        destroy: () => {
            stopAutoplay();
            // Remove clones
            Array.from(wrapper.querySelectorAll('.is-clone')).forEach(clone => clone.remove());
            wrapper.style.transform = '';
            wrapper.style.transition = '';
        }
    };
}

// Init on DOMContentLoaded and window load
document.addEventListener('DOMContentLoaded', initTrendingSlider);
window.addEventListener('load', () => {
    if (!trendingSlider) initTrendingSlider();
});
