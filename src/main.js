import "./main.sass";

import Swiper from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';

Swiper.use([Navigation]);

const swiper = new Swiper('.swiper', {
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
    document.querySelector('.swiper-button-next').style.display = 'none';
    document.querySelector('.swiper-button-prev').style.display = 'none';
  });
  
  swiper.on('slideChangeTransitionEnd', () => {
    setTimeout(() => {
      document.querySelector('.swiper-button-next').style.opacity = '1';
      document.querySelector('.swiper-button-prev').style.opacity = '1';
    }, 300);
  });