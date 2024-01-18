$(function () {
  $('.reviews__items').slick({
    infinite: false,
    slideToShow: 1,
    responsive: [
      {
        breakpoint: 531,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ],
    prevArrow: '<button class="slick-btn slick-prev"><img class="slick-prev-svg" src="images/ico/arrow-prev.svg" alt="prev"></button>',
    nextArrow: '<button class="slick-btn slick-next"><img class="slick-next-svg" src="images/ico/arrow-next.svg" alt="next"></button>'
  }); 


  $('.mobile-button').on('click', function () {
    $('.menu__list, .mobile-button').toggleClass('active');
  });
});