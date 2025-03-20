import './main.sass';

var Masonry = require('masonry-layout');

function initMasonry(container) {
    if (container) {
        return new Masonry(container, {
            itemSelector: '.un-grid__item',
            percentPosition: true,
            gutter: 32
        });
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    let activeGrid = document.querySelector('.un-tab--active .un-grid');
    let msnry = initMasonry(activeGrid);
    
    initMasonry(activeGrid);

    function tabs() {
        const tabLinks = document.querySelectorAll('.un-tabs__link');
        const tabContents = document.querySelectorAll('.un-tab');

        tabLinks.forEach((link, i) => {
            if (i === 0) link.classList.add('un-tabs__link--active');

            link.addEventListener('click', (event) => {
                event.preventDefault();

                let targetId = link.getAttribute('href').substring(1);
                let targetTab = document.getElementById(targetId);

                tabLinks.forEach(link => link.classList.remove('un-tabs__link--active'));
                tabContents.forEach(tab => tab.classList.remove('un-tab--active'));
                console.log(activeGrid)

                link.classList.add('un-tabs__link--active');
                targetTab.classList.add('un-tab--active');

                // Проверяем, когда `un-tab--active` стал видимым
                setTimeout(() => {
                    let newGrid = targetTab.querySelector('.un-grid');
                    if (newGrid) {
                        msnry = initMasonry(newGrid);
                    }
                }, 100);
            });
        });

        tabContents.forEach((tab, i) => {
            if (i === 0) {
                tab.classList.add('un-tab--active');
                let grid = tab.querySelector('.un-grid')
                msnry = initMasonry(grid);
            }
        });
    }

    tabs();
});


document.addEventListener('DOMContentLoaded', function () {
    var elem = document.querySelector('.un-slider');
    var flkty = new Flickity( elem, {
        pageDots: false,
        wrapAround: true,
    });

    const flickityBtn = document.querySelectorAll('.flickity-button');

    flickityBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            flickityBtn.forEach(btn => btn.style.opacity = '0');
            flickityBtn.forEach(btn => btn.style.transition = 'none');
        });
    });

    flkty.on( 'settle', function() {
        flickityBtn.forEach(btn => btn.style.transition = '.3s');
        flickityBtn.forEach(btn => btn.style.opacity = '1');
    });

    flkty.on( 'dragStart', function() {
        flickityBtn.forEach(btn => {
            flickityBtn.forEach(btn => btn.style.opacity = '0');
            flickityBtn.forEach(btn => btn.style.transition = 'none');
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const galleryItems = document.querySelectorAll(".un-grid__item img");
    const sliderItems = document.querySelectorAll(".un-slider__item");
    const popup = document.querySelector(".un-popup");
    const popupSlider = document.querySelector(".un-popup__slider");
    const popupCaption = document.querySelector("#un-popupCaption");
    const closeBtn = document.querySelector(".un-popup__close");

    let flickityInstance = null;

    galleryItems.forEach((img, index) => {
        img.addEventListener("click", function () {
            const gallery = this.closest(".un-gallery");
            const images = Array.from(gallery.querySelectorAll("img"));

            // Проверяем, существует ли старый слайдер, и удаляем его
            if (flickityInstance) {
                flickityInstance.destroy();
                flickityInstance = null;
            }

            // Полностью очищаем контейнер перед вставкой новых изображений
            popupSlider.innerHTML = "";

            // Ищем индекс текущего изображения
            const activeIndex = images.indexOf(this);

            // Создаем новый массив, который сохраняет порядок, но ставит активное изображение в начало
            const reorderedImages = [
                ...images.slice(activeIndex),  // Все изображения после активного
                ...images.slice(0, activeIndex)  // Все изображения до активного
            ];

            // Добавляем изображения в слайдер
            reorderedImages.forEach((image) => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("un-popup__slider-item");

                const imgClone = document.createElement("img");
                imgClone.src = image.src;
                imgClone.alt = image.alt || "";
                imgClone.title = image.title || "";

                itemContainer.appendChild(imgClone);
                popupSlider.appendChild(itemContainer);
            });

            // Создаем новый экземпляр Flickity
            setTimeout(() => {
                flickityInstance = new Flickity(popupSlider, {
                    cellAlign: "center",
                    contain: true,
                    groupCells: false,
                    pageDots: false,
                    wrapAround: true,
                    prevNextButtons: true,
                    draggable: true
                });

                // Устанавливаем активное изображение
                flickityInstance.select(0);  // Нажатое изображение становится первым

                // Обновляем подпись активного изображения
                updateCaption(flickityInstance.selectedIndex);

                // Слушаем событие смены слайда
                flickityInstance.on("change", function (index) {
                    updateCaption(index);
                });
            }, 0);

            // Показываем попап
            popup.classList.add("show");
        });
    });

    sliderItems.forEach((slide, index) => {
        slide.addEventListener("click", function () {
            // Получаем все слайды карусели
            const slides = Array.from(document.querySelectorAll(".un-slider__item"));

            // Проверяем, существует ли старый слайдер, и удаляем его
            if (flickityInstance) {
                flickityInstance.destroy();
                flickityInstance = null;
            }

            // Полностью очищаем контейнер перед вставкой новых изображений
            popupSlider.innerHTML = "";

            // Переставляем слайды так, чтобы активный был первым
            const reorderedSlides = [
                ...slides.slice(index),  // Все слайды после активного
                ...slides.slice(0, index)  // Все слайды до активного
            ];

            // Добавляем слайды в слайдер
            reorderedSlides.forEach((slide) => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("un-popup__slider-item");

                const imgClone = document.createElement("img");
                imgClone.src = slide.style.backgroundImage.slice(5, -2); // Получаем URL из background-image
                imgClone.title = slide.title || ""; // Если есть alt, то добавляем

                itemContainer.appendChild(imgClone);
                popupSlider.appendChild(itemContainer);
            });

            // Создаем новый экземпляр Flickity
            setTimeout(() => {
                flickityInstance = new Flickity(popupSlider, {
                    cellAlign: "center",
                    contain: true,
                    groupCells: false,
                    pageDots: false,
                    wrapAround: true,
                    prevNextButtons: true,
                    draggable: true
                });

                // Устанавливаем активное изображение (по индексу, на который кликнули)
                flickityInstance.select(0);  // Нажатое изображение становится первым

                // Обновляем подпись активного изображения
                updateCaption(flickityInstance.selectedIndex);

                // Слушаем событие смены слайда
                flickityInstance.on("change", function (index) {
                    updateCaption(index);
                });
            }, 0);

            // Показываем попап
            popup.classList.add("show");
        });
    });

    // Функция обновления подписи
    function updateCaption(index) {
        const activeImg = flickityInstance.cells[index].element.querySelector("img");
        if (activeImg) {
            popupCaption.textContent = activeImg.title || "";  // Используем title вместо data-title
        }
    }

    // Закрытие попапа
    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    function closePopup() {
        popup.classList.remove("show");

        // Уничтожаем Flickity перед очисткой
        if (flickityInstance) {
            flickityInstance.destroy();
            flickityInstance = null;
        }

        // Очищаем контейнер
        popupSlider.innerHTML = "";
    }
});
