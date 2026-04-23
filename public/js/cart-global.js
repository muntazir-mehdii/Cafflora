// Global Add to Cart + success / error toasts (no browser alert()).
(function () {
    if (window.__caffloraCartGlobalInitialized) return;
    window.__caffloraCartGlobalInitialized = true;

    function getToken() {
        return localStorage.getItem('token');
    }

    function setCartCount(count) {
        var el = document.getElementById('cart-count');
        if (!el) return;
        var safe = Number(count) || 0;
        el.textContent = String(safe);
        el.classList.toggle('hidden', safe <= 0);
    }

    async function hydrateCartCount() {
        var token = getToken();
        if (!token) return;
        try {
            var res = await fetch('/api/cart', { headers: { Authorization: 'Bearer ' + token } });
            if (!res.ok) return;
            var data = await res.json();
            setCartCount((data && data.summary && data.summary.total_items) || 0);
        } catch (e) {
            /* ignore */
        }
    }

    function ensureErrorToast() {
        var el = document.getElementById('cart-error-toast');
        if (el) return el;
        el = document.createElement('div');
        el.id = 'cart-error-toast';
        el.setAttribute('role', 'alert');
        el.className =
            'fixed bottom-5 right-5 z-[101] max-w-[min(92vw,22rem)] px-4 py-3 rounded-2xl shadow-lg ' +
            'transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none ' +
            'font-sans text-sm text-white bg-[#ba1a1a]';
        document.body.appendChild(el);
        return el;
    }

    window.showCartErrorToast = function (message) {
        var el = ensureErrorToast();
        el.textContent = String(message || 'Something went wrong.');
        el.classList.remove('translate-y-20', 'opacity-0');
        el.classList.add('translate-y-0', 'opacity-100');
        clearTimeout(el.__hideT);
        el.__hideT = setTimeout(function () {
            el.classList.add('translate-y-20', 'opacity-0');
            el.classList.remove('translate-y-0', 'opacity-100');
        }, 3200);
    };

    window.showCartToast = window.showCartToast || (function () {
        var timeoutId = null;

        function ensureToastStyles(toast) {
            if (!toast) return;
            toast.style.backgroundColor = toast.style.backgroundColor || '#3B2314';
            toast.style.color = toast.style.color || '#FDF9F3';
        }

        return function showCartToast() {
            var toast = document.getElementById('cart-toast');
            if (!toast) return;
            ensureToastStyles(toast);

            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                toast.classList.add('translate-y-20', 'opacity-0');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 3000);
        };
    })();

    /** Single implementation used site-wide */
    window.addToCart = async function addToCart(productId) {
        var token = getToken();
        if (!token) {
            if (typeof window.showCartErrorToast === 'function') {
                window.showCartErrorToast('Please sign in to add items to your cart.');
            }
            setTimeout(function () {
                window.location.href = '/sign-in';
            }, 900);
            throw new Error('Not signed in');
        }

        var res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({ product_id: Number(productId), quantity: 1 })
        });

        var data = await res.json().catch(function () { return {}; });
        if (!res.ok) {
            var errMsg = (data && data.error) || 'Could not add item to cart';
            if (typeof window.showCartErrorToast === 'function') window.showCartErrorToast(errMsg);
            throw new Error(errMsg);
        }

        setCartCount((data && data.cartCount) || 0);
        return data;
    };

    document.body.addEventListener('click', function (e) {
        var cartBtn = e.target.closest('.add-to-cart-btn, .plus-cart-btn, [data-action="add-to-cart"]');
        if (!cartBtn) return;

        e.preventDefault();

        var productId = cartBtn.getAttribute('data-id');
        if (!productId) {
            console.error('Cart button missing data-id attribute');
            if (typeof window.showCartErrorToast === 'function') {
                window.showCartErrorToast('This item cannot be added yet. Please refresh the page.');
            }
            return;
        }

        Promise.resolve()
            .then(function () { return window.addToCart(productId); })
            .then(function () {
                if (typeof window.showCartToast === 'function') window.showCartToast();
                cartBtn.classList.add('scale-110');
                setTimeout(function () { cartBtn.classList.remove('scale-110'); }, 180);
            })
            .catch(function (err) {
                console.error(err);
            });
    });

    async function hydrateMissingDataIds() {
        var candidates = Array.prototype.slice
            .call(document.querySelectorAll('.plus-cart-btn, [data-action="add-to-cart"]'))
            .filter(function (btn) {
                return btn && !btn.getAttribute('data-id');
            });

        if (!candidates.length) return;

        var products = [];
        try {
            var reqs = await Promise.allSettled([
                fetch('/api/products?tag=FEATURED'),
                fetch('/api/products?filter=menu'),
                fetch('/api/products?filter=shop'),
                fetch('/api/products?filter=coffee')
            ]);

            for (var i = 0; i < reqs.length; i++) {
                if (reqs[i].status !== 'fulfilled') continue;
                var res = reqs[i].value;
                if (!res || !res.ok) continue;
                var data = await res.json();
                if (Array.isArray(data)) products = products.concat(data);
            }
        } catch (e) {
            return;
        }

        function norm(s) {
            return String(s || '').trim().toLowerCase();
        }

        function bestMatchByTitle(title) {
            var t = norm(title);
            if (!t) return null;
            var exact = products.find(function (p) { return norm(p.name) === t; });
            if (exact) return exact;
            return products.find(function (p) {
                return norm(p.name).includes(t) || t.includes(norm(p.name));
            }) || null;
        }

        candidates.forEach(function (btn) {
            var titleEl =
                (btn.closest('[data-product-card]') && btn.closest('[data-product-card]').querySelector('h3,h4')) ||
                (btn.closest('.group') && btn.closest('.group').querySelector('h3,h4')) ||
                (btn.parentElement && btn.parentElement.parentElement && btn.parentElement.parentElement.querySelector('h3,h4')) ||
                null;
            var title = titleEl ? titleEl.textContent : '';
            var match = bestMatchByTitle(title);
            if (match && match.product_id) {
                btn.setAttribute('data-id', String(match.product_id));
                btn.classList.add('add-to-cart-btn');
            }
        });
    }

    hydrateCartCount();
    hydrateMissingDataIds();
})();
