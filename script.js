/* 
    PREMIUM DENTAL CLINIC - INTERACTIVE LOGIC
    Revamped for Melbourne Road Dental
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE MENU TOGGLE
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });
    }

    // 2. STICKY HEADER
    const headerWrapper = document.querySelector('.main-header-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            headerWrapper.classList.add('sticky');
        } else {
            headerWrapper.classList.remove('sticky');
        }
    });

    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // 4. TESTIMONIAL SLIDER LOGIC
    const testimonialSlider = () => {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        let currentIndex = 0;
        let slideInterval;

        if (!slides.length) return;

        // Clear and Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (dots[index]) dots[index].classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                    if (dots[index]) dots[index].classList.add('active');
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetInterval();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        }

        const container = document.querySelector('.testimonial-container');
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(slideInterval));
            container.addEventListener('mouseleave', resetInterval);
            container.addEventListener('touchstart', () => clearInterval(slideInterval), { passive: true });
            container.addEventListener('touchend', resetInterval, { passive: true });
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        resetInterval();
    };

    // 4b. GALLERY SLIDER LOGIC (8 Cards Auto-Scroll)
    // Initialize Comparison Tool for sliders
    const initComparisonTools = () => {
        const comparisonSliders = document.querySelectorAll('.comparison-container');
        comparisonSliders.forEach(slider => {
            // Remove existing listeners to avoid duplicates if re-initing
            const newSlider = slider.cloneNode(true);
            slider.parentNode.replaceChild(newSlider, slider);

            const before = newSlider.querySelector('.comparison-before');
            const handle = newSlider.querySelector('.slider-handle');
            let isMoving = false;

            const setPosition = (x) => {
                const rect = newSlider.getBoundingClientRect();
                let position = ((x - rect.left) / rect.width) * 100;
                position = Math.max(0, Math.min(100, position));

                before.style.width = `${position}%`;
                handle.style.left = `${position}%`;
            };

            const onMove = (e) => {
                if (!isMoving) return;
                const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                setPosition(x);
            };

            const onStart = (e) => {
                isMoving = true;
                e.stopPropagation();
            };

            const onEnd = () => {
                isMoving = false;
            };

            newSlider.addEventListener('mousedown', onStart);
            newSlider.addEventListener('touchstart', onStart, { passive: true });
            window.addEventListener('mousemove', onMove);
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchend', onEnd);

            // Set initial 50/50 comparison
            before.style.width = '50%';
            handle.style.left = '50%';
        });
    };

    // 4b. GALLERY SLIDER LOGIC (Infinite Seamless Loop)
    const gallerySlider = () => {
        const track = document.getElementById('galleryTrack');
        const originalSlides = document.querySelectorAll('.gallery-slide');
        const nextBtn = document.getElementById('galleryNext');
        const prevBtn = document.getElementById('galleryPrev');
        const dotsContainer = document.getElementById('galleryDots');

        if (!track || !originalSlides.length) return;

        const buffer = 4; // Slides to clone on each side for safety
        let currentIndex = buffer;
        let isTransitioning = false;
        let autoScrollInterval;

        // 1. CLONING FOR INFINITY
        const firstClones = [];
        const lastClones = [];

        // Clone first few slides and append
        for (let i = 0; i < buffer; i++) {
            firstClones.push(originalSlides[i].cloneNode(true));
        }
        // Clone last few slides and prepend
        for (let i = originalSlides.length - 1; i >= originalSlides.length - buffer; i--) {
            lastClones.push(originalSlides[i].cloneNode(true));
        }

        firstClones.forEach(clone => track.appendChild(clone));
        lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));

        // 2. CREATE DOTS (Sync with original length)
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            originalSlides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('gallery-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i + buffer;
                    updateSlider(true);
                    resetAutoScroll();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const dots = document.querySelectorAll('.gallery-dot');

        function updateSlider(animate = true) {
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const slideWidth = originalSlides[0].offsetWidth + gap;
            track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Sync dots - calculate real index from current position
            const realIndex = (currentIndex - buffer + originalSlides.length) % originalSlides.length;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === realIndex);
            });
        }

        function handleTransitionEnd() {
            isTransitioning = false;
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            const slideWidth = originalSlides[0].offsetWidth + gap;

            // Boundary snapping for infinite illusion
            if (currentIndex >= originalSlides.length + buffer) {
                currentIndex = buffer;
                track.style.transition = 'none';
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            } else if (currentIndex < buffer) {
                currentIndex = originalSlides.length + buffer - 1;
                track.style.transition = 'none';
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
        }

        function nextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateSlider(true);
        }

        function prevSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateSlider(true);
        }

        function resetAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(nextSlide, 3500);
        }

        track.addEventListener('transitionend', handleTransitionEnd);
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoScroll(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoScroll(); });

        const viewport = document.querySelector('.gallery-slider-viewport');
        if (viewport) {
            viewport.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
            viewport.addEventListener('mouseleave', resetAutoScroll);
            viewport.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });
            viewport.addEventListener('touchend', resetAutoScroll, { passive: true });
        }

        window.addEventListener('resize', () => updateSlider(false));

        updateSlider(false);
        resetAutoScroll();

        // Re-initialize comparison tools for all slides (including clones)
        initComparisonTools();
    };

    testimonialSlider();
    gallerySlider();

    // 6. SMOOTH SCROLL FOR ANCHORS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 100;
                const elementOffset = target.offsetTop - headerOffset;

                window.scrollTo({
                    top: elementOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. FORM HANDLING
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
                btn.style.background = '#22c55e';
                alert('Thank you! Your appointment request has been sent. Our team will contact you shortly.');
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

});
