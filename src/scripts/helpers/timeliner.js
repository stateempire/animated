import anime from 'animejs';
import {getWinHeight} from 'helpers/app-helpers.js';
import {getVal} from 'setjs/utility/array.js';

export default function($container, timedata) {
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
    createTargets(target, 0, objTargets[target.el] = {});
  });

  timedata.dom.forEach(function(target) {
    createTargets(target, $(target.el));
  });

  return {timeline, scrollMax: time, targets: objTargets};

  function createTargets(target, $el, animObj) {
    targetFields(target).filter(field => ((field.browser || -1) & getBrowserFlag($container.width()))).forEach(function(field) {
      let item = {};
      let listItems = field.list.filter(x => x.key != 'sequence');
      if (!listItems.length) return;
      listItems.forEach(function(config) {
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

  function targetFields(target) {
    let fields = [];
    target.fields.forEach(function(field) {
      fields.push(field);
      field.list.forEach(function(item) {
        if (item.key == 'sequence') {
          let seqFields = getVal(timedata.sequences, item.val, 'el').fields;
          let mul = (field.time[1] - field.time[0]) / 100;
          seqFields.forEach(function(sField) {
            fields.push({
              time: [field.time[0] + sField.time[0] * mul, field.time[0] + sField.time[1] * mul],
              list: sField.list,
            });
          });
        }
      });
    });
    return fields;
  }
}

function getBrowserFlag(containerWidth) {
  if (containerWidth <= 720) {
    return 1;
  } else if (containerWidth <= 1024) {
    return 2;
  }
  return 4;
}
