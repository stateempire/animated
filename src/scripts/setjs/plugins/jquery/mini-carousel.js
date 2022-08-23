import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.resize, 'slider', function() {
  $('.carousel').each(function() {
    let slider = $(this).data('slider');
    slider && slider.reset && slider.reset();
  });
});

$.fn.miniCarousel = function() {
  var $el = this;
  var $carousel = $el.find('.carousel');
  var slider = $carousel.data('slider');
  var opts = $el.data('carousel');
  if (!slider) {
    opts = $.extend({duration: 750, spring: 0.25, changed}, typeof opts == 'object' ? opts : 0);
    slider = $carousel.slider(opts);
    $el.find('.left').addClass('disabled');
    $el.find('.left, .right').on('click', function() {
      let index = slider.move($(this).hasClass('left') ? -1 : 1);
      $el.find('.left').toggleClass('disabled', index == 0);
      $el.find('.right').toggleClass('disabled', index == slider.count - 1);
    });
    if (opts.time > 0) {
      setTimeout(next, opts.time * 1000);
    }
  }

  function changed(index) {
    $el.find('.js-index').text(index + 1);
  }

  function next() {
    if ($carousel.data('slider')) { // to stop autoplay when $carousel is removed from DOM
      slider.next();
      setTimeout(next, opts.time * 1000);
    }
  }
};
