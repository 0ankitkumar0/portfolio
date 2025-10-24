document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        const toggleMenu = (forceClose = false) => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (forceClose && !isHidden) {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                return;
            }
            mobileMenu.classList.toggle('hidden');
            const expanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            menuBtn.setAttribute('aria-expanded', expanded);
        };

        menuBtn.addEventListener('click', () => toggleMenu());

        // Close menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => toggleMenu(true));
        });

        // Close menu on resize to md and above
        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 768px)').matches) {
                toggleMenu(true);
            }
        });
    }

    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Full-Stack Developer", "Graphics Designer", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (!typedTextSpan) {
            return;
        }

        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (!typedTextSpan) {
            return;
        }

        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) {
                textArrayIndex = 0;
            }
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (typedTextSpan && textArray.length) {
        setTimeout(type, newTextDelay + 250);
    }

    const sections = document.querySelectorAll('.fade-in-section');
    if (!sections.length) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});
