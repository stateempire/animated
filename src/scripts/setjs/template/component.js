import {fatal} from 'setjs/kernel/basics.js';
import setjs from 'setjs/kernel/setjs.js';
import {applyBindings, processIf, applyWatch, cleanupWatch} from 'setjs/template/binding.js';
import {bindEvents} from 'setjs/template/events.js';
import {storeItemByName, dataAttrFind, dataAttrFunc} from 'setjs/utility/comp-helpers.js';
import {configData, getConfigTemplate, tmpStr} from 'setjs/template/template-config.js';
import {getTemplate} from 'setjs/template/templates.js';
import {func} from 'core/acts-funcs.js';

function processSlot($item, comp, data, slotConfig, forceReplace) {
  let slotComp = createComponent(getConfigTemplate('slot', slotConfig), configData(slotConfig, data), comp.actions, comp);
  $item.empty();
  if (slotComp) {
    slotComp.$root.data('slotConfig', slotConfig);
    storeItemByName(comp, slotConfig.name || $item.data('name'), slotComp);
    if (slotConfig.replace || forceReplace) {
      $item.replaceWith(slotComp.$root);
    } else {
      $item.append(slotComp.$root);
    }
  } else if (slotConfig.replace) {
    $item.remove();
  }
}

function renderList(comp, data, listData) {
  var config = listData.c;
  var oldList = listData.list;
  var index = 0;
  var list = listData.list = [];
  var rd = comp.rComp && comp.rComp.data || data;
  listData.$el.empty();
  $.each(configData(config, data), appendItem);
  if (!list.length && (config.alt || config.sub)) {
    listData.$el.append(createComponent(getTemplate(config.alt, config.sub), $.extend({rd, pd: data}, listData), comp.actions, comp).$root);
  }
  listData.$elements = listData.$el.children();
  oldList && oldList.forEach(comp => {
    cleanupWatch(comp.data);
  });
  if (listData.name) {
    listData.append = function(items) {
      $.each(items, function(key, val) {
        appendItem(key, val, 1);
      });
      listData.$elements = listData.$el.children();
    };
  }

  function appendItem(key, val, compUpdate) {
    var itemData = {
      [listData.d]: index,
      [listData.i]: ++index,
      [listData.k]: key,
      [listData.v]: val,
      c: config,
      pd: data,
      rd: rd,
    };
    var itemComp = createComponent((config.tf && (rd[config.tf] || func(config.tf))(itemData, comp, listData)) || listData.t, itemData, comp.actions, comp);
    if (itemComp) {
      listData.$el.append(itemComp.$root);
      list.push(itemComp);
      compUpdate && setjs.compUpdate(itemComp.$root);
    }
  }
}

function createList($el, comp, data) {
  var config = $el.data('list');
  var template = $el.data('tname') && getConfigTemplate('list', config, $el.data('tname'));
  var listData = $.extend({name: config.name || $el.data('name'), $el, c: config, t: template, i: 'index', k: 'key', v: 'val', d: 'dex'}, config.vars);
  storeItemByName(comp, listData.name, listData);
  renderList(comp, data, listData);
}

/**
 * Builds a template
 * @param {Object} templateStr - The template html string
 * @param {Object} pComp - The parent component (if any)
 * @param {Object} data - component data
 * @param {Object} actions - event handlers
 * @return {Object} returns the compiled template
 */
function createComponent(templateStr, data, actions, pComp) {
  var $root, tmpRoot, $watchElements, $bindingElements, $actElements, $listElements, comp;
  data = data || {};
  actions = actions || {};
  $root = $(tmpStr(templateStr, data));
  comp = {
    data,
    actions,
    rComp: pComp && pComp.rComp || pComp,
    pComp,
    update: function($selection) {
      if (!($selection && $selection.jquery)) {
        $selection = $bindingElements;
      }
      $selection.each(function(i, el) {
        applyBindings($(el), comp, data);
      });
      setjs.compUpdate($selection);
    },
    renderSlot: function(name) {
      let slotComp = comp[name];
      if (slotComp) {
        delete comp[name];
        processSlot(slotComp.$root, comp, data, slotComp.$root.data('slotConfig'), 1);
        setjs.compUpdate(comp[name].$root);
        cleanupWatch(slotComp.data);
      }
    },
    renderList: function() {
      $.each(arguments, function(i, name) {
        if (comp[name]) {
          renderList(comp, data, comp[name]);
          setjs.compUpdate(comp[name].$el);
        }
      });
  }};
  if ($root.length > 1) {
    tmpRoot = 1;
    $root = $('<div>').append($root);
  } else if ($root.data('if') && processIf($root, comp, data, $root.data('if'))) {
    return;
  }
  dataAttrFunc($root, 'if', function($item, dataIf) {
    processIf($item, comp, data, dataIf);
  }, 1);
  if (tmpRoot) {
    $root = $root.children();
  }
  if (!$root.length) {
    return;
  }
  dataAttrFunc($root, 'src', function($item, src) {
    $item.attr('src', src);
  });
  dataAttrFunc($root, 'val', function($item, val) {
    $item.attr('value', val);
  });
  comp.$root = $root.data('comp', comp);
  $watchElements = dataAttrFind($root, 'watch');
  $bindingElements = dataAttrFind($root, 'bind');
  $actElements = dataAttrFind($root, 'act');
  $listElements = dataAttrFind($root, 'list');
  dataAttrFunc($root, 'name', function($item, name) {
    name = '$' + name;
    if (comp[name]) {
      fatal('Repeat name', name);
    }
    comp[name] = $item;
  });
  // You cannot call dataAttrFunc() after this, as this might add items which can affect the selection
  dataAttrFunc($root, 'slot', function($item, slotConfig) {
    processSlot($item, comp, data, slotConfig);
  });
  $listElements.each(function(i, item) {
    createList($(item), comp, data);
  });
  $bindingElements.each(function(i, item) {
    applyBindings($(item), comp, data);
  });
  $watchElements.each(function(i, item) {
    applyWatch($(item), comp, data);
  });
  $actElements.each(function(i, item) {
    bindEvents($(item), comp, data, actions);
  });
  !pComp && setjs.compUpdate($root);
  return comp;
}

export default function(templateName, data, actions, pComp) {
  return createComponent(getTemplate(templateName), data, actions, pComp);
}
