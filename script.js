document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.querySelector('header');
    const themeToggle = document.getElementById('theme-toggle');
    const heroTitle = document.querySelector('.hero-title');
    const heroShapes = document.querySelectorAll('.hero-visual .shape');
    const utilityCards = document.querySelectorAll('.utility-card');

    // --- Header Scroll Effect ---
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // --- Theme Switcher ---
    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    };

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', toggleTheme);
    
    // --- Animations ---
    // 1. Hero Content Entrance Animation
    if (heroTitle) {
        heroTitle.innerHTML = heroTitle.textContent.replace(/(\S*)/g, m => `<span class="word">${m.replace(/./g, "<span class='letter'>$&</span>")}</span>`);
        
        anime.timeline({ loop: false })
            .add({
                targets: '.hero-title .letter',
                translateY: [100, 0], translateZ: 0, opacity: [0, 1],
                easing: "easeOutExpo", duration: 1400, delay: (el, i) => 300 + 30 * i
            }).add({
                targets: ['.hero-subtitle', '.hero-cta'],
                translateY: [50, 0], opacity: [0, 1],
                easing: 'easeOutExpo', duration: 1200, offset: '-=1000'
            });
    }

    // 2. Hero Background Shape Animation
    anime({
        targets: heroShapes,
        translateX: () => anime.random(-50, 50), translateY: () => anime.random(-50, 50),
        scale: () => anime.random(0.8, 1.2), rotate: () => anime.random(0, 360),
        duration: 20000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
    });

    // 3. Staggered Card Animation on Scroll
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target.querySelectorAll('.utility-card'),
                    translateY: [50, 0], opacity: [0, 1],
                    delay: anime.stagger(150), easing: 'easeOutExpo', duration: 1000
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (utilityCards.length > 0) {
        cardObserver.observe(document.querySelector('.utilities-grid'));
    }

    // 4. Smooth scroll for CTA
    const cta = document.querySelector('.hero-cta');
    if (cta) {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(cta.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    }
});