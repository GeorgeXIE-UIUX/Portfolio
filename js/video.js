document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('back-to-top');
    const menuButton = document.getElementById('menu-button');
    const nav = document.getElementById('main-nav');
    let progress = 0;
const progressBar = document.getElementById('progress');
const percentage = document.getElementById('percentage');
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');

function updateProgress() {
    if (progress >= 100) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
        }, 500);
        return;
    }
    progress += Math.random() * 5;
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';
    percentage.textContent = Math.floor(progress) + '%';
    setTimeout(updateProgress, 50);
}

window.onload = function() {
    updateProgress();
};


    function handleScroll() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        backToTopButton.classList.toggle('show', scrollTop > 200);
    }

    // Scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Smooth scroll to top when back-to-top button is clicked
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Toggle navigation and menu button styles when menu button is clicked
    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            const isNavVisible = nav.classList.toggle('show');
            menuButton.classList.toggle('change', isNavVisible);
            nav.style.maxHeight = isNavVisible ? `${nav.scrollHeight}px` : '0';
        });
    }
});