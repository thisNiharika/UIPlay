document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const previewBox = document.querySelector('.preview-box');
    const cssCodeOutput = document.getElementById('css-code-output');
    const copyCssButton = document.getElementById('copy-css-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Controls
    const controls = {
        borderRadius: document.getElementById('border-radius'),
        shadowX: document.getElementById('box-shadow-x'),
        shadowY: document.getElementById('box-shadow-y'),
        shadowBlur: document.getElementById('box-shadow-blur'),
        shadowColor: document.getElementById('box-shadow-color'),
        blur: document.getElementById('blur'),
        brightness: document.getElementById('brightness'),
        grayscale: document.getElementById('grayscale'),
    };

    // Value Displays
    const values = {
        borderRadius: document.getElementById('border-radius-value'),
        shadowX: document.getElementById('box-shadow-x-value'),
        shadowY: document.getElementById('box-shadow-y-value'),
        shadowBlur: document.getElementById('box-shadow-blur-value'),
        blur: document.getElementById('blur-value'),
        brightness: document.getElementById('brightness-value'),
        grayscale: document.getElementById('grayscale-value'),
    };

    // --- State ---
    const state = {
        borderRadius: 25, shadowX: 10, shadowY: 10,
        shadowBlur: 15, shadowColor: '#000000', blur: 0,
        brightness: 100, grayscale: 0,
    };

    // --- Functions ---
    const updateStyles = () => {
        const { borderRadius, shadowX, shadowY, shadowBlur, shadowColor, blur, brightness, grayscale } = state;
        anime({
            targets: previewBox,
            borderRadius: `${borderRadius}px`,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`,
            filter: `blur(${blur}px) brightness(${brightness}%) grayscale(${grayscale}%)`,
            duration: 300,
            easing: 'easeOutQuad'
        });
        generateCssCode();
    };

    const generateCssCode = () => {
        const { borderRadius, shadowX, shadowY, shadowBlur, shadowColor, blur, brightness, grayscale } = state;
        const css = `.box {\n  border-radius: ${borderRadius}px;\n  box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor};\n  filter: blur(${blur}px) brightness(${brightness}%) grayscale(${grayscale}%);\n}`;
        cssCodeOutput.textContent = css;
    };

    const copyCssToClipboard = () => {
        navigator.clipboard.writeText(cssCodeOutput.textContent).then(() => {
            copyCssButton.textContent = 'Copied!';
            anime({ targets: copyCssButton, scale: [1, 1.1, 1], duration: 300 });
            setTimeout(() => { copyCssButton.textContent = 'Copy CSS'; }, 2000);
        });
    };

    const toggleTheme = () => document.body.classList.toggle('dark-mode');

    // --- Animations ---
    const animateTitle = () => {
        const titleEl = document.querySelector('.ml1 .letters');
        // SAFEGUARD: Check if the element exists before trying to use it
        if (titleEl) {
            titleEl.innerHTML = titleEl.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
            anime.timeline({ loop: false })
                .add({
                    targets: '.ml1 .letters',
                    opacity: [0, 1],
                    easing: "easeOutExpo",
                    duration: 1200,
                })
                .add({
                    targets: '.ml1 .letter',
                    opacity: [0, 1],
                    easing: "easeOutExpo",
                    duration: 800,
                    offset: '-=775',
                    delay: (el, i) => 34 * (i + 1)
                });
        }
    };

    const animatePanelsIn = () => {
        anime({
            targets: '.controls-panel, .preview-code-panel',
            translateY: [40, 0],
            opacity: [0, 1],
            delay: anime.stagger(200, { start: 200 }),
            easing: 'easeOutExpo'
        });
    };

    // --- Event Listeners ---
    for (const key in controls) {
        if (controls[key].type === 'range') {
            controls[key].addEventListener('input', (e) => {
                state[key] = e.target.value;
                values[key].textContent = e.target.value;
                updateStyles();
            });
        } else if (controls[key].type === 'color') {
            controls[key].addEventListener('input', (e) => {
                state[key] = e.target.value;
                updateStyles();
            });
        }
    }
    
    themeToggle.addEventListener('change', toggleTheme);
    copyCssButton.addEventListener('click', copyCssToClipboard);

    // --- Initial Call & Startup ---
    updateStyles();
    animateTitle();
    animatePanelsIn();
});
