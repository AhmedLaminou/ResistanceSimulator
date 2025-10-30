/**
 * ui.js
 * Gère la logique partagée :
 * 1. Changement de Thème (Light/Dark)
 * 2. Affichage des Modales (pop-ups)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU THÈME ---
    const themeBtn = document.getElementById('themeBtn'); // Bouton dans la navbar
    const musicBtn = document.getElementById('musicBtn'); // Bouton dans la navbar
    const bgMusic = document.getElementById('bgMusic');

    // Vérifier le thème sauvegardé ou la préférence système
    let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.className = currentTheme;
    updateThemeIcon(currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeBtn) {
            themeBtn.innerHTML = theme === 'light' ? '🌗 Thème' : '☀️ Thème';
        }
    }
    
    // --- 2. GESTION DE LA MUSIQUE ---
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().catch(e => console.error("Erreur lecture audio:", e));
                musicBtn.innerHTML = '🔈 Musique';
            } else {
                bgMusic.pause();
                musicBtn.innerHTML = '🎵 Musique';
            }
        });
    }

    // --- 3. GESTION DE LA MODALE ---
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Fonction globale pour afficher la modale
    window.showModal = (title, message, type = 'info') => {
        if (!modal) return; // Ne rien faire si la modale n'est pas sur la page

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        // Changer la couleur du titre selon le type
        modalTitle.className = ''; // reset
        if (type === 'error') modalTitle.className = 'text-error';
        if (type === 'success') modalTitle.className = 'text-success';

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    };

    // Fermer la modale
    const closeModal = () => {
        if (!modal) return;
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // Ferme si on clique sur le fond
    });

    // --- Ajout des styles pour text-error/success ---
    const style = document.createElement('style');
    style.innerHTML = `
        .text-error { color: var(--color-error); }
        .text-success { color: var(--color-success); }
    `;
    document.head.appendChild(style);

});
