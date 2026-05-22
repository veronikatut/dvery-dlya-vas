document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       ВСТАВКА КАРТОЧЕК ТОВАРОВ
       ============================================================ */
    document.getElementById('grid-doors-interior').innerHTML = doorsInteriorHTML;
    document.getElementById('grid-doors-metal').innerHTML = doorsMetalHTML;
    //document.getElementById('grid-hardware').innerHTML = hardwareHTML;
    //document.getElementById('grid-laminate').innerHTML = laminateHTML;


    /* ============================================================
       ПОИСК + СОРТИРОВКА + ПАГИНАЦИЯ
       ============================================================ */
    const ITEMS_PER_PAGE = 4;

    function initSection(gridId, paginationId, searchId, sortId) {
        const grid = document.getElementById(gridId);
        const pagination = document.getElementById(paginationId);
        const searchInput = document.getElementById(searchId);
        const sortSelect = document.getElementById(sortId);

        if (!grid || !pagination) return;

        // Сохраняем все карточки
        const allCards = Array.from(grid.querySelectorAll('.product-card'));
        let filteredCards = [...allCards];
        let currentPage = 1;

        // --- ПАРСИНГ ЦЕНЫ ---
        function getPrice(card) {
            const priceEl = card.querySelector('.product-card__price');
            if (!priceEl) return 0;
            // Убираем все символы кроме цифр (включая пробелы и неразрывные пробелы)
            return parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) || 0;
        }

        // --- ФИЛЬТР + СОРТИРОВКА ---
        function applyFilters() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const sortVal = sortSelect ? sortSelect.value : 'default';

            // Фильтр по поиску
            filteredCards = allCards.filter(function (card) {
                const title = card.querySelector('.product-card__title');
                const desc = card.querySelector('.product-card__short-desc');
                const text = (title ? title.textContent : '') + ' ' + (desc ? desc.textContent : '');
                return text.toLowerCase().includes(query);
            });

            // Сортировка
            if (sortVal === 'price-asc') {
                filteredCards.sort(function (a, b) {
                    return getPrice(a) - getPrice(b);
                });
            } else if (sortVal === 'price-desc') {
                filteredCards.sort(function (a, b) {
                    return getPrice(b) - getPrice(a);
                });
            }

            currentPage = 1;
            showPage(1);
        }

        // --- ОТОБРАЖЕНИЕ СТРАНИЦЫ ---
        function showPage(page) {
            currentPage = page;
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;

            // Сначала скрываем все карточки
            allCards.forEach(function (card) {
                card.style.display = 'none';
            });

            // Добавляем в DOM в правильном порядке и показываем нужные
            filteredCards.forEach(function (card, index) {
                grid.appendChild(card); // расставляем в отсортированном порядке
                if (index >= start && index < end) {
                    card.style.display = '';
                }
            });

            renderPagination();
        }

        // --- ПАГИНАЦИЯ С МНОГОТОЧИЕМ ---
        function renderPagination() {
            pagination.innerHTML = '';
            const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

            if (totalPages <= 1) return;

            // Кнопка «←»
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination__btn pagination__btn--prev';
            prevBtn.textContent = '←';
            prevBtn.setAttribute('aria-label', 'Предыдущая страница');
            if (currentPage === 1) prevBtn.disabled = true;
            prevBtn.addEventListener('click', function () {
                if (currentPage > 1) showPage(currentPage - 1);
            });
            pagination.appendChild(prevBtn);

            // Формируем список страниц с многоточием
            // Всегда: 1, ..., currentPage-1, currentPage, currentPage+1, ..., last
            const pages = getPageNumbers(currentPage, totalPages);

            pages.forEach(function (p) {
                if (p === '...') {
                    // Многоточие
                    const dots = document.createElement('span');
                    dots.className = 'pagination__dots';
                    dots.textContent = '…';
                    pagination.appendChild(dots);
                } else {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = 'pagination__btn';
                    if (p === currentPage) pageBtn.classList.add('pagination__btn--active');
                    pageBtn.textContent = p;
                    pageBtn.addEventListener('click', (function (pageNum) {
                        return function () { showPage(pageNum); };
                    })(p));
                    pagination.appendChild(pageBtn);
                }
            });

            // Кнопка «→»
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination__btn pagination__btn--next';
            nextBtn.textContent = '→';
            nextBtn.setAttribute('aria-label', 'Следующая страница');
            if (currentPage === totalPages) nextBtn.disabled = true;
            nextBtn.addEventListener('click', function () {
                if (currentPage < totalPages) showPage(currentPage + 1);
            });
            pagination.appendChild(nextBtn);
        }

        // --- АЛГОРИТМ СТРАНИЦ С МНОГОТОЧИЕМ ---
        // Показываем: первую, последнюю и 3 страницы вокруг текущей
        function getPageNumbers(current, total) {
            const delta = 1; // сколько страниц по бокам от текущей
            const pages = [];

            // Всегда добавляем первую страницу
            pages.push(1);

            // Левая граница окна вокруг текущей
            const leftBound = Math.max(2, current - delta);
            // Правая граница окна вокруг текущей
            const rightBound = Math.min(total - 1, current + delta);

            // Многоточие слева если нужно
            if (leftBound > 2) {
                pages.push('...');
            }

            // Страницы вокруг текущей
            for (let i = leftBound; i <= rightBound; i++) {
                pages.push(i);
            }

            // Многоточие справа если нужно
            if (rightBound < total - 1) {
                pages.push('...');
            }

            // Всегда добавляем последнюю страницу
            if (total > 1) {
                pages.push(total);
            }

            return pages;
        }

        // --- СОБЫТИЯ ---
        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        applyFilters(); // инициализация
    }

    initSection('grid-doors-interior', 'pagination-interior', 'search-interior', 'sort-interior');
    initSection('grid-doors-metal', 'pagination-metal', 'search-metal', 'sort-metal');
    //initSection('grid-hardware',       'pagination-hardware', 'search-hardware', 'sort-hardware');
    //initSection('grid-laminate',       'pagination-laminate', 'search-laminate', 'sort-laminate'); 


    /* ============================================================
       ВКЛАДКИ КАТАЛОГА (ТАБЫ)
       ============================================================ */
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            tabButtons.forEach(function (btn) {
                btn.classList.remove('tab-btn--active');
            });
            button.classList.add('tab-btn--active');

            const targetTabId = button.getAttribute('data-tab');
            const allTabContents = document.querySelectorAll('.tab-content');
            allTabContents.forEach(function (content) {
                content.classList.remove('tab-content--active');
            });

            const targetContent = document.getElementById(targetTabId);
            if (targetContent) targetContent.classList.add('tab-content--active');
        });
    });


    /* ============================================================
       МОДАЛЬНОЕ ОКНО
       ============================================================ */
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');

    window.openModal = function (button) {
        const title = button.getAttribute('data-title');
        const price = button.getAttribute('data-price');
        const description = button.getAttribute('data-description');
        const image = button.getAttribute('data-image');

        modalTitle.innerHTML = title.replace(' | ', '<br>');
        modalPrice.textContent = price;
        modalDescription.textContent = description;
        modalImg.src = image;
        modalImg.alt = title;

        modalOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modalOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });


    /* ============================================================
       МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
       ============================================================ */
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');

    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.toggle('is-open');
        mainNav.classList.toggle('is-open');
        document.body.style.overflow = mainNav.classList.contains('is-open') ? 'hidden' : '';
    });

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            burgerBtn.classList.remove('is-open');
            mainNav.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    });


    /* ============================================================
       АКТИВНАЯ ССЫЛКА МЕНЮ ПРИ ПРОКРУТКЕ
       ============================================================ */
    const sections = document.querySelectorAll('section[id], footer[id]');

    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + 100;
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) { link.style.color = ''; });
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) activeLink.style.color = 'var(--color-gold)';
            }
        });
    });

}); // конец DOMContentLoaded