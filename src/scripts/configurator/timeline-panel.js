import getComp from 'setjs/template/component.js';
import {storeValue} from 'setjs/utility/objects.js';
import {getLoader} from 'configurator/init.js';
import {getRangeConfig, createItem, hasUnits, getUnits, getProps} from 'configurator/configs.js';
import createRange from 'configurator/components/range.js';
import {removeFromListByValue} from 'setjs/utility/array.js';

export default function editor() {
  let $win = $(window);
  let timedata = getLoader().getTimeData();
  let compData = {
    timedata,
    hasUnits,
    getUnits,
    getProps: function(list) {
      var props = getProps();
      list.forEach(function(item) {
        removeFromListByValue(props, item.key, 'value');
      });
      return props;
    },
    pagesRange: function(v, {$el}) {
      var pages = timedata.pages;
      createRange({
        $el,
        list: [pages],
        min: 1,
        max: 100,
        decimals: 0,
        update: function(val) {
          changeValue('pages', val);
        }
      });
    },
    setupRange: function(item, {$el}, time, prop) {
      let config = $el.data('arg') || getRangeConfig(item.key);
      config.double = time;

      createRange($.extend({
        $el,
        list: item[prop || 'val'],
        update: function(val) {
          $win.trigger('timeline');
          if (prop == 'time') {
            $win.trigger('scrollPage', val);
          }
        }
      }, config));
    },
  };
  var editorComp = getComp('timeline-panel', compData, {
    addProp: function({$el, data, comp}) {
      data.pd.field.list.push(createItem(data.prop.value));
      $el.hide();
      comp.pComp.renderList('list');
    },
    addFields: function({data, arg, comp}) {
      if (arg == 'css') {
        timedata.targets[data.dex].fields.unshift({list: []});
      } else {
        timedata.targets[data.dex].fields.push({time: [0, 10], list: []});
      }
      comp.renderList('fields');
    },
    removeField: function({data, comp}) {
      timedata.targets[data.pd.dex].fields.splice(data.dex, 1);
      comp.pComp.renderList('fields');
      $win.trigger('timeline');
    },
    removeProp: function({comp, data}) {
      data.pd.field.list.splice(data.dex, 1);
      comp.pComp.renderList('list', 'props');
    },
    toggleBrowser: function({$el, comp, data, arg}) {
      let currentVal = data.field.browser || 0;
      arg = +arg;
      if ($el.hasClass('on')) {
        data.field.browser = currentVal ^ arg;
      } else {
        data.field.browser = currentVal | arg;
      }
      if (!data.field.browser) {
        delete data.field.browser;
      }
      comp.update(comp.$root.find('.bit-flag'));
      $win.trigger('timeline');
    },
    toggleView: function({comp}) {
      comp.$root.toggleClass('open');
      // comp.$root.siblings().removeClass('open');
    },
    valChange: function({$el, arg}) {
      changeValue(arg, $el.val());
    },
    easingChange: function(opts) {
      opts.data.item.val = opts.$el.val();
    },
  });

  $('body').append(editorComp.$root).addClass('panel-open');

  function changeValue(path, val) {
    storeValue(timedata, path, val);
    $win.trigger('timeline');
  }
}
