// footer.js
// Example: show alert when clicking email
const emailIcon = document.querySelector('.footer-icon[href^="mailto:"]');
emailIcon?.addEventListener('click', (e) => {
    alert("Opening your email client to contact us!");
});
