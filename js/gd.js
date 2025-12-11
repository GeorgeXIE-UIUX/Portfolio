// js/gd.js

// 1. 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
    // 初始化 Loading 流程
    initLoadingProcess();
});

// --- 功能函數定義 ---

function initLoadingProcess() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress');
    const percentage = document.getElementById('percentage');
    let progress = 0;

    function updateProgress() {
        if (progress >= 100) {
            // Loading 完成
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // 啟動頁面特效
                startPageEffects();
            }, 500);
            return;
        }

        progress += Math.random() * 5;
        if (progress > 100) progress = 100;

        if (progressBar) progressBar.style.width = progress + '%';
        if (percentage) percentage.textContent = Math.floor(progress) + '%';
        
        setTimeout(updateProgress, 30);
    }
    updateProgress();
}

// 啟動頁面所有特效
function startPageEffects() {
    initSmoothScroll();  // Lenis 平滑滾動
    initMobileMenu();    // 手機選單
    initHeaderScroll();  // Header 滾動變色
    initCursor();        // 滑鼠游標
    initAnimations();    // 內容進場動畫
}

// A. 平滑滾動 (Lenis)
function initSmoothScroll() {
    const lenis = new Lenis({ 
        duration: 1.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true 
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
}

// B. 手機版選單邏輯
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if (toggleBtn && nav) {
        const links = nav.querySelectorAll('a');

        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('open');      
            toggleBtn.classList.toggle('active'); 
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggleBtn.classList.remove('active');
            });
        });
    }
}

// C. 導航列滾動變色
function initHeaderScroll() {
    const header = document.querySelector('header');
    if(!header) return;
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// D. 滑鼠游標
function initCursor() {
    if (window.matchMedia("(max-width: 1024px)").matches || window.matchMedia("(hover: none)").matches) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if(!cursorDot || !cursorOutline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
        gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
    });
    
    // 讓所有可互動元素 (連結、按鈕、Gallery Item) 都有 Hover 效果
    const hoverables = document.querySelectorAll('a, button, .item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });
}

// E. 核心動畫
function initAnimations() {
    
    // 1. Hero 文字與圖片進場
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-reveal-text", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    )
    .fromTo(".hero-img-wrap", 
        { opacity: 0, scale: 0.9, filter: "blur(10px)" }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, 
        "-=0.8" 
    );

    // 2. Gallery Masonry Items 進場 (針對 .item)
    // 先設定初始狀態
    gsap.set(".item", { opacity: 0, y: 50 });

    ScrollTrigger.batch(".item", {
        start: "top 90%",
        onEnter: batch => gsap.to(batch, { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: 0.8, 
            ease: "power2.out", 
            overwrite: true 
        }),
        onLeave: batch => gsap.to(batch, { opacity: 0, y: -50, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
        onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 50, overwrite: true })
    });
    
    // 3. Section Title 亂碼效果
    const titles = document.querySelectorAll('.scram-target');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    
    titles.forEach(title => {
        const originalText = title.innerText;
        ScrollTrigger.create({
            trigger: title,
            start: "top 90%",
            onEnter: () => {
                gsap.to(title, { opacity: 1 });
                let iterations = 0;
                const interval = setInterval(() => {
                    title.innerText = originalText.split("")
                        .map((letter, index) => {
                            if(index < iterations) return originalText[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("");
                    if(iterations >= originalText.length) clearInterval(interval);
                    iterations += 1 / 2;
                }, 30);
            }
        });
    });
}