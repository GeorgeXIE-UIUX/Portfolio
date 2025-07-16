document.addEventListener('DOMContentLoaded', function() {
    const loadingPage = document.getElementById('loading-page');
    const logoName = document.querySelector('.logo-name');

    // Initialize the gsap timeline
    const tl = gsap.timeline({
        onComplete: () => {
            // Hide loadingPage only after all animations are completed
            loadingPage.style.display = 'none';
        }
    });

    // Set initial state
    gsap.set(loadingPage, { opacity: 1, display: 'flex' });
    gsap.set(logoName, { y: 50, opacity: 0 });

    // Animation timeline
    tl.to(logoName, {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 0.5,
    })
    .to(loadingPage, {
        opacity: 0,
        duration: 1.5,
        delay: 0.5, // Delay start for loading-page animation
    }, '-=1.5'); // Overlap the end of the logo-name animation with the start of loading-page animation

    // Show loading-page again when navigating to another page
    const links = document.querySelectorAll('#main-nav a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            loadingPage.style.display = 'flex';
            gsap.set(loadingPage, { opacity: 1 });
            tl.restart(); // Restart the animation timeline
        });
    });
});
