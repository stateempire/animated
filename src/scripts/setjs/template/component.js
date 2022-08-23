import {fatal} from 'setjs/kernel/basics.js';
import setjs from 'setjs/kernel/setjs.js';
import {applyBindings, processIf, applyWatch, cleanupWatch} from 'setjs/template/binding.js';
import {bindEvents} from 'setjs/template/events.js';
import {storeItemByName, dataAttrFind, dataAttrFunc} from 'setjs/utility/comp-helpers.js';
import {configData, getConfigTemplate, tmpStr} from 'setjs/template/template-config.js';
import {getTemplate} from 'setjs/template/templates.js';
import {func} from 'core/acts-funcs.js';

function processSlot($item, comp, data, config) {
  let rd = comp.rComp && comp.rComp.data || data;
  let template = (config.tf && (rd[config.tf] || func(config.tf))(config, comp, data)) || getConfigTemplate('slot', config);
  let slotComp = createComponent(template, configData(config, data), comp.actions, comp);
  let $named;
  $item.empty();
  if (slotComp) {
    storeItemByName(comp, config.name, slotComp);
    if (config.replace) {
      $item.replaceWith(slotComp.$root);
      $named = slotComp.$root;
    } else {
      $item.append(slotComp.$root);
      $named = $item;
    }
  } else if (config.replace) {
    $item.remove();
  }
  if (comp['$' + config.name]) {
    comp['$' + config.name] = $named;
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
  if (config.name) {
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
  var template = !config.tf && getConfigTemplate('list', config, $el.data('tname'));
  var listData = $.extend({$el, c: config, t: template, i: 'index', k: 'key', v: 'val', d: 'dex'}, config.vars);
  storeItemByName(comp, config.name, listData);
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
  var slots = {};
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
      let slot = slots[name];
      let slotComp = comp[name];
      delete comp[name];
      processSlot(slot.$item, comp, data, slot.config);
      if (slot.config.replace) {
        slot.$item = comp[name].$root;
      }
      setjs.compUpdate(comp[name].$root);
      slotComp && cleanupWatch(slotComp.data);
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
    let config = $item.data('slot') || $item.data('list');
    if (config) {
      config.name = name;
    }
    name = '$' + name;
    if (comp[name]) {
      fatal('Repeat name', name);
    }
    comp[name] = $item;
  });
  // You cannot call dataAttrFunc() after this, as this might add items which can affect the selection
  dataAttrFunc($root, 'slot', function($item, config) {
    config.t = $item.data('tname');
    processSlot($item, comp, data, config);
    if (config.name) {
      slots[config.name] = {config, $item: config.replace ? comp[config.name].$root : $item};
    }
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
