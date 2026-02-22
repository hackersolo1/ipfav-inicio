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

    async function searchEvent() {
        try {
            const res = await fetch('https://estante-jacomel.onrender.com/events');
            const data = await res.json();

            data.forEach(event => {
                if (event.publicOrMember === 'Não') {
                    return;
                } else {
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
                        <a href="${event.linkVideo}" class="event-video-link" target="_blank">Ver vídeo de apresentação</a>
                    </div>
                </div>
               `
                    track.appendChild(eventSlide);
                    lucide.createIcons();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    searchEvent();
});
