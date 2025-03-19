import "./main.sass";

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';

Swiper.use([Navigation]);

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const swiper = new Swiper('.un-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 24,
    slidesPerView: 'auto',
    centeredSlides: true,
    speed: 700
});

swiper.on('slideChangeTransitionStart', () => {
    document.querySelector('.swiper-button-next').style.opacity = '0';
    document.querySelector('.swiper-button-next').style.display = 'none';
    document.querySelector('.swiper-button-prev').style.opacity = '0';
    document.querySelector('.swiper-button-prev').style.display = 'none';
  });
  
swiper.on('slideChangeTransitionEnd', () => {
    const nextButton = document.querySelector('.swiper-button-next');
    const prevButton = document.querySelector('.swiper-button-prev');
  
    if (nextButton && prevButton) {
        nextButton.style.display = 'flex';
        prevButton.style.display = 'flex';
  
        setTimeout(() => {
            if (!nextButton.classList.contains('swiper-button-disabled')) {
            nextButton.style.opacity = '1';
            }
            if (!prevButton.classList.contains('swiper-button-disabled')) {
            prevButton.style.opacity = '1';
            }
        }, 700);
    }
});

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

let activeGrid = document.querySelector('.un-tab--active .un-grid');
let msnry = initMasonry(activeGrid);

function tabs() {
    const tabLinks = document.querySelectorAll('.un-tabs__link');
    const tabContents = document.querySelectorAll('.un-tab');

    tabLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            let targetId = link.getAttribute('href').substring(1);
            let targetTab = document.getElementById(targetId);

            tabLinks.forEach(link => link.classList.remove('un-tabs__link--active'));
            tabContents.forEach(tab => tab.classList.remove('un-tab--active'));

            link.classList.add('un-tabs__link--active');
            targetTab.classList.add('un-tab--active');

            setTimeout(() => {
                let newGrid = targetTab.querySelector('.un-grid');
                if (newGrid) {
                    msnry = initMasonry(newGrid);
                }
            }, 100);
        });
    });
}

tabs();

const lightbox = new PhotoSwipeLightbox({
    gallery: '.un-gallery',
    children: 'a',
    pswpModule: () => import('photoswipe')
  });
lightbox.init();

const galleryImageLoaded = (event) => {
    event.target.parentNode.setAttribute("data-pswp-width", event.target.naturalWidth);
    event.target.parentNode.setAttribute("data-pswp-height", event.target.naturalHeight);
  };
  
  document.querySelectorAll('.un-gallery img').forEach((img) => {
    if (img.complete) {
      galleryImageLoaded({ target: img });
    } else {
      img.addEventListener('load', galleryImageLoaded);
    }
});