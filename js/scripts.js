window.addEventListener('load', () => {
    initHeroOpening();
    initMobileMenu();
    initHeaderScroll(); // 導航列滾動偵測

    // 延遲啟動滾動動畫，避免初始化效能卡頓
    setTimeout(() => {
        initAnimations();    
        initCursor();        
        initGlowCards();     
        initTextScramble(); 
    }, 100);
});

// 平滑滾動設定
const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// --- 1. 手機版選單邏輯 (確認 ID 正確) ---
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    
    // 確保元素存在才執行，避免報錯
    if (toggleBtn && nav) {
        const links = nav.querySelectorAll('a');

        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('open');      // 控制選單滑入
            toggleBtn.classList.toggle('active'); // 控制漢堡變 X
        });

        // 點擊連結後自動關閉選單
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggleBtn.classList.remove('active');
            });
        });
    }
}

// --- 2. 導航列滾動變色邏輯 ---
function initHeaderScroll() {
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化檢查
}

// --- 3. Hero 3D 瀑布流開場 ---
function initHeroOpening() {
    const targets = document.querySelectorAll(".hero-reveal-text");
    targets.forEach(target => {
        const htmlContent = target.innerHTML; 
        if (!htmlContent.includes("<br>")) {
             const chars = target.innerText.split("");
             target.innerHTML = chars.map(char => `<span class="char-span">${char}</span>`).join("");
        } else {
             const parts = htmlContent.split("<br>");
             target.innerHTML = parts.map(part => {
                 const subChars = part.split("").map(c => `<span class="char-span">${c}</span>`).join("");
                 return `<div style="display:block">${subChars}</div>`;
             }).join("");
        }
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero", start: "top 60%", end: "bottom top",   
            toggleActions: "play reverse play reverse", markers: false
        }
    });

    tl.set(".hero-img-wrap img", { scale: 1.2, filter: "blur(10px) sepia(0.2) contrast(1.1)" })
      .set(".hero-img-mask", { opacity: 0 })
      .set(".char-span", { y: 80, rotateX: -90, opacity: 0 });

    tl.to(".hero-img-mask", { opacity: 1, duration: 1 })
      .to(".hero-img-wrap img", { scale: 1, filter: "blur(0px) sepia(0.2) contrast(1.1)", duration: 1.5, ease: "power2.out" }, "<"); 

    tl.to(".char-span", {
        y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.03, ease: "back.out(1.7)"
    }, "-=1.0");
}

// --- 4. 核心滾動動畫 (修正版：解決元素消失問題) ---
function initAnimations() {
    
    // 1. 全局隱藏 .fade-up 元素 (這是為了讓單純的元素有進場效果)
    // 但我們會排除稍後要進行複雜動畫的容器，避免「爸爸隱形」的問題
    gsap.set(".fade-up:not(.work-item):not(.about-desc):not(.about-stats)", { opacity: 0, y: 30 });

    // --- A. 經歷區塊 (Work Experience) ---
    // 這裡我們手動確保 .work-item (外層) 是可見的，因為我們要讓裡面的文字飛進來
    gsap.set(".work-item", { opacity: 1, y: 0 }); 

    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        const date = item.querySelector('.work-date');
        const content = item.querySelector('.work-content');
        
        // 初始設定子元素隱藏
        gsap.set([date, content], { opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: { 
                trigger: item, 
                start: "top 85%", 
                end: "bottom 15%", 
                toggleActions: "play reverse play reverse" 
            }
        });
        
        // 維持你原本喜歡的：左邊日期進場、右邊內容進場
        tl.fromTo(date, 
            { x: -30, opacity: 0, filter: "blur(5px)" },
            { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0)
          .fromTo(content, 
            { x: 30, opacity: 0, filter: "blur(5px)" },
            { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 0.1);
    });

    // --- B. About Me (個人簡介) ---
    // 同樣原理，手動確保外層容器可見
    gsap.set(".about-desc, .about-stats", { opacity: 1, y: 0 });

    // 針對內部的段落文字做動畫
    const aboutTexts = document.querySelectorAll('.about-desc p:not(.q-title), .about-stats li, .q-item');
    
    // 初始隱藏內部文字
    gsap.set(aboutTexts, { opacity: 0, y: 30, filter: "blur(5px)" });

    ScrollTrigger.batch(aboutTexts, {
        start: "top 90%",
        onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1, overwrite: true }),
        onLeave: batch => gsap.to(batch, { y: -30, opacity: 0, filter: "blur(5px)", duration: 0.8, stagger: 0.1, overwrite: true }),
        onEnterBack: batch => gsap.to(batch, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1, overwrite: true }),
        onLeaveBack: batch => gsap.to(batch, { y: 30, opacity: 0, filter: "blur(5px)", duration: 0.8, stagger: 0.1, overwrite: true })
    });

    // --- C. Education 學歷 (電影感聚焦效果) ---
    gsap.utils.toArray('.edu-card').forEach(card => {
        gsap.fromTo(card, 
            { x: -50, opacity: 0, filter: "blur(10px)" },
            { 
                x: 0, opacity: 1, filter: "blur(0px)", 
                duration: 1, ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    });

    gsap.utils.toArray('.edu-img-wrap').forEach(imgWrap => {
        const img = imgWrap.querySelector('img');
        gsap.fromTo(imgWrap,
            { opacity: 0, scale: 0.9, filter: "blur(10px)" }, 
            { 
                opacity: 1, scale: 1, filter: "blur(0px)",
                duration: 1.2, ease: "power2.out",
                scrollTrigger: {
                    trigger: imgWrap,
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
        gsap.fromTo(img,
            { scale: 1.2 }, 
            { 
                scale: 1, 
                scrollTrigger: {
                    trigger: imgWrap,
                    start: "top 100%",
                    end: "bottom top",
                    scrub: 1.5 
                }
            }
        );
    });

    // --- D. Skills 技能 (波浪浮現效果) ---
    // 這裡我們直接對 .skill-card 做動畫，父層容器本來就是可見的
    gsap.fromTo(".skill-card", 
        { y: 50, opacity: 0, scale: 0.5 }, 
        { 
            y: 0, opacity: 1, scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)", 
            stagger: { 
                each: 0.05, 
                from: "start", 
                grid: "auto"
            },
            scrollTrigger: {
                trigger: ".skill-grid-compact", 
                start: "top 80%",
                toggleActions: "play reverse play reverse"
            }
        }
    );

    // --- E. Certifications 證照 ---
    gsap.fromTo(".cert-card", 
        { y: 60, opacity: 0, scale: 0.9 },
        { 
            y: 0, opacity: 1, scale: 1,
            duration: 0.8, 
            ease: "power3.out", 
            stagger: 0.1,
            scrollTrigger: { 
                trigger: ".cert-grid", 
                start: "top 85%", 
                toggleActions: "play reverse play reverse" 
            }
        }
    );

    // --- F. Hero 背景視差 ---
    gsap.to(".hero-img-wrap img", {
        yPercent: 20, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // --- G. 標題揭示 ---
    const reveals = document.querySelectorAll('.reveal-inner');
    reveals.forEach(text => {
        if(text.classList.contains('scram-target') || text.classList.contains('hero-reveal-text')) return; 
        gsap.fromTo(text, 
            { y: "100%" }, 
            { y: "0%", duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: text, start: "top 85%", end: "bottom 15%", toggleActions: "play reverse play reverse" }}
        );
    });
}
// --- 5. 游標與其他互動 ---
function initCursor() {
    // 手機版禁用自訂游標
    if (window.matchMedia("(max-width: 1024px)").matches || window.matchMedia("(hover: none)").matches) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
        gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
    });
    const hoverables = document.querySelectorAll('a, button, .skill-card, .cert-card, .q-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });
}

function initGlowCards() {
    if (window.matchMedia("(max-width: 1024px)").matches) return;

    const cards = document.querySelectorAll('.skill-card, .cert-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

function initTextScramble() {
    const titles = document.querySelectorAll('.scram-target');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    titles.forEach(title => {
        const originalText = title.innerText;
        ScrollTrigger.create({
            trigger: title, start: "top 95%", end: "bottom 5%",
            onEnter: () => playScramble(title, originalText, chars),
            onEnterBack: () => playScramble(title, originalText, chars),
            onLeave: () => { gsap.set(title, { opacity: 0, y: "100%" }); },
            onLeaveBack: () => { gsap.set(title, { opacity: 0, y: "100%" }); }
        });
    });
}

function playScramble(element, originalText, chars) {
    gsap.to(element, { opacity: 1, y: "0%", duration: 0.5, ease: "power2.out" }); 
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = originalText.split("")
            .map((letter, index) => {
                if(index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        if(iterations >= originalText.length) clearInterval(interval);
        iterations += 1 / 2;
    }, 30);
}