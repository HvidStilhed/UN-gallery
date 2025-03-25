import './main.sass';
import 'flickity/css/flickity.css';
import Flickity from 'flickity';
import 'flickity-bg-lazyload';
import imagesLoaded from 'imagesloaded';

document.addEventListener('DOMContentLoaded', function () {
    let Masonry = require('masonry-layout');
    let flickityInstances = new Map();

    function initSliders() {
        document.querySelectorAll('.un-slider').forEach(elem => {
            let flkty = new Flickity(elem, {
                pageDots: false,
                wrapAround: true,
                bgLazyLoad: 1
            });

            flickityInstances.set(elem, flkty);
            flkty.resize();
        });
    }

    function destroyFlickity(elem) {
        if (flickityInstances.has(elem)) {
            flickityInstances.get(elem).destroy();
            flickityInstances.delete(elem);
        }
    }

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

    // var elem = document.querySelector('.un-slider');
    // var flkty = new Flickity( elem, {
    //     pageDots: false,
    //     wrapAround: true,
    //     bgLazyLoad: 1
    // });
    // flkty.resize()
    let flickityBtn = document.querySelectorAll('.flickity-button');

    let flickityInstance = null;

    let activeGrid = document.querySelector('.un-tab--active .un-grid');
    let msnry = initMasonry(activeGrid);
    let lastScrollPos = 0;
    
    initMasonry(activeGrid);

    function flktyButtons(flkty) {
        let flickityBtns = flkty.element.querySelectorAll('.flickity-button');
        
        flickityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                flickityBtns.forEach(btn => btn.style.opacity = '0');
                flickityBtns.forEach(btn => btn.style.transition = 'none');
            });
        });

        flkty.on('settle', function() {
            flickityBtns.forEach(btn => btn.style.transition = '.3s');
            flickityBtns.forEach(btn => btn.style.opacity = '1');
        });

        flkty.on('dragStart', function() {
            flickityBtns.forEach(btn => {
                btn.style.opacity = '0';
                btn.style.transition = 'none';
            });
        });
    }

    function tabs() {
        const tabsWrap = document.querySelectorAll('.un-tabs')
        const tabContents = document.querySelectorAll('.un-tab');
        
        tabsWrap.forEach(tabWrap => {
            const tabLinks = tabWrap.querySelectorAll('.un-tabs__link');

            tabLinks.forEach((link, i) => {
                if (i === 0) link.classList.add('un-tabs__link--active');
    
                link.addEventListener('click', (event) => {
                    event.preventDefault();

                    lastScrollPos = window.scrollY;
    
                    let targetId = link.getAttribute('href').substring(1);
                    let targetTab = document.getElementById(targetId);
                    let category = targetTab.getAttribute('data-category');
    
                    tabLinks.forEach(link => link.classList.remove('un-tabs__link--active'));
                    tabContents.forEach(tab => {
                        if (tab.getAttribute('data-category') === category) {
                            tab.classList.remove('un-tab--active');
                        }
                    });
    
                    link.classList.add('un-tabs__link--active');
                    targetTab.classList.add('un-tab--active');

                    let slider = targetTab.querySelector('.un-slider');
                    let grid = targetTab.querySelector('.un-grid');

                    if (slider) {
                        destroyFlickity(slider);
                        slider.style.opacity = 0;

                        setTimeout(() => {
                            let newFlkty = new Flickity(slider, {
                                pageDots: false,
                                wrapAround: true,
                                bgLazyLoad: 1
                            });
    
                            flickityInstances.set(slider, newFlkty);
                            newFlkty.resize();
    
                            flktyButtons(newFlkty);
    
                            setTimeout(() => {
                                slider.style.opacity = 1;
                            }, 10);
                        }, 100);
                    }

                    if (grid) {
                        setTimeout(() => {
                            if (msnry) {
                                msnry.destroy()
                            }
                            msnry = initMasonry(grid);
                            imagesLoaded(grid, () => {
                                msnry.layout();
                            });
                        }, 100);
                    }
                    console.log(lastScrollPos)
                    window.scrollTo(0, lastScrollPos);
                });
            });
        })

        const tabGroups = {};
        tabContents.forEach(tab => {
            let category = tab.getAttribute('data-category')

            if (!tabGroups[category]) {
                tabGroups[category] = tab;
            }
            
            Object.values(tabGroups).forEach((firstTab) => {
                firstTab.classList.add('un-tab--active');
                
                let grid = firstTab.querySelector('.un-grid');
                initMasonry(grid);

                let slider = firstTab.querySelector('.un-slider');
                if (slider && flickityInstances.has(slider)) {
                    let flkty = flickityInstances.get(slider);
                    flkty.resize();
                    flktyButtons(flkty);
                }
            });
        });
    }

    initSliders();
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

                updateCaption(flickityInstance.selectedIndex);

                flickityInstance.on("change", function (index) {
                    updateCaption(index);
                });
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

                updateCaption(flickityInstance.selectedIndex);

                flickityInstance.on("change", function (index) {
                    updateCaption(index);
                });
            }, 0);

            popup.classList.add("show");
        });
    });

    function updateCaption(index) {
        if (!flickityInstance || !flickityInstance.cells || flickityInstance.cells.length === 0) return;
    
        let activeCell = flickityInstance.cells[index]?.element;
        if (!activeCell) return;
    
        let activeImg = activeCell.querySelector("img");
        popupCaption.textContent = activeImg ? activeImg.title || "" : "";
    }

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
