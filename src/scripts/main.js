import anime from 'animejs';
import {debounce} from 'setjs/utility/calls.js';
import loader from 'app/loader.js';
import configInit from 'configurator/init.js';
import timeliner from 'helpers/timeliner.js';

$(function() {
  zIndex();
  loader.init({timestamp: Date.now(), pages: 1.1, obj: [], dom: []});
  configInit(loader, function() {
    setTimeout(init, 2500);
  });
});

function init() {
  let $win = $(window);
  let $doc = $(document);
  $('.initial .pulse').removeClass('pulse');
  anime({
    scale: 40,
    opacity: 0,
    duration: 900,
    targets: '.initial',
    easing: 'linear',
    complete: function() {
      $('.initial').remove();
    }
  });
  setupTimeline();
  $doc.on('resize.tl timeline.tl', debounce(setupTimeline));

  function setupTimeline() {
    let {timeline, height} = timeliner($('#main-content'), loader.getTimeData());
    $doc.off('scroll.tl').on('scroll.tl', seek);
    $win.off('scrollPage').on('scrollPage', scrollPage);
    seek();

    function triggers() {
      $win.trigger('progress', 100 * $doc.scrollTop() / height);
    }

    function scrollPage(e, perc) {
      $doc.scrollTop(perc / 100 * height);
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
