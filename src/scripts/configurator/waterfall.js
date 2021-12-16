import getComp from 'setjs/template/component.js';
import {getLoader} from 'configurator/init.js';
import {sort} from 'setjs/utility/array.js';
import {roundNum} from 'setjs/utility/numbers.js';

export default function showWaterfall() {
  let $win = $(window);
  var allAnims = getAnims();
  var waterfallComp = getComp('config/waterfall', {
    filterBy: 0,
    getAnims: function(data) {
      return data.filterBy ? allAnims.filter(x => x.target == data.filterBy) : allAnims;
    },
    rangeCss: function(anim, {$el}) {
      $el.css({left: anim.start + '%', width: (anim.end - anim.start) + '%'});
    },
  }, {
    changeStart: function({$el, data}) {
      var anims = waterfallComp.anims.list.map(x => x.data.anim);
      var dex = data.dex;
      var diff = $el.val() - anims[dex].start;
      for (var i = dex; i < anims.length; i++) {
        anims[i].start = anims[i].field.time[0] = roundNum(anims[i].start + diff, 2);
        anims[i].end = anims[i].field.time[1] = roundNum(anims[i].end + diff, 2);
        waterfallComp.anims.list[i].update();
      }
    },
    changeEnd: function({$el, data, comp}) {
      data.anim.end = data.anim.field.time[1] = Math.max(data.anim.start + 0.01, +$el.val());
      comp.update();
    },
    applyFilter: function({data}) {
      waterfallComp.data.filterBy = waterfallComp.data.filterBy ? 0 : data.anim.target;
      waterfallComp.renderList('anims');
      waterfallComp.update();
    },
    finish: function() {
      let ratio = 100 / maxEnd();
      allAnims.forEach(anim => {
        anim.start = anim.field.time[0] = roundNum(anim.start * ratio, 2);
        anim.end = anim.field.time[1] = roundNum(anim.end * ratio, 2);
      });
      waterfallComp.renderList('anims');
      $win.trigger('timeline');
    },
    expand: function() {
      allAnims.forEach(anim => {
        anim.start = anim.field[0] = roundNum(anim.start * 0.95, 2);
        anim.end = anim.field[1] = roundNum(anim.end * 0.95, 2);
      });
      waterfallComp.renderList('anims');
      $win.trigger('timeline');
    }
  });
  $('body').append(waterfallComp.$root).addClass('panel-open');

  function maxEnd() {
    let end = 0;
    allAnims.forEach(anim => {
      end = Math.max(end, anim.end);
    });
    return end || 100;
  }
}

function getAnims() {
  var timedata = getLoader().getTimeData();
  var anims = [];
  addAnims(timedata.dom);
  addAnims(timedata.obj);
  return sort(anims, 'start');

  function addAnims(list, type) {
    list.forEach(function(target) {
      anims = anims.concat(target.fields.filter(x => x.time).map(field => {
        return {
          type,
          start: field.time[0],
          end: field.time[1],
          field,
          target,
        };
      }));
    });
  }
}
