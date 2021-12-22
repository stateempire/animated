import getComp from 'setjs/template/component.js';
import {storeValue} from 'setjs/utility/objects.js';
import {getLoader} from 'configurator/init.js';
import {getRangeConfig, createItem, hasUnits, getUnits, getProps} from 'configurator/configs.js';
import createRange from 'configurator/components/range.js';
import {removeFromListByValue} from 'setjs/utility/array.js';
import alertBox from 'setjs/ui/alert-box';

export default function editor() {
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
    slotData: function(_, {target_prop}) {
      return {items: timedata[target_prop], target_prop};
    },
  };
  var editorComp = getComp('config/timeline', compData, {
    tabClick: function({$el}) {
      $el.addClass('active');
      $el.siblings().removeClass('active');
      editorComp.$root.find('.tabs .tab').addClass('hide').eq($el.index()).removeClass('hide');
    },
    addProp: function({$el, data, comp}) {
      data.pd.field.list.push(createItem(data.prop.value));
      $el.hide();
      comp.pComp.renderList('list');
    },
    addItem: function({$el, comp, arg, end}) {
      end();
      timedata[arg].push({el: $el.find('input').val(), fields: []});
      comp.renderList('targets');
      $el.find('input').val('');
    },
    removeItem: function({comp, data}) {
      alertBox({
        title: data.target.el,
        okTxt: 'Delete',
        noClose: 0,
        message: 'Are you sure you want to delete ' + data.target.el + '?',
        ok: function(lightbox) {
          data.pd.items.splice(data.dex, 1);
          comp.pComp.renderList('targets');
          lightbox.close();
          $win.trigger('timeline');
        }
      });
    },
    addField: function({data, comp}) {
      data.target.fields.push({time: [0, 10], list: []});
      comp.renderList('fields');
      comp.update();
    },
    removeField: function({data, comp}) {
      data.pd.target.fields.splice(data.dex, 1);
      comp.pComp.renderList('fields');
      comp.pComp.update();
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
    unitChange: function(opts) {
      opts.data.item.unit = opts.$el.val();
      $win.trigger('timeline');
    },
    valChange: function(opts) {
      opts.data.item.val = opts.$el.val();
      $win.trigger('timeline');
    },
  });

  createRange({
    $el: editorComp.$speedRange,
    list: [101 - timedata.pages],
    min: 1,
    max: 100,
    decimals: 0,
    update: function(val) {
      changeValue('pages', 101 - val);
    }
  });

  $('body').append(editorComp.$root).addClass('panel-open');

  function changeValue(path, val) {
    storeValue(timedata, path, val);
    $win.trigger('timeline');
  }
}
