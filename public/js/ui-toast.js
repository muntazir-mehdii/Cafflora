// Lightweight app-wide toast (no dependency on cart-global).
(function () {
    if (window.__caffloraUiToastInitialized) return;
    window.__caffloraUiToastInitialized = true;

    function ensureToast() {
        var el = document.getElementById('app-toast');
        if (el) return el;
        el = document.createElement('div');
        el.id = 'app-toast';
        el.setAttribute('role', 'status');
        el.className =
            'fixed bottom-5 left-1/2 -translate-x-1/2 z-[110] max-w-[90vw] px-5 py-3 rounded-full shadow-lg ' +
            'transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none ' +
            'font-sans text-sm text-on-primary';
        el.style.backgroundColor = '#78555d';
        document.body.appendChild(el);
        return el;
    }

    window.showAppToast = function (message, variant) {
        var el = ensureToast();
        el.textContent = String(message || '');
        if (variant === 'error') {
            el.style.backgroundColor = '#ba1a1a';
            el.style.color = '#ffffff';
        } else {
            el.style.backgroundColor = '#78555d';
            el.style.color = '#ffffff';
        }
        el.classList.remove('translate-y-20', 'opacity-0');
        el.classList.add('translate-y-0', 'opacity-100');
        clearTimeout(el.__hideT);
        el.__hideT = setTimeout(function () {
            el.classList.add('translate-y-20', 'opacity-0');
            el.classList.remove('translate-y-0', 'opacity-100');
        }, 3200);
    };
})();
