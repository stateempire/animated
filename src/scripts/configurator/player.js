import anime from 'animejs';
import {setDefData} from 'setjs/kernel/basics.js';
import {addAction} from 'core/acts-funcs.js';
import {getLoader} from 'configurator/init.js';
import {getWinHeight} from 'helpers/app-helpers.js';

var previous;

export default function() {
  setDefData('animPlaying', false);
}

function playTimeline(start, end) {
  var height = getLoader().getTimeData().pages * getWinHeight();
  var target = {time: start};
  var duration = end - start;
  $(window).trigger('timeline');

  return {
    target,
    anim: anime({
      targets: target,
      time: end,
      duration: height * duration / 100,
      easing: 'linear',
      complete: function() {
        setDefData('animPlaying', false);
        previous = 0;
      },
      update: function() {
        $(window).trigger('scrollPage', target.time);
      }
    }),
  };
}

addAction('toggleAnim', function(opts) {
  var full = opts.data.field ? 0 : 100;
  setDefData('animPlaying', !previous);
  if (previous) {
    previous.anim.remove(previous.target);
    previous = 0;
  } else {
    previous = playTimeline(full ? 0 : opts.data.field.time[0], full || opts.data.field.time[1]);
  }
});
