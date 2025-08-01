document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const controls = {
        colorPicker: document.getElementById('color-picker'),
        colorHex: document.getElementById('color-hex'),
        resetBtn: document.getElementById('reset-btn'),
        size: document.getElementById('size'),
        radius: document.getElementById('radius'),
        distance: document.getElementById('distance'),
        intensity: document.getElementById('intensity'),
        blur: document.getElementById('blur'),
        shapeSelector: document.getElementById('shape-selector'),
        shapeIndicator: document.getElementById('shape-indicator')
    };

    const tooltips = {
        size: document.getElementById('size-tooltip'),
        radius: document.getElementById('radius-tooltip'),
        distance: document.getElementById('distance-tooltip'),
        intensity: document.getElementById('intensity-tooltip'),
        blur: document.getElementById('blur-tooltip')
    };

    const previewElement = document.getElementById('preview-element');
    const codeOutput = document.getElementById('code-output');

    // --- HELPER FUNCTIONS ---
    const hexToHsl = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return { h: 0, s: 0, l: 0 };
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h, s, l };
    };

    const hslToHex = (h, s, l) => {
        let r, g, b;
        if (s === 0) { r = g = b = l; } 
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // --- CORE LOGIC ---
    function updateNeumorphism() {
        const size = controls.size.value;
        const radius = controls.radius.value;
        const distance = controls.distance.value;
        const intensity = parseFloat(controls.intensity.value);
        const blur = controls.blur.value;
        const baseColor = controls.colorPicker.value;
        const activeShape = controls.shapeSelector.querySelector('.active').dataset.shape;
        
        const { h, s, l } = hexToHsl(baseColor);
        const lightShadowColor = hslToHex(h, s, Math.min(1, l + intensity));
        const darkShadowColor = hslToHex(h, s, Math.max(0, l - intensity));
        
        document.documentElement.style.setProperty('--neumo-bg', baseColor);
        
        let boxShadowValue, backgroundValue;

        switch (activeShape) {
            case 'concave':
                boxShadowValue = `inset ${distance}px ${distance}px ${blur}px ${darkShadowColor}, inset -${distance}px -${distance}px ${blur}px ${lightShadowColor}`;
                backgroundValue = baseColor;
                break;
            case 'convex':
                boxShadowValue = `${distance}px ${distance}px ${blur}px ${darkShadowColor}, -${distance}px -${distance}px ${blur}px ${lightShadowColor}`;
                backgroundValue = `linear-gradient(145deg, ${lightShadowColor}, ${darkShadowColor})`;
                break;
            case 'pressed':
                 boxShadowValue = `inset ${distance}px ${distance}px ${blur}px ${darkShadowColor}, inset -${distance}px -${distance}px ${blur}px ${lightShadowColor}`;
                 backgroundValue = `linear-gradient(145deg, ${darkShadowColor}, ${lightShadowColor})`;
                break;
            case 'flat':
            default:
                boxShadowValue = `${distance}px ${distance}px ${blur}px ${darkShadowColor}, -${distance}px -${distance}px ${blur}px ${lightShadowColor}`;
                backgroundValue = baseColor;
                break;
        }

        previewElement.style.width = `${size}px`;
        previewElement.style.height = `${size}px`;
        previewElement.style.borderRadius = `${radius}px`;
        previewElement.style.background = backgroundValue;
        previewElement.style.boxShadow = boxShadowValue;

        codeOutput.textContent = `border-radius: ${radius}px;\nbackground: ${backgroundValue};\nbox-shadow: ${boxShadowValue};`;
    }

    // --- EVENT LISTENERS & TOOLTIPS ---
    ['size', 'radius', 'distance', 'intensity', 'blur'].forEach(prop => {
        const slider = controls[prop];
        const tooltip = tooltips[prop];
        if (slider && tooltip) {
            slider.addEventListener('input', () => {
                tooltip.textContent = `${slider.value}${prop === 'intensity' ? '' : 'px'}`;
                const percent = (slider.value - slider.min) / (slider.max - slider.min);
                const thumbWidth = 20;
                const offset = (percent * (slider.offsetWidth - thumbWidth)) + (thumbWidth / 2);
                tooltip.style.left = `${offset}px`;
                updateNeumorphism();
            });
             // Initial update
            tooltip.textContent = `${slider.value}${prop === 'intensity' ? '' : 'px'}`;
        }
    });

    controls.colorPicker.addEventListener('input', () => {
        controls.colorHex.value = controls.colorPicker.value;
        updateNeumorphism();
    });
    
    controls.colorHex.addEventListener('input', () => {
        controls.colorPicker.value = controls.colorHex.value;
        updateNeumorphism();
    });

    controls.shapeSelector.addEventListener('click', (e) => {
        const target = e.target.closest('.shape-btn');
        if (target) {
            controls.shapeSelector.querySelector('.active').classList.remove('active');
            target.classList.add('active');
            const shapeIndex = Array.from(target.parentElement.children).indexOf(target) -1;
            controls.shapeIndicator.style.transform = `translateX(${shapeIndex * 100}%)`;
            updateNeumorphism();
        }
    });
    
    controls.resetBtn.addEventListener('click', () => {
        controls.colorPicker.value = '#d94242';
        controls.colorHex.value = '#d94242';
        controls.size.value = 200;
        controls.radius.value = 50;
        controls.distance.value = 20;
        controls.intensity.value = 0.15;
        controls.blur.value = 40;
        // manually trigger input event to update tooltips and preview
        Object.values(controls).forEach(c => c.dispatchEvent(new Event('input')));
    });
    
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeOutput.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = originalText }, 2000);
        });
    });

    // --- INITIALIZATION ---
    updateNeumorphism();

});