document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('back-to-top');
    const menuButton = document.getElementById('menu-button');
    const nav = document.getElementById('main-nav');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const carouselImage = document.getElementById('carousel-image');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const body = document.body;

    
    let currentCategory = '';
    const images = {
        '行銷活動': ['css/pic/accupass實體_banner.png','css/pic/EDM-02.png','css/pic/EDM-04.png','css/pic/EDM-06.png',
            'css/pic/EDM-08.png','css/pic/FB_-01.png','css/pic/主視覺-07.png'
            ,'css/pic/主視覺-13.png','css/pic/線上工作坊行程.png','css/pic/6085252-02.png'],

        '課程推廣': ['css/pic/Python與TEJ API：量化金融數據分析全攻略.png','css/pic/howhow課綱_工作區域 1 複本 3.png','css/pic/Python與TEJ API：量化金融數據分析全攻略(課前提問)_工作區域 1 複本 2.png'
            ,'css/pic/HOWHOW_工作區域 1 複本.png','css/pic/howhow課綱-1-16.png','css/pic/howhow課綱-15.png','css/pic/howhow課綱_工作區域 1 複本 4.png','css/pic/howhow課綱_工作區域 1 複本 2.png'
            ,'css/pic/google classroom_工作區域 1.png'],
            
        '公司宣傳': ['css/pic/104圖片_工作區域 1-01.png','css/pic/104圖片-02.png','css/pic/104圖片-11.png','css/pic/企業商情.png',
            'css/pic/信用風險.png','css/pic/審計品質.png','css/pic/法遵科技.png','css/pic/評價分析.png'
            ,'css/pic/量化金融.png'],

        '圖標設計': ['css/pic/DRUG.png','css/pic/ALCOHOL.png','css/pic/healthy.png','css/pic/PEPPER.png','css/pic/HAND.png',
            'css/pic/vitamin c.png','css/pic/RAZOR.png','css/pic/LIPSTICK.png','css/pic/all.png','css/pic/範例教學.png','css/pic/聯絡我們.png','css/pic/關於TQuant Lab.png',
        'css/pic/資料集.png','css/pic/登入及註冊.png','css/pic/技術手冊.png','css/pic/首頁.png','css/pic/熱門資訊 (2).png',
            'css/pic/熱門產品 (2).png','css/pic/熱門文章 (2).png','css/pic/影音學習 (2).png','css/pic/資產 6.png','css/pic/模組化建構您的策略.png','css/pic/龐大且高品質的資料庫.png','css/pic/強大、嚴謹的回測分析套件.png',
            'css/pic/官網會員圖_工作區域 1 複本 2.png','css/pic/官網會員圖_工作區域 1 複本.png','css/pic/官網會員圖_工作區域 1.png','css/pic/月暴徒_工作區域 1.png'],

        '社群推播': ['css/pic/中秋節_line頭像.png','css/pic/中秋節貼文(中).png','css/pic/春節_line頭像-01.png','css/pic/春節_貼文.png','css/pic/端午節頭貼-04.png',
            'css/pic/端午貼文(中)-02.png'],

        '個人創作': ['css/pic/IMG-3490.jpg','css/pic/IMG-3492.jpg','css/pic/IMG-3500.jpg','css/pic/IMG-3521.jpg','css/pic/工作區域 1.png',
            'css/pic/工作區域 2.png','css/pic/工作區域 3.png','css/pic/工作區域 4.png']
    };
    let currentIndex = 0;

    document.querySelectorAll('.browser-window').forEach(window => {
        window.addEventListener('click', function () {
            const category = this.querySelector('.slideshow-container').dataset.category;
            if (images[category]) {
                showModal(category);
            } else {
                console.error('No images found for category:', category);
            }
        });
    });

    function showModal(category) {
        currentCategory = category;
        currentIndex = 0;
        updateCarouselImage();
        modal.style.display = 'block';
        body.classList.add('no-scroll');
    }

    function hideModal() {
        modal.style.display = 'none';
        body.classList.remove('no-scroll');
    }

    function updateCarouselImage() {
        if (images[currentCategory] && images[currentCategory][currentIndex]) {
            carouselImage.src = images[currentCategory][currentIndex];
        }
    }

    function handleScroll() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        backToTopButton.classList.toggle('show', scrollTop > 200);
    }

    window.addEventListener('scroll', handleScroll);

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            const isNavVisible = nav.classList.toggle('show');
            menuButton.classList.toggle('change', isNavVisible);
            nav.style.maxHeight = isNavVisible ? `${nav.scrollHeight}px` : '0';
        });
    }

    document.querySelectorAll('.browser-window').forEach(window => {
        window.addEventListener('click', function () {
            const category = 'marketing';
            if (images[category]) {
                showModal(category);
            }
        });
    });

    closeButton.addEventListener('click', function () {
        hideModal();
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            hideModal();
        }
    });

    prevButton.addEventListener('click', function () {
        const categoryImages = images[currentCategory];
        if (categoryImages) {
            currentIndex = (currentIndex - 1 + categoryImages.length) % categoryImages.length;
            updateCarouselImage();
        }
    });

    nextButton.addEventListener('click', function () {
        const categoryImages = images[currentCategory];
        if (categoryImages) {
            currentIndex = (currentIndex + 1) % categoryImages.length;
            updateCarouselImage();
        }
    });
});