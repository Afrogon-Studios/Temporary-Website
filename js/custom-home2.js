(function ($) {
  "use strict";

  //Home Sections fit screen

  $(function () {
    "use strict";
    $(".home-top-slider").css({ height: $(window).height() + "px" });
    $(window).resize(function () {
      $(".home-top-slider").css({ height: $(window).height() + "px" });
    });
  });

  //Home Background Slider

  $.mbBgndGallery.buildGallery({
    containment: "#slider-wrap",
    timer: 2000,
    effTimer: 4000,
    controls: "#controls",
    grayScale: false,
    shuffle: true,
    preserveWidth: false,
    //effect: "zoom",
    //				effect:{enter:{transform:"scale("+(1+ Math.random()*2)+")",opacity:0},exit:{transform:"scale("+(Math.random()*2)+")",opacity:0}},

    // If your server allow directory listing you can use:
    // (however this doesn't work locally on your computer)

    //folderPath:"testImage/",

    // else:

    images: [
      "images/homepage-11.jpg",
      "images/homepage-22.jpg",
      "images/homepage-33.jpg",
    ],

    onStart: function () {},
    onPause: function () {},
    onPlay: function (opt) {},
    onChange: function (opt, idx) {},
    onNext: function (opt) {},
    onPrev: function (opt) {},
  });

  //Home Scroll

  jQuery(document).ready(function ($) {
    //change this value if you want to change the speed of the scale effect
    var scaleSpeed = 0.3,
      //change this value if you want to set a different initial opacity for the .cd-half-block
      boxShadowOpacityInitialValue = 0.7,
      animating = false;

    //check the media query
    var MQ = window
      .getComputedStyle(document.querySelector("body"), "::before")
      .getPropertyValue("content")
      .replace(/"/g, "")
      .replace(/'/g, "");
    $(window).on("resize", function () {
      MQ = window
        .getComputedStyle(document.querySelector("body"), "::before")
        .getPropertyValue("content")
        .replace(/"/g, "")
        .replace(/'/g, "");
    });

    //bind the animation to the window scroll event
    triggerAnimation();
    $(window).on("scroll", function () {
      triggerAnimation();
    });

    //move to next/previous section
    $(".cd-vertical-nav .cd-prev").on("click", function () {
      prevSection();
    });
    $(".cd-vertical-nav .cd-next").on("click", function () {
      nextSection();
    });
    $(document).keydown(function (event) {
      if (event.which == "38") {
        prevSection();
        event.preventDefault();
      } else if (event.which == "40") {
        nextSection();
        event.preventDefault();
      }
    });

    function triggerAnimation() {
      if (MQ == "desktop") {
        //if on desktop screen - animate sections
        !window.requestAnimationFrame
          ? animateSection()
          : window.requestAnimationFrame(animateSection);
      } else {
        //on mobile - remove the style added by jQuery
        $(".cd-section")
          .find(".cd-block")
          .removeAttr("style")
          .find(".cd-half-block")
          .removeAttr("style");
      }
      //update navigation arrows visibility
      checkNavigation();
    }

    function animateSection() {
      var scrollTop = $(window).scrollTop(),
        windowHeight = $(window).height(),
        windowWidth = $(window).width();

      $(".cd-section").each(function () {
        var actualBlock = $(this),
          offset = scrollTop - actualBlock.offset().top,
          scale = 1,
          translate = windowWidth / 2 + "px",
          opacity,
          boxShadowOpacity;

        if (offset >= -windowHeight && offset <= 0) {
          //move the two .cd-half-block toward the center - no scale/opacity effect
          (scale = 1),
            (opacity = 1),
            (translate =
              (windowWidth * 0.5 * (-offset / windowHeight)).toFixed(0) + "px");
        } else if (offset > 0 && offset <= windowHeight) {
          //the two .cd-half-block are in the center - scale the .cd-block element and reduce the opacity
          (translate = 0 + "px"),
            (scale = (1 - (offset * scaleSpeed) / windowHeight).toFixed(5)),
            (opacity = (1 - offset / windowHeight).toFixed(5));
        } else if (offset < -windowHeight) {
          //section not yet visible
          (scale = 1), (translate = windowWidth / 2 + "px"), (opacity = 1);
        } else {
          //section not visible anymore
          opacity = 0;
        }

        boxShadowOpacity =
          (parseInt(translate.replace("px", "")) *
            boxShadowOpacityInitialValue) /
          20;

        //translate/scale section blocks
        scaleBlock(actualBlock.find(".cd-block"), scale, opacity);

        var directionFirstChild = actualBlock.is(":nth-of-type(even)")
          ? "-"
          : "+";
        var directionSecondChild = actualBlock.is(":nth-of-type(even)")
          ? "+"
          : "-";
        if (actualBlock.find(".cd-half-block")) {
          translateBlock(
            actualBlock.find(".cd-half-block").eq(0),
            directionFirstChild + translate,
            boxShadowOpacity
          );
          translateBlock(
            actualBlock.find(".cd-half-block").eq(1),
            directionSecondChild + translate,
            boxShadowOpacity
          );
        }
        //this is used to navigate through the sections
        offset >= 0 && offset < windowHeight
          ? actualBlock.addClass("is-visible")
          : actualBlock.removeClass("is-visible");
      });
    }

    function translateBlock(elem, value, shadow) {
      var position = Math.ceil(Math.abs(value.replace("px", "")));

      if (position >= $(window).width() / 2) {
        shadow = 0;
      } else if (position > 20) {
        shadow = boxShadowOpacityInitialValue;
      }

      elem.css({
        "-moz-transform": "translateX(" + value + ")",
        "-webkit-transform": "translateX(" + value + ")",
        "-ms-transform": "translateX(" + value + ")",
        "-o-transform": "translateX(" + value + ")",
        transform: "translateX(" + value + ")",
        "box-shadow": "0px 0px 40px rgba(0,0,0," + shadow + ")",
      });
    }

    function scaleBlock(elem, value, opac) {
      elem.css({
        "-moz-transform": "scale(" + value + ")",
        "-webkit-transform": "scale(" + value + ")",
        "-ms-transform": "scale(" + value + ")",
        "-o-transform": "scale(" + value + ")",
        transform: "scale(" + value + ")",
        opacity: opac,
      });
    }

    function nextSection() {
      if (!animating) {
        if ($(".cd-section.is-visible").next().length > 0)
          smoothScroll($(".cd-section.is-visible").next());
      }
    }

    function prevSection() {
      if (!animating) {
        var prevSection = $(".cd-section.is-visible");
        if (
          prevSection.length > 0 &&
          $(window).scrollTop() != prevSection.offset().top
        ) {
          smoothScroll(prevSection);
        } else if (
          prevSection.prev().length > 0 &&
          $(window).scrollTop() == prevSection.offset().top
        ) {
          smoothScroll(prevSection.prev(".cd-section"));
        }
      }
    }

    function checkNavigation() {
      $(window).scrollTop() < $(window).height() / 2
        ? $(".cd-vertical-nav .cd-prev").addClass("inactive")
        : $(".cd-vertical-nav .cd-prev").removeClass("inactive");
      $(window).scrollTop() >
      $(document).height() - (3 * $(window).height()) / 2
        ? $(".cd-vertical-nav .cd-next").addClass("inactive")
        : $(".cd-vertical-nav .cd-next").removeClass("inactive");
    }

    function smoothScroll(target) {
      animating = true;
      $("body,html").animate(
        { scrollTop: target.offset().top },
        500,
        function () {
          animating = false;
        }
      );
    }
  });

  //Navigation

  $("ul.slimmenu").on("click", function () {
    var width = $(window).width();
    if (width <= 1200) {
      $(this).slideToggle();
    }
  });
  $("ul.slimmenu").slimmenu({
    resizeWidth: "1200",
    collapserTitle: "",
    easingEffect: "easeInOutQuint",
    animSpeed: "medium",
    indentChildren: true,
    childrenIndenter: "&raquo;",
  });

  $(document).ready(function () {
    "use strict";
    $(".scroll").click(function (event) {
      event.preventDefault();

      var full_url = this.href;
      var parts = full_url.split("#");
      var trgt = parts[1];
      var target_offset = $("#" + trgt).offset();
      var target_top = target_offset.top;

      $("html, body").animate({ scrollTop: target_top }, 700);
    });
  });

  //Tooltip

  $(document).ready(function () {
    $(".tipped").tipper();
  });
})(jQuery);
