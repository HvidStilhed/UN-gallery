import './main.sass';
import 'flickity/css/flickity.css';
import Flickity from 'flickity';
import 'flickity-bg-lazyload';
import imagesLoaded from 'imagesloaded';

var Masonry = require('masonry-layout');

function initMasonry(container) {
    if (!container) return null;

    let msnry = new Masonry(container, {
        itemSelector: '.un-grid__item',
        percentPosition: true,
        gutter: 32
    });

    imagesLoaded(container, () => {
        msnry.layout();
    });

    return msnry;
}

document.addEventListener('DOMContentLoaded', function () {
    var elem = document.querySelector('.un-slider');
    var flkty = new Flickity( elem, {
        pageDots: false,
        wrapAround: true,
        bgLazyLoad: 1
    });
    flkty.resize()
    let flickityBtn = document.querySelectorAll('.flickity-button');

    let flickityInstance = null;

    let activeGrid = document.querySelector('.un-tab--active .un-grid');
    let msnry = initMasonry(activeGrid);
    
    initMasonry(activeGrid);

    function flktyButtons(elem) {
        flickityBtn.forEach(btn => {
            btn.addEventListener('click', function() {
                flickityBtn.forEach(btn => btn.style.opacity = '0');
                flickityBtn.forEach(btn => btn.style.transition = 'none');
            });
        });
    
        elem.on( 'settle', function() {
            flickityBtn.forEach(btn => btn.style.transition = '.3s');
            flickityBtn.forEach(btn => btn.style.opacity = '1');
        });
    
        elem.on( 'dragStart', function() {
            flickityBtn.forEach(btn => {
                flickityBtn.forEach(btn => btn.style.opacity = '0');
                flickityBtn.forEach(btn => btn.style.transition = 'none');
            });
        });
    }
    flktyButtons(flkty)

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

                link.classList.add('un-tabs__link--active');
                targetTab.classList.add('un-tab--active');

                flkty.destroy()
                elem.style.opacity = 0

                setTimeout(() => {
                    let newGrid = targetTab.querySelector('.un-grid');
                    if (newGrid) {
                        msnry = initMasonry(newGrid);
                        imagesLoaded(newGrid, () => {
                            msnry.layout();
                        });
                    }
                    
                    flkty = new Flickity( elem, {
                        pageDots: false,
                        wrapAround: true,
                        bgLazyLoad: 1
                    });

                    flkty.resize()

                    setTimeout(() => {
                        flickityBtn = document.querySelectorAll('.flickity-button');
                        flktyButtons(flkty);
                    }, 10);

                    elem.style.opacity = 1
                    
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

    const galleryItems = document.querySelectorAll(".un-grid__item img");
    const sliderItems = document.querySelectorAll(".un-slider__item");
    const popup = document.querySelector(".un-popup");
    const popupSlider = document.querySelector(".un-popup__slider");
    const popupCaption = document.querySelector("#un-popupCaption");
    const closeBtn = document.querySelector(".un-popup__close");

    galleryItems.forEach((img, index) => {
        img.addEventListener("click", function () {
            const gallery = this.closest(".un-gallery");
            const images = Array.from(gallery.querySelectorAll("img"));

            if (flickityInstance) {
                flickityInstance.destroy();
                flickityInstance = null;
            }

            popupSlider.innerHTML = "";

            const activeIndex = images.indexOf(this);

            const reorderedImages = [
                ...images.slice(activeIndex), 
                ...images.slice(0, activeIndex)
            ];

            reorderedImages.forEach((image) => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("un-popup__slider-item");

                const imgClone = document.createElement("img");
                imgClone.src = image.dataset.image || image.src;
                imgClone.alt = image.alt || "";
                imgClone.title = image.title || "";

                itemContainer.appendChild(imgClone);
                popupSlider.appendChild(itemContainer);
            });

            setTimeout(() => {
                flickityInstance = new Flickity(popupSlider, {
                    cellAlign: "center",
                    contain: true,
                    groupCells: false,
                    pageDots: false,
                    wrapAround: true,
                    prevNextButtons: true,
                    draggable: true,
                    bgLazyLoad: 1
                });

                flickityInstance.select(0);

                // updateCaption(flickityInstance.selectedIndex);

                // flickityInstance.on("change", function (index) {
                //     updateCaption(index);
                // });
            }, 0);

            popup.classList.add("show");
        });
    });

    sliderItems.forEach((slide, index) => {
        slide.addEventListener("click", function () {
            const slides = Array.from(document.querySelectorAll(".un-slider__item"));

            if (flickityInstance) {
                flickityInstance.destroy();
                flickityInstance = null;
            }

            popupSlider.innerHTML = "";

            const reorderedSlides = [
                ...slides.slice(index),
                ...slides.slice(0, index)
            ];

            reorderedSlides.forEach((slide) => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("un-popup__slider-item");

                const imgClone = document.createElement("img");

                if (slide.dataset.image) {
                    imgClone.src = slide.dataset.image;
                } else if (slide.dataset.flickityBgLazyload) {
                    imgClone.src = slide.dataset.flickityBgLazyload;
                }
                else {
                    const bgImage = slide.style.backgroundImage;
                    imgClone.src = bgImage.slice(5, -2);
                }
                imgClone.title = slide.title || "";

                itemContainer.appendChild(imgClone);
                popupSlider.appendChild(itemContainer);
            });

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

                flickityInstance.select(0);

                // updateCaption(flickityInstance.selectedIndex);

                // flickityInstance.on("change", function (index) {
                //     updateCaption(index);
                // });
            }, 0);

            popup.classList.add("show");
        });
    });

    // function updateCaption(index) {
    //     const activeImg = flickityInstance.cells[index].element.querySelector("img");
    //     if (activeImg) {
    //         popupCaption.textContent = activeImg.title || "";
    //     }
    // }

    closeBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    function closePopup() {
        popup.classList.remove("show");

        if (flickityInstance) {
            flickityInstance.destroy();
            flickityInstance = null;
        }

        popupSlider.innerHTML = "";
    }
});
