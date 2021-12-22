import homeData from 'data/home.json';
import getComp from 'setjs/template/component.js';
import {debounce} from 'setjs/utility/calls.js';
import timeliner from 'helpers/timeliner.js';

export default {
  templates: ['site/home'],
  loaded: function({pageComp}) {
    $win.on('resize.home timeline.home', debounce(setupTimeline));
    $win.on('progress.home', carouselProgress);
    setupTimeline();

    function setupTimeline() {
      let {timeline, scrollMax, targets} = timeliner(pageComp.$root, homeData);
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
  },
  comp: function() {
    return getComp('site/home');
  }
};
