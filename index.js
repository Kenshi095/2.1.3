document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ НАЧАТА ===');
    
    
    let swiper = null;
    let isDesktop = window.innerWidth >= 1120;
    let lastWidth = window.innerWidth;
    let resizeTimeout;
    
    
    const toggleButton = document.getElementById('toggleButton');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    const brandsGrid = document.getElementById('brandsGrid');
    const paginationEl = document.querySelector('.brands-swiper__pagination');
    
    console.log('Элементы найдены:', {
        toggleButton: !!toggleButton,
        brandsGrid: !!brandsGrid,
        toggleIcon: !!toggleIcon,
        toggleText: !!toggleText,
        paginationEl: !!paginationEl
    });
    
    
    const STORAGE_KEY = 'brandsGridState';
    
    
    function saveState() {
        if (!brandsGrid) return;
        const state = brandsGrid.classList.contains('hidden') ? 'hidden' : 'shown';
        localStorage.setItem(STORAGE_KEY, state);
        console.log('💾 Состояние сохранено:', state);
    }
    
    
    function loadState() {
        if (!brandsGrid || !isDesktop) return;
        
        const savedState = localStorage.getItem(STORAGE_KEY);
        const cards = brandsGrid.querySelectorAll('.brands-grid__card');
        
        
        if (cards.length <= 8) {
            brandsGrid.classList.remove('hidden');
            if (toggleButton) toggleButton.style.display = 'none';
            console.log('📱 Карточек <= 8, всегда показываем все');
            return;
        }
        
        
        if (savedState === 'hidden') {
            brandsGrid.classList.add('hidden');
            if (toggleText) toggleText.textContent = 'Показать все';
            if (toggleIcon) toggleIcon.src = 'img/ic_expand (1).svg';
            console.log('📂 Состояние загружено: скрыто');
        } else if (savedState === 'shown') {
            brandsGrid.classList.remove('hidden');
            if (toggleText) toggleText.textContent = 'Скрыть';
            if (toggleIcon) toggleIcon.src = 'img/ic_expand.svg';
            console.log('📂 Состояние загружено: показано');
        } else {
            
            brandsGrid.classList.add('hidden');
            if (toggleText) toggleText.textContent = 'Показать все';
            if (toggleIcon) toggleIcon.src = 'img/ic_expand (1).svg';
            saveState();
            console.log('⚙️ Установлено состояние по умолчанию: скрыто');
        }
    }
    
    
    function updateToggleIcon() {
        if (!toggleIcon || !brandsGrid) return;
        
        if (brandsGrid.classList.contains('hidden')) {
            toggleIcon.src = 'img/ic_expand (1).svg';
            toggleIcon.alt = 'Стрелка вниз';
        } else {
            toggleIcon.src = 'img/ic_expand.svg';
            toggleIcon.alt = 'Стрелка вверх';
        }
    }
    
    
    function initSwiper() {
        if (isDesktop || !document.querySelector('.brands-swiper')) {
            console.log('📱 Свайпер не нужен');
            return null;
        }
        
        const isMobile = window.innerWidth < 768;
        
        
        if (swiper && swiper.destroy) {
            swiper.destroy(true, true);
            swiper = null;
        }
        
        
        if (paginationEl) {
            if (isMobile) {
                
                paginationEl.style.opacity = '1';
                paginationEl.style.visibility = 'visible';
                paginationEl.style.display = 'flex';
                paginationEl.style.height = '12px';
                paginationEl.style.marginTop = '16px';
            } else {
                
                paginationEl.style.opacity = '0';
                paginationEl.style.visibility = 'hidden';
                paginationEl.style.display = 'none';
                paginationEl.style.height = '0';
                paginationEl.style.marginTop = '0';
            }
        }
        
        console.log('🎯 Инициализация свайпера, мобильный:', isMobile);
        
        const newSwiper = new Swiper('.brands-swiper', {
            slidesPerView: 'auto',
            spaceBetween: isMobile ? 16 : 24,
            freeMode: true,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            speed: 100,
            pagination: {
                el: '.brands-swiper__pagination',
                type: 'bullets',
                clickable: true,
                enabled: isMobile,
                dynamicBullets: false,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"></span>';
                }
            },
            on: {
                init: function() {
                    console.log('✅ Свайпер инициализирован, пагинация:', isMobile ? 'ВКЛ' : 'ВЫКЛ');
                    
                    if (this.pagination && isMobile) {
                        this.pagination.init();
                        this.pagination.render();
                        this.pagination.update();
                        
                        
                        setTimeout(() => {
                            if (paginationEl && isMobile) {
                                paginationEl.style.opacity = '1';
                                paginationEl.style.visibility = 'visible';
                                paginationEl.style.display = 'flex';
                            }
                        }, 10);
                    }
                },
                afterResize: function() {
                    const nowMobile = window.innerWidth < 768;
                    console.log('🔄 После ресайза, мобильный:', nowMobile);
                    updatePaginationVisibility(nowMobile);
                }
            }
        });
        
        console.log('🎮 Свайпер создан');
        return newSwiper;
    }
    
    function destroySwiper() {
        if (swiper && swiper.destroy) {
            swiper.destroy(true, true);
            swiper = null;
            console.log('🗑️ Свайпер уничтожен');
        }
    }
    
    
    function updatePaginationVisibility(forceMobile = null) {
        const isMobile = forceMobile !== null ? forceMobile : window.innerWidth < 768;
        
        if (paginationEl) {
            if (isMobile) {
                
                paginationEl.style.cssText = `
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    height: 12px !important;
                    margin-top: 16px !important;
                    position: relative !important;
                    text-align: center !important;
                    transition: none !important;
                `;
                
                
                if (swiper && swiper.pagination && !swiper.params.pagination.enabled) {
                    swiper.params.pagination.enabled = true;
                    swiper.pagination.init();
                    swiper.pagination.render();
                    swiper.pagination.update();
                }
            } else {
                
                paginationEl.style.cssText = `
                    opacity: 0 !important;
                    visibility: hidden !important;
                    display: none !important;
                    height: 0 !important;
                    margin-top: 0 !important;
                    overflow: hidden !important;
                    transition: none !important;
                `;
                
                if (swiper && swiper.pagination && swiper.params.pagination.enabled) {
                    swiper.params.pagination.enabled = false;
                    if (swiper.pagination.destroy) {
                        swiper.pagination.destroy();
                    }
                }
            }
        }
        
        return isMobile;
    }
    
    
    function handleResize() {
        const currentWidth = window.innerWidth;
        
        
        if (Math.abs(currentWidth - lastWidth) < 1) return;
        
        lastWidth = currentWidth;
        
        clearTimeout(resizeTimeout);
        
        
        const newIsDesktop = currentWidth >= 1120;
        const isMobile = currentWidth < 768;
        
        console.log('📏 Ресайз:', {
            было: isDesktop ? 'десктоп' : 'мобилка',
            стало: newIsDesktop ? 'десктоп' : 'мобилка',
            мобильный: isMobile,
            ширина: currentWidth
        });
        
        
        updatePaginationVisibility(isMobile);
        
        if (isDesktop !== newIsDesktop) {
            isDesktop = newIsDesktop;
            
            if (isDesktop) {
                
                console.log('🖥️ Переход на десктоп');
                
                
                saveState();
                
                
                destroySwiper();
                
                
                loadState();
                
                
                if (toggleButton && brandsGrid) {
                    const cards = brandsGrid.querySelectorAll('.brands-grid__card');
                    toggleButton.style.display = cards.length > 8 ? 'flex' : 'none';
                }
                
            } else {
                
                console.log('📱 Переход на мобильный/планшет');
                
                
                saveState();
                
                
                swiper = initSwiper();
                
                
                if (toggleButton) {
                    toggleButton.style.display = 'none';
                }
            }
        } else if (!isDesktop) {
            
            if (swiper && swiper.initialized) {
                
                const nowMobile = window.innerWidth < 768;
                swiper.params.spaceBetween = nowMobile ? 16 : 24;
                swiper.update();
                
                
                updatePaginationVisibility(nowMobile);
            } else if (!swiper) {
                
                swiper = initSwiper();
            }
        }
    }
    
    
    function debouncedResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 10); // Минимальная задержка
    }
    
    
    function initEventHandlers() {
        // Кнопка "Показать все/Скрыть"
        if (toggleButton && brandsGrid) {
            toggleButton.addEventListener('click', function() {
                brandsGrid.classList.toggle('hidden');
                
                if (brandsGrid.classList.contains('hidden')) {
                    toggleText.textContent = 'Показать все';
                } else {
                    toggleText.textContent = 'Скрыть';
                }
                
                updateToggleIcon();
                saveState();
                
                console.log('🖱️ Кнопка нажата, состояние:', 
                    brandsGrid.classList.contains('hidden') ? 'скрыто' : 'показано');
            });
        }
        
        
        const cards = document.querySelectorAll('.brands-grid__card, .brands-swiper__slide');
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('brands-grid__button') && 
                    !e.target.classList.contains('brands-swiper__button')) {
                    const brand = this.querySelector('img').alt;
                    console.log('🎯 Выбран бренд:', brand);
                }
            });
        });
        
        
        const buttons = document.querySelectorAll('.brands-grid__button, .brands-swiper__button');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.brands-grid__card, .brands-swiper__slide');
                const brand = card.querySelector('img').alt;
                console.log('➡️ Переход к бренду:', brand);
            });
        });
    }
    
    
    function init() {
        console.log('🚀 Начальная инициализация...');
        
        
        initEventHandlers();
        
        
        if (isDesktop) {
            console.log('🖥️ Начальный режим: десктоп');
            loadState();
        } else {
            console.log('📱 Начальный режим: мобильный/планшет');
            
            
            const isMobile = window.innerWidth < 768;
            updatePaginationVisibility(isMobile);
            
            
            setTimeout(() => {
                swiper = initSwiper();
            }, 0);
            
            
            if (toggleButton) {
                toggleButton.style.display = 'none';
            }
        }
        
        
        updateToggleIcon();
        
        // Обработчик ресайза
        window.addEventListener('resize', debouncedResize);
        
        console.log('✅ Инициализация завершена');
    }
    
    // Запускаем
    init();
});