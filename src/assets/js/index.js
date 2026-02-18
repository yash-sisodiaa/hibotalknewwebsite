import $ from 'jquery';
window.$ = window.jQuery = $;

// IMPORTANT: OwlCarousel plugin import (attach to jQuery)
//import './owl.carousel.js';

$(document).ready(function () {

  // 🟢 Ensure plugin exists
  if ($.fn && $.fn.owlCarousel) {

    $('#Testimonials').owlCarousel({
      loop: true,
      margin: 15,
      center: true,
      smartSpeed: 1000,
      autoplay: 5000,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });

    $('#Student').owlCarousel({
      loop: true,
      margin: 15,
      smartSpeed: 1000,
      autoplay: 5000,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });

    $('#ProgramSlider').owlCarousel({
      loop: true,
      margin: 15,
      smartSpeed: 1000,
      autoplay: 5000,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
        1500: { items: 4 }
      }
    });

    $('#InspiresSlider').owlCarousel({
      loop: true,
      margin: 15,
      smartSpeed: 1000,
      autoplay: 5000,
      nav: false,
      dots: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
        1500: { items: 4 }
      }
    });

  } else {
    console.error('❌ OwlCarousel plugin not loaded');
  }

  // 🔹 Side Navigation
  $(".Navigation .NaviToggle button").click(function () {
    $(".SidenavArea").addClass("show");
  });

  $(".SidenavArea .SidenavHead button").click(function () {
    $(".SidenavArea").removeClass("show");
  });

  // 🔹 Navbar Toggle
  $(".navbar-toggler").click(function () {
    $("body").toggleClass("MenuOpen");
    $("#navbar").toggleClass("MenuShow");
  });

  // 🔹 Modal (Forgot / Login)
  $(".forgot a, .LoginBody button").click(function () {
    $("body").addClass("ModalOpen");
  });

  $(".Close").click(function () {
    $("body").removeClass("ModalOpen");
  });

});
