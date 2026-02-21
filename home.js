/* ================================================================
   HOME.JS — IPFAV
   Módulos: Lucide, Navbar, Carrossel, Modal de Evento, Modal de Login
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Inicializa ícones Lucide ──────────────────────────────────
    lucide.createIcons();


    // ════════════════════════════════════════════════════════════
    // NAVBAR — escurece ao rolar
    // ════════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });


    // ════════════════════════════════════════════════════════════
    // MODAL HELPER — abre e fecha qualquer modal pelo ID
    // ════════════════════════════════════════════════════════════
    function openModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('open');
        el.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('open');
        el.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Fecha ao clicar no overlay (fora do box)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Fecha com ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
        }
    });


    // ════════════════════════════════════════════════════════════
    // MODAL DE LOGIN
    // ════════════════════════════════════════════════════════════
    const btnOpenLogin = document.getElementById('btnOpenLogin');
    const loginClose = document.getElementById('loginModalClose');

    btnOpenLogin?.addEventListener('click', () => openModal('loginModal'));
    loginClose?.addEventListener('click', () => closeModal('loginModal'));

    document.getElementById('loginForm')?.addEventListener('submit', e => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica real de autenticação
        console.log('Login submetido');
    });

    // ════════════════════════════════════════════════════════════
    // CARROSSEL
    // ════════════════════════════════════════════════════════════
    const track = document.getElementById('carouselTrack');
    const viewport = document.getElementById('carouselViewport');
    const btnPrev = document.getElementById('carouselPrev');
    const btnNext = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');

    if (!track || !viewport) return;

    // ── Quantos slides cabem visíveis ao mesmo tempo
    function getSlidesPerView() {
        const vw = viewport.offsetWidth;
        if (vw < 640) return 1;
        if (vw < 960) return 2;
        return 3;
    }

    const slides = Array.from(track.querySelectorAll('.event-slide'));
    const totalSlides = slides.length;
    let currentIndex = 0;
    let perView = getSlidesPerView();

    // ── Cria os dots dinamicamente
    function buildDots() {
        dotsWrap.innerHTML = '';
        const totalDots = totalSlides - perView + 1;
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }
    }

    // ── Atualiza a posição do track
    function updateCarousel(animate = true) {
        perView = getSlidesPerView();

        const gap = 20; // px — deve bater com o gap do CSS (1.25rem ≈ 20px)
        const slideW = slides[0]?.offsetWidth ?? 0;
        const offset = currentIndex * (slideW + gap);

        track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
        track.style.transform = `translateX(-${offset}px)`;

        // Botões
        const maxIndex = Math.max(0, totalSlides - perView);
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex >= maxIndex;

        // Dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goTo(index) {
        const maxIndex = Math.max(0, totalSlides - perView);
        currentIndex = Math.min(Math.max(index, 0), maxIndex);
        updateCarousel();
    }

    btnPrev?.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext?.addEventListener('click', () => goTo(currentIndex + 1));

    // ── Suporte a swipe/touch no mobile
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) > 40) {
            delta > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        }
    }, { passive: true });

    // ── Recalcula ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            perView = getSlidesPerView();
            buildDots();
            // Garante que o índice não fique fora do novo máximo
            const maxIndex = Math.max(0, totalSlides - perView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel(false);
        }, 150);
    });

    async function searchEvent() {
        try {
            const res = await fetch('https://estante-jacomel.onrender.com/events');
            const data = await res.json();

            data.forEach(event => {
                const dataFormatada = event.data_evento.split('T')[0];

                const eventSlide = document.createElement('div');
                eventSlide.classList.add('event-slide');
                eventSlide.innerHTML = `
                <div class="event-slide-inner">
                    <div class="event-type-tag">${event.descricao}</div>
                    <h3>${event.titulo}</h3>
                    <p class="event-date">
                        <i data-lucide="calendar"></i>
                        ${dataFormatada}
                    </p>
                    <p class="event-time-label">
                        <i data-lucide="clock"></i>
                        ${event.hora_evento}
                    </p>
                    <p class="event-location">
                        <i data-lucide="map-pin"></i>
                        ${event.local_evento}
                    </p>
                    <div class="event-slide-footer">
                        <a href="https://www.instagram.com/ipfavoficial/" class="event-video-link" target="_blank">Ver vídeo de apresentação</a>
                    </div>
                </div>
               `
                track.appendChild(eventSlide);
                lucide.createIcons();
            });
        } catch (error) {
            console.log(error);
        }
    }

    // ── Inicializa
    buildDots();
    updateCarousel(false);
    searchEvent();
});