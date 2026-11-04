/* ============================================
   LATIN MAFIA — Responsive JS
============================================ */

(function () {
    'use strict';

    /* ------------------------------------------
       1. MENÚ HAMBURGUESA
    ------------------------------------------ */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('main-nav');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    function closeMenu() {
        if (!menuToggle || !navMenu) return;
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }

    function openMenu() {
        if (!menuToggle || !navMenu) return;
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Cerrar al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar al hacer click fuera del menú
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                closeMenu();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Cerrar al cambiar a desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* ------------------------------------------
       2. CARRUSELES
    ------------------------------------------ */
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carouselWrapper => {
        const track = carouselWrapper.querySelector('.carousel-track');
        const leftBtn = carouselWrapper.querySelector('.carousel-arrow--left');
        const rightBtn = carouselWrapper.querySelector('.carousel-arrow--right');

        if (!track || !leftBtn || !rightBtn) return;

        /**
         * Calcula cuánto desplazar (ancho tarjeta + gap)
         */
        function getScrollAmount() {
            const firstCard = track.querySelector('.album-card, .album-video');
            if (!firstCard) return 300;
            const gap = parseFloat(getComputedStyle(track).gap) || 20;
            return firstCard.offsetWidth + gap;
        }

        /**
         * Actualiza estado de flechas
         */
        function updateArrows() {
            const maxScroll = track.scrollWidth - track.clientWidth;
            leftBtn.disabled = track.scrollLeft <= 5;
            rightBtn.disabled = track.scrollLeft >= maxScroll - 5;
        }

        // Click en flechas
        leftBtn.addEventListener('click', () => {
            track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        // Actualizar flechas al hacer scroll
        track.addEventListener('scroll', updateArrows, { passive: true });

        // Actualizar al redimensionar
        window.addEventListener('resize', updateArrows);

        // Estado inicial (esperar a que se apliquen estilos)
        requestAnimationFrame(updateArrows);

        /* --------------------------------------
           Soporte de arrastre con ratón (desktop)
        -------------------------------------- */
        let isDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        let hasDragged = false;

        track.addEventListener('mousedown', (e) => {
            // Solo si hay overflow horizontal (modo carrusel activo)
            if (track.scrollWidth <= track.clientWidth) return;
            isDown = true;
            hasDragged = false;
            startX = e.pageX - track.offsetLeft;
            startScrollLeft = track.scrollLeft;
            track.style.cursor = 'grabbing';
            track.style.userSelect = 'none';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) hasDragged = true;
            track.scrollLeft = startScrollLeft - walk;
        });

        function endDrag() {
            isDown = false;
            track.style.cursor = '';
            track.style.userSelect = '';
        }

        track.addEventListener('mouseup', endDrag);
        track.addEventListener('mouseleave', endDrag);

        // Prevenir click accidental en enlaces si se arrastró
        track.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                hasDragged = false;
            }
        }, true);
    });

})();