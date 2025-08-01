document.addEventListener('DOMContentLoaded', () => {

    // --- Data: 150 Animations organized into 5 categories ---
    const animationLibrary = {
        "Attention Seekers": ["bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing", "tada", "wobble", "jello", "heartBeat", "hinge", "jackInTheBox", "lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "bounceIn", "bounceInDown"],
        "Entrances": ["backInDown", "backInLeft", "backInRight", "backInUp", "bounceInUp", "bounceInLeft", "bounceInRight", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeInTopLeft", "fadeInTopRight", "fadeInBottomLeft", "fadeInBottomRight", "flipInX", "flipInY", "lightSpeedInRight", "lightSpeedInLeft", "rollIn", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"],
        "Exits": ["backOutDown", "backOutLeft", "backOutRight", "backOutUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "fadeOutTopLeft", "fadeOutTopRight", "fadeOutBottomRight", "fadeOutBottomLeft", "flipOutX", "flipOutY", "lightSpeedOutRight", "lightSpeedOutLeft", "rollOut", "zoomOut", "zoomOutDown", "zoomOutLeft"],
        "Flippers": ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "swing", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp", "rollIn", "rollOut", "zoomIn", "zoomOut", "bounce", "flash"],
        "Specials": ["hinge", "jackInTheBox", "rollIn", "rollOut", "lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft", "heartBeat", "tada", "wobble", "jello", "backInDown", "backInLeft", "backInRight", "backInUp", "backOutDown", "backOutLeft", "backOutRight", "backOutUp", "bounceIn", "bounceOut", "fadeIn", "fadeOut", "flip", "rotateIn", "rotateOut", "slideInUp", "slideOutUp", "zoomIn"]
    };

    // --- DOM Element References ---
    const accordionContainer = document.getElementById('animation-accordion');
    const animationTarget = document.getElementById('animation-target');
    const previewTitle = document.getElementById('preview-title');
    const codeOutput = document.getElementById('code-output');
    const copyBtn = document.getElementById('copy-btn');
    
    // Controls
    const durationSlider = document.getElementById('duration-slider');
    const delaySlider = document.getElementById('delay-slider');
    const iterationControl = document.getElementById('iteration-control');
    const directionControl = document.getElementById('direction-control');
    const timingSelect = document.getElementById('timing-select');
    
    const durationVal = document.getElementById('duration-val');
    const delayVal = document.getElementById('delay-val');

    let currentAnimation = '';
    // Store previous animation class to remove it efficiently
    let lastAnimationClass = '';

    // --- Function to build the accordion menu ---
    function buildAccordion() {
        let accordionHTML = '';
        Object.keys(animationLibrary).forEach((category, index) => {
            const collapseId = `collapse-${index}`;
            const headingId = `heading-${index}`;
            
            // **FIX:** All accordions are now collapsed by default.
            // Removed the `show` class and set `aria-expanded` to `false`.
            accordionHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${headingId}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                            ${category}
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#animation-accordion">
                        <div class="accordion-body">
                            ${animationLibrary[category].map(anim => `<button class="animation-btn" data-animation="${anim}">${anim}</button>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        accordionContainer.innerHTML = accordionHTML;
    }

    // --- **FIXED:** Core function to apply animation and update code ---
    function applyAnimation() {
        if (!currentAnimation) return;

        const duration = durationSlider.value;
        const delay = delaySlider.value;
        const iterationValue = document.querySelector('input[name="iteration"]:checked').value;
        const direction = document.querySelector('input[name="direction"]:checked').value;
        const timing = timingSelect.value;
        
        durationVal.textContent = `${parseFloat(duration).toFixed(1)}s`;
        delayVal.textContent = `${parseFloat(delay).toFixed(1)}s`;
        
        // --- Robust Animation Logic ---
        // 1. Remove the previous animation class if it exists
        if (lastAnimationClass) {
            animationTarget.classList.remove(lastAnimationClass);
        }
        animationTarget.classList.remove('animate__animated');

        // 2. Set Animate.css variables and other style properties
        animationTarget.style.setProperty('--animate-duration', `${duration}s`);
        animationTarget.style.setProperty('--animate-delay', `${delay}s`);
        // For 'infinite', Animate.css uses '--animate-repeat'
        if(iterationValue === 'infinite'){
            animationTarget.style.setProperty('--animate-repeat', 'infinite');
            // Unset the standard property to avoid conflicts
            animationTarget.style.animationIterationCount = '';
        } else {
            animationTarget.style.setProperty('--animate-repeat', '5'); // Default repeat
            animationTarget.style.animationIterationCount = iterationValue;
        }

        animationTarget.style.animationDirection = direction;
        animationTarget.style.animationTimingFunction = timing;

        // 3. Force a DOM reflow to re-trigger the animation
        void animationTarget.offsetWidth;

        // 4. Add the classes back to start the new animation
        const newAnimationClass = `animate__${currentAnimation}`;
        animationTarget.classList.add('animate__animated', newAnimationClass);
        lastAnimationClass = newAnimationClass; // Remember for next time

        previewTitle.textContent = `Preview: ${currentAnimation}`;
        
        // 5. Generate and update the CSS code output
        const cssCode = 
`.your-element {
  animation-name: ${currentAnimation};
  animation-duration: ${duration}s;
  animation-timing-function: ${timing};
  animation-delay: ${delay}s;
  animation-iteration-count: ${iterationValue};
  animation-direction: ${direction};
  animation-fill-mode: forwards; /* Keeps the element in its final state */
}`;
        codeOutput.textContent = cssCode.trim();
    }

    // --- Event Listeners ---
    accordionContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('animation-btn')) {
            currentAnimation = e.target.dataset.animation;
            
            document.querySelectorAll('.animation-btn.active').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            applyAnimation();
        }
    });

    [durationSlider, delaySlider, timingSelect].forEach(el => el.addEventListener('input', applyAnimation));
    [iterationControl, directionControl].forEach(el => el.addEventListener('change', applyAnimation));

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeOutput.textContent).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy CSS'; }, 1500);
        });
    });

    // --- Initial setup ---
    buildAccordion();
});