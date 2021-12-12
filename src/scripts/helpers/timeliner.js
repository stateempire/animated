import anime from 'animejs';
import {getWinWidth, getWinHeight} from 'helpers/app-helpers.js';

export default function($container, timedata) {
  let winWidth = getWinWidth();
  let winHeight = getWinHeight();
  let objTargets = {};
  let time = timedata.pages * winHeight;
  let timeline = anime.timeline({
    duration: time,
    autoplay: false,
    easing: 'linear',
  });
  $container.css('height', time + winHeight);

  timedata.obj.forEach(function(target) {
    createTargets(target.fields, 0, objTargets[target.el.replaceAll('-', '_')] = {});
  });

  timedata.dom.forEach(function(target) {
    createTargets(target.fields, $(target.el));
  });

  return {timeline, pageHeight: time, targets: objTargets};

  function createTargets(fields, $el, animObj) {
    fields.filter(field => ((field.browser || -1) & getBrowserFlag(winWidth))).forEach(function(field) {
      let item = {};
      field.list.forEach(function(config) {
        let unit = config.unit || 0;
        item[config.key] = Array.isArray(config.val) ? config.val.slice().map(x => x + unit) : isNaN(config.val) ? config.val : config.val + unit;
        if (animObj) {
          animObj[config.key] = Array.isArray(config.val) ? config.val[0] : config.val;
        }
      });
      item.targets = animObj || $el.toArray();
      item.duration = (field.time[1] - field.time[0]) / 100 * time;
      timeline.add(item, (field.time[0]) / 100 * time);
      if (animObj) {
        animObj.start = Math.min(field.time[0], animObj.start || 100);
        animObj.end = Math.max(field.time[1], animObj.end || 0);
      }
    });
  }
}

function getBrowserFlag(winWidth) {
  if (winWidth <= 720) {
    return 1;
  } else if (winWidth <= 1024) {
    return 2;
  }
  return 4;
}
