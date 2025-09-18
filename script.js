// Smooth scroll for internal nav links
(function () {
	function onLinkClick(event) {
		const href = this.getAttribute('href');
		if (href && href.startsWith('#')) {
			event.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}

	document.querySelectorAll('a[href^="#"]').forEach(function (link) {
		link.addEventListener('click', onLinkClick);
	});
})();

// Estimate modal open/close and submit
(function () {
    const openBtns = document.querySelectorAll('[data-open-estimate]');
    const modal = document.getElementById('estimateModal');
    if (!modal || openBtns.length === 0) return;
    const closeEls = modal.querySelectorAll('[data-close-estimate]');
    const form = document.getElementById('estimateForm');

    function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); }); });
    closeEls.forEach(function (el) { el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = new FormData(form);
            const params = new URLSearchParams();
            data.forEach((v, k) => params.append(k, v.toString()));
            // Simple mailto fallback; replace with backend/API if available
            const mailto = 'mailto:abdulgaffarsajeeb@gmail.com?subject=' + encodeURIComponent('Cost Estimate Request') + '&body=' + encodeURIComponent(params.toString());
            window.location.href = mailto;
            closeModal();
        });
    }
})();

// Mobile nav toggle
(function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    const STORAGE_KEY = 'navOpen';
    // Restore nav state
    const wasOpen = sessionStorage.getItem(STORAGE_KEY) === '1';
    if (wasOpen) {
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }
    function setOpen(isOpen) {
        menu.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        try { sessionStorage.setItem(STORAGE_KEY, isOpen ? '1' : '0'); } catch (_) {}
    }
    function closeMenu() { setOpen(false); }
    toggle.addEventListener('click', function () {
        const isOpen = !menu.classList.contains('open');
        setOpen(isOpen);
    });
    // Close menu after clicking a link (on mobile)
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();

// Reveal on scroll using IntersectionObserver
(function () {
	const revealEls = document.querySelectorAll('.reveal');
	if (!('IntersectionObserver' in window) || revealEls.length === 0) {
		revealEls.forEach(function (el) { el.classList.add('visible'); });
		return;
	}
	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });
	revealEls.forEach(function (el) { observer.observe(el); });
})();

// Highlight active section nav link on scroll
(function () {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('#navMenu a[href^="#"]');
    if (sections.length === 0 || links.length === 0) return;
    const linkMap = new Map();
    links.forEach(function (l) { linkMap.set(l.getAttribute('href').slice(1), l); });
    function setActive(id) {
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
    }
    const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) setActive(e.target.id);
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
    sections.forEach(function (s) { obs.observe(s); });
})();

// Dynamic year in footer
(function () {
	var yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
})();
