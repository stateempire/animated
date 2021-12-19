import anime from 'animejs';
import {debounce} from 'setjs/utility/calls.js';
import {roundNum} from 'setjs/utility/numbers.js';
import loader from 'app/loader.js';
import configInit from 'configurator/init.js';
import timeliner from 'helpers/timeliner.js';

$(function() {
  zIndex();
  fontSizes();
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
    let {timeline, scrollMax, targets} = timeliner($content, loader.getTimeData());
    let oldProgress = -1;
    $doc.off('.tl2').on('scroll.tl2', seek);
    $win.off('scrollPage').on('scrollPage', scrollPage);
    seek();

    function triggers() {
      let progress = 100 * $doc.scrollTop() / scrollMax;
      $win.trigger('progress', {progress, forward: progress > oldProgress, targets});
      oldProgress = progress;
    }

    function scrollPage(e, perc) {
      $doc.scrollTop(perc / 100 * scrollMax);
    }

    function seek() {
      timeline.seek($doc.scrollTop());
      triggers();
    }
  }

  function carouselProgress(e, opts) {
    let $slides = $('#carousel-slides-1');
    $slides.css('left', $('#carousel-1').width() - $slides.outerWidth() * opts.targets.carousel_slides_1.progress);
  }
}

function zIndex() {
  let styles = [];
  for (var i = 1; i < 99; i++) {
    styles.push(`.z-${i}{z-index:${i};}`);
  }
  $('head').append('<style>' + styles.join('\n') + '</style>');
}

function fontSizes() {
  $('head').append(`<style>${createSize('lg', 5)}${mediaSize('md', 4, 1024)}${mediaSize('sm', 3, 768)}${mediaSize('xs', 2, 594)}${mediaSize('xxs', 2, 480)}</style>`);

  function createSize(prefix, max) {
    let styles = [];
    for (var i = 0.9; i <= max; i = roundNum(i + 0.1, 1)) {
      styles.push(`.${prefix}-${('' + (i)).replace('.', '-')}{font-size:${i}rem;}`);
    }
    return styles.join('\n') + '\n';
  }

  function mediaSize(prefix, max, res) {
    return `@media only screen and (max-width: ${res}px) {\n${createSize(prefix, max)}\n}`;
  }
}
