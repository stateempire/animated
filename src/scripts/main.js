import anime from 'animejs';
import {debounce} from 'setjs/utility/calls.js';
import loader from 'app/loader.js';
import configInit from 'configurator/init.js';
import timeliner from 'helpers/timeliner.js';

$(function() {
  zIndex();
  configInit(loader, function() {
    setTimeout(init, 2500);
  });
});

function init() {
  let $win = $(window);
  let $doc = $(document);
  let $content = $('#main-content');
  $('.initial .pulse').removeClass('pulse');
  anime({
    scale: 40,
    opacity: 0,
    duration: 900,
    targets: '.initial',
    easing: 'linear',
    complete: function() {
      $('.initial').remove();
      $content.removeClass('invisible').css('opacity', 0).animate({opacity: 1});
    }
  });
  setupTimeline();
  $win.off('.tl1').on('resize.tl1 timeline.tl1', debounce(setupTimeline));

  function setupTimeline() {
    let {timeline, pageHeight} = timeliner($content, loader.getTimeData());
    $doc.off('.tl2').on('scroll.tl2', seek);
    $win.off('scrollPage').on('scrollPage', scrollPage);
    seek();

    function triggers() {
      let $text = $('#carousel-1 .carousel-text');
      let $slides = $('#carousel-1 .carousel-slides');
      let bounds = $('#carousel-1')[0].getBoundingClientRect();
      let carouselWidth = $slides[0].getBoundingClientRect().width;
      let winHeight = $win.height();
      let textTop = $text[0].getBoundingClientRect().top;
      let fixed = bounds.top <= 0;
      $slides.css('left', $win.width() - (Math.min(1, (bounds.top - winHeight  * 0.01) / (winHeight * 1.2 - bounds.height))) * carouselWidth);
      if (fixed && !$text.hasClass('fixed')) {
        $text.css({position: 'fixed', top: textTop});
        if (textTop < 1) {
          $text.animate({top: 0});
        }
      } else if (!fixed && $text.hasClass('fixed')) {
        $text.css({position: '', top: ''});
      }
      $text.toggleClass('fixed', fixed);
      $win.trigger('progress', 100 * $doc.scrollTop() / pageHeight);
    }

    function scrollPage(e, perc) {
      $doc.scrollTop(perc / 100 * pageHeight);
    }

    function seek() {
      timeline.seek($doc.scrollTop());
      triggers();
    }
  }
}

function zIndex() {
  let styles = [];
  for (var i = 1; i < 99; i++) {
    styles.push(`.z-${i}{z-index:${i};}`);
  }
  $('head').append('<style>' + styles.join('\n') + '</style>');
}
