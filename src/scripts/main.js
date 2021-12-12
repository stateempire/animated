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
  $win.on('resize.tl1 timeline.tl1', debounce(setupTimeline));
  $win.on('progress', carouselProgress);

  setupTimeline();

  function setupTimeline() {
    let {timeline, pageHeight, targets} = timeliner($content, loader.getTimeData());
    let oldProgress = -1;
    $doc.off('.tl2').on('scroll.tl2', seek);
    $win.off('scrollPage').on('scrollPage', scrollPage);
    seek();

    function triggers() {
      let progress = 100 * $doc.scrollTop() / pageHeight;
      $win.trigger('progress', {progress, forward: progress > oldProgress, targets});
      oldProgress = progress;
    }

    function scrollPage(e, perc) {
      $doc.scrollTop(perc / 100 * pageHeight);
    }

    function seek() {
      timeline.seek($doc.scrollTop());
      triggers();
    }
  }

  function carouselProgress(e, opts) {
    let $slides = $('#carousel-slides-1');
    $slides.css('left', $win.width() - $slides.outerWidth() * opts.targets.carousel_slides_1.progress);
  }
}

function zIndex() {
  let styles = [];
  for (var i = 1; i < 99; i++) {
    styles.push(`.z-${i}{z-index:${i};}`);
  }
  $('head').append('<style>' + styles.join('\n') + '</style>');
}
