document.addEventListener('DOMContentLoaded', function() {
    const loadingPage = document.getElementById('loading-page');
    const logoName = document.querySelector('.logo-name');
    const svgPath = document.querySelector('#svg path');

    // 1. 計算路徑長度
    const pathLength = svgPath.getTotalLength();

    // 2. 設定初始狀態
    const tl = gsap.timeline({
        onComplete: () => {
            loadingPage.style.display = 'none'; // 動畫結束後完全隱藏
        }
    });

    gsap.set(loadingPage, { opacity: 1, display: 'flex' });
    gsap.set(logoName, { y: 20, opacity: 0 });
    gsap.set(svgPath, { 
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 1 
    });

    // 3. 執行 Loading 動畫
    tl.to(svgPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut"
    })
    .to(logoName, {
        y: 0, opacity: 1, duration: 1, ease: "power2.out"
    }, "-=0.5")
    .to(loadingPage, {
        opacity: 0, duration: 1, delay: 0.5
    });
});