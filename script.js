document.addEventListener('DOMContentLoaded', () => {

    // 1. Lenis smooth scroll
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    } catch(e) { /* fallback to native scroll */ }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(this.getAttribute('href'));
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. Header hide/show on scroll
    const header = document.querySelector('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const cur = window.pageYOffset;
        if (cur <= 0) { header.classList.remove('scroll-up'); lastScroll = cur; return; }
        if (cur > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (cur < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = cur;
    }, { passive: true });

    // 3. Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    function closeMenu() {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                navLinks.classList.add('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 4. Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section-title, .timeline-item, .card, .about-content, .skills-wrapper, .contact-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // 5. Typing effect
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const phrases = ['Developer', 'Designer UI/UX', 'Programmer', 'Tech Enthusiast'];
        let pi = 0, ci = 0, del = false, spd = 100;

        function type() {
            const p = phrases[pi];
            typingEl.textContent = del ? p.substring(0, ci - 1) : p.substring(0, ci + 1);
            del ? ci-- : ci++;
            spd = del ? 50 : 100;
            if (!del && ci === p.length) { del = true; spd = 2000; }
            else if (del && ci === 0)   { del = false; pi = (pi + 1) % phrases.length; spd = 500; }
            setTimeout(type, spd);
        }
        setTimeout(type, 1000);
    }

    // 6. 3D tilt for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r  = card.getBoundingClientRect();
            const rX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
            const rY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
            card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
