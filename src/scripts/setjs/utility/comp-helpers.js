import {fatal} from 'setjs/kernel/basics.js';

export function storeItemByName(comp, name, item) {
  if (name) {
    if (comp[name]) {
      fatal('Repeat name', name);
    }
    comp[name] = item;
  }
}

export function dataAttrFunc($el, dataName, func, excludeSelf) {
  dataAttrFind($el, dataName, excludeSelf).each(function(i, item) {
    var $item = $(item);
    func($item, $item.data(dataName));
  });
}

export function dataAttrFind($el, dataName, excludeSelf) {
  dataName = '[data-' + dataName + ']';
  return excludeSelf ? $el.find(dataName) : $el.find(dataName).addBack(dataName);
}
