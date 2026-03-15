/* ============================================================
   ФАЙЛ СКРИПТОВ — script.js
   Сайт "Двери для Вас"
   ============================================================ */


/* ============================================================
   ВКЛАДКИ КАТАЛОГА (ТАБЫ)
   При клике на кнопку вкладки — показывается нужный блок товаров
   ============================================================ */

// Находим все кнопки вкладок на странице
const tabButtons = document.querySelectorAll('.tab-btn');

// Для каждой кнопки навешиваем обработчик клика
tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {

        // Убираем класс "активная" со всех кнопок вкладок
        tabButtons.forEach(function (btn) {
            btn.classList.remove('tab-btn--active');
        });

        // Добавляем класс "активная" на ту кнопку, по которой кликнули
        button.classList.add('tab-btn--active');

        // Узнаём, какой таб нужно показать (берём из атрибута data-tab)
        const targetTabId = button.getAttribute('data-tab');

        // Находим все блоки с содержимым вкладок
        const allTabContents = document.querySelectorAll('.tab-content');

        // Скрываем все блоки
        allTabContents.forEach(function (content) {
            content.classList.remove('tab-content--active');
        });

        // Показываем только нужный блок
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) {
            targetContent.classList.add('tab-content--active');
        }
    });
});


/* ============================================================
   МОДАЛЬНОЕ ОКНО
   Открывается при клике на кнопку "Подробнее"
   Данные берутся из data-атрибутов кнопки в index.html
   ============================================================ */

// Находим элементы модального окна
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');

/**
 * Функция ОТКРЫТИЯ модального окна.
 * Вызывается прямо из HTML кнопки: onclick="openModal(this)"
 * "this" — это сама кнопка, из которой мы берём данные
 *
 * @param {HTMLElement} button — кнопка "Подробнее", по которой кликнули
 */
function openModal(button) {

    // Читаем данные из атрибутов кнопки
    const title = button.getAttribute('data-title');
    const price = button.getAttribute('data-price');
    const description = button.getAttribute('data-description');
    const image = button.getAttribute('data-image');

    // Вставляем данные в модальное окно
    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalDescription.textContent = description;
    modalImg.src = image;
    modalImg.alt = title;

    // Показываем модальное окно (добавляем класс is-open)
    modalOverlay.classList.add('is-open');

    // Блокируем прокрутку страницы пока окно открыто
    document.body.style.overflow = 'hidden';
}

/**
 * Функция ЗАКРЫТИЯ модального окна.
 */
function closeModal() {
    // Скрываем модальное окно (убираем класс is-open)
    modalOverlay.classList.remove('is-open');

    // Возвращаем прокрутку страницы
    document.body.style.overflow = '';
}

// Закрытие по клику на крестик
modalClose.addEventListener('click', closeModal);

// Закрытие по клику на тёмный фон (вне самого окна)
modalOverlay.addEventListener('click', function (event) {
    // Проверяем: клик был именно по фону, а не по содержимому окна
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Закрытие по нажатию клавиши Escape на клавиатуре
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});


/* ============================================================
   МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
   При клике на три полоски — боковое меню выезжает справа
   ============================================================ */

// Находим кнопку-бургер и само меню
const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('mainNav');

// При клике на бургер — переключаем открытие/закрытие меню
burgerBtn.addEventListener('click', function () {

    // Класс is-open на кнопке — анимирует три полоски в крестик
    burgerBtn.classList.toggle('is-open');

    // Класс is-open на меню — выдвигает его из-за края экрана
    mainNav.classList.toggle('is-open');

    // Блокируем/разблокируем прокрутку страницы
    if (mainNav.classList.contains('is-open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// При клике на любой пункт меню — меню автоматически закрывается
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
   Подсвечивает нужный пункт меню золотым когда вы прокручиваете
   страницу до соответствующего раздела
   ============================================================ */

// Все разделы страницы с якорями
const sections = document.querySelectorAll('section[id], footer[id]');

// Следим за прокруткой страницы
window.addEventListener('scroll', function () {

    // Текущая позиция прокрутки (с небольшим отступом для шапки)
    const scrollPosition = window.scrollY + 100;

    // Проверяем каждый раздел
    sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Если мы находимся внутри этого раздела
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {

            // Убираем активный класс со всех ссылок
            navLinks.forEach(function (link) {
                link.style.color = '';
            });

            // Подсвечиваем нужную ссылку золотым
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.style.color = 'var(--color-gold)';
            }
        }
    });
});