document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark', isDark);
        document.documentElement.setAttribute('data-bs-theme', theme);
        console.log('Applied theme:', theme);
    };

    const savedTheme = localStorage.getItem('theme');

    // If there's no saved theme, default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Apply theme and set checkbox state
    applyTheme(initialTheme);
    if (themeToggle) {
        themeToggle.checked = (initialTheme === 'dark');

        // Toggle listener
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    

    // --- Universal Copy Button Logic ---
    window.setupCopyButton = (buttonId, codeElementId) => {
        const copyBtn = document.getElementById(buttonId);
        const codeEl = document.getElementById(codeElementId);

        if (!copyBtn || !codeEl) return;

        copyBtn.addEventListener('click', () => {
            const code = codeEl.textContent || '';
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }).catch((err) => {
                console.error('Failed to copy text:', err);
            });
        });
    };
});
