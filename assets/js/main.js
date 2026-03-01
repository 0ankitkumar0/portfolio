document.addEventListener('DOMContentLoaded', () => {
    /* ─── Mobile menu toggle with hamburger animation ─── */
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        // Remove the Tailwind "hidden" class so CSS max-height transition can work
        mobileMenu.classList.remove('hidden');

        const openMenu = () => {
            mobileMenu.classList.add('menu-open');
            menuBtn.classList.add('menu-active');
            menuBtn.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('menu-open');
            menuBtn.classList.remove('menu-active');
            menuBtn.setAttribute('aria-expanded', 'false');
        };

        menuBtn.addEventListener('click', () => {
            if (mobileMenu.classList.contains('menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => closeMenu());
        });

        // Close on outside tap
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close when resized to desktop
        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 768px)').matches) {
                closeMenu();
            }
        });
    }

    /* ─── Typed text animation ─── */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Full-Stack Developer", "Graphics Designer", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (!typedTextSpan) return;
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (!typedTextSpan) return;
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan && textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }

    /* ─── Intersection Observer — fade-in sections ─── */
    const sections = document.querySelectorAll('.fade-in-section');
    if (sections.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    }

    /* ─── Active nav link highlighting on scroll ─── */
    const navSections = document.querySelectorAll('section[id]');
    const desktopLinks = document.querySelectorAll('header nav:not(#mobile-menu) a[href^="#"]');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a[href^="#"]') : [];

    function highlightNav() {
        const scrollY = window.scrollY + 120;
        navSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const isActive = scrollY >= top && scrollY < top + height;

            desktopLinks.forEach(link => {
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.toggle('nav-active', isActive);
                }
            });
            mobileLinks.forEach(link => {
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.toggle('nav-active', isActive);
                }
            });
        });
    }

    if (navSections.length) {
        window.addEventListener('scroll', highlightNav, { passive: true });
        highlightNav();
    }

    /* ─── Scroll-to-top button ─── */
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─── Ripple effect on cards and buttons ─── */
    function addRipple(e, el) {
        const rect = el.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x - size / 2 + 'px';
        ripple.style.top = y - size / 2 + 'px';

        el.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('ripple-container');
        card.addEventListener('touchstart', (e) => addRipple(e, card), { passive: true });
    });

    document.querySelectorAll('.glowing-btn').forEach(btn => {
        btn.classList.add('ripple-container');
        btn.addEventListener('touchstart', (e) => addRipple(e, btn), { passive: true });
    });

    /* ─── Swipe down to close mobile menu ─── */
    if (mobileMenu) {
        let touchStartY = 0;
        mobileMenu.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        mobileMenu.addEventListener('touchmove', (e) => {
            const deltaY = touchStartY - e.touches[0].clientY;
            if (deltaY > 50) {
                mobileMenu.classList.remove('menu-open');
                menuBtn.classList.remove('menu-active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        }, { passive: true });
    }

    /* ─── Image lightbox for project & certificate images ─── */
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        // Make card images and certificate images tappable
        document.querySelectorAll('.card img, article figure img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.setAttribute('role', 'button');
            img.setAttribute('tabindex', '0');

            const openLightbox = () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            };

            img.addEventListener('click', openLightbox);
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') openLightbox();
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        // Swipe down to close lightbox
        let lbTouchStartY = 0;
        lightbox.addEventListener('touchstart', (e) => {
            lbTouchStartY = e.touches[0].clientY;
        }, { passive: true });

        lightbox.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - lbTouchStartY;
            if (deltaY > 80) closeLightbox();
        }, { passive: true });
    }

    /* ─── Tilt effect on skill cards (gyroscope/touch) ─── */
    const skillCards = document.querySelectorAll('#skills .card');
    if (skillCards.length && window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const tiltX = Math.min(Math.max(e.gamma / 45, -1), 1) * 8;
            const tiltY = Math.min(Math.max(e.beta / 45, -1), 1) * 8;
            skillCards.forEach(card => {
                card.style.transform = `perspective(600px) rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
            });
        }, { passive: true });
    }

    /* ─── Haptic feedback (Vibration API if available) ─── */
    if (navigator.vibrate) {
        document.querySelectorAll('.glowing-btn, .scroll-top-btn').forEach(el => {
            el.addEventListener('touchstart', () => navigator.vibrate(10), { passive: true });
        });
    }
});
