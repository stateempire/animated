import anime from 'animejs';
import {getWinWidth, getWinHeight} from 'helpers/app-helpers.js';

let cssProps = ['top', 'left', 'opacity', 'fontSize', 'transform', 'width', 'height'];

export default function($container, timedata) {
  let winWidth = getWinWidth();
  let winHeight = getWinHeight();
  let objTargets = {};
  let time = (timedata.pages * winHeight) - winHeight;
  let timeline = anime.timeline({
    duration: time,
    autoplay: false,
    easing: 'linear',
  });
  $container.css('height', time);

  timedata.obj.forEach(function(target) {
    createTargets(target.fields, 0, objTargets[target.el] = {});
  });

  timedata.dom.forEach(function(target) {
    let $el = $(target.el);
    cssProps.forEach(function(prop) {
      $el.css(prop, '');
    });
    createTargets(target.fields, $el);
  });

  return {timeline, pageHeight: time};

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
      if (field.time) {
        item.targets = animObj || $el.toArray();
        item.duration = (field.time[1] - field.time[0]) / 100 * time;
        timeline.add(item, (field.time[0]) / 100 * time);
        if (animObj) {
          animObj.start = Math.min(field.time[0], animObj.start == undefined ? 100 : animObj.start);
          animObj.end = Math.max(field.time[1], animObj.end == undefined ? 0 : animObj.end);
        }
      } else if ($el) {
        let css = {};
        let transform = '';
        cssProps.forEach(function(prop) {
          if (prop in item) {
            css[prop] = item[prop][0] === undefined ? item[prop] : item[prop][0];
          }
        });
        if ('translateX' in item) {
          transform = 'translateX(' + item.translateX[0] +')';
        }
        if ('translateY' in item) {
          transform += (transform ? ' ' : '') + 'translateY(' + item.translateY[0] + ')';
        }
        if ('scale' in item) {
          transform += (transform ? ' ' : '') + 'scale(' + item.scale[0] + ')';
        }
        if (transform) {
          css.transform = transform;
        }
        $el.css(css);
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
