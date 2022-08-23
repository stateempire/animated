import {fatal} from 'setjs/kernel/basics.js';
import {dataAttrFunc} from 'setjs/utility/comp-helpers.js';

var templates = {};
var doneUrls = {};
var tId = 1;

export function ensureTemplates({urls = [], success, error}) {
  var done = 0;
  urls = urls.filter(url => !doneUrls[url]);
  if (!urls.length) {
    success();
  }
  urls.forEach(function(url) {
    $.get(url)
      .done(function(templateStr) {
        !doneUrls[url] && loadTemplates(templateStr);
        doneUrls[url] = true;
        if (++done == urls.length) {
          success();
        }
      })
      .fail(error);
  });
}

function extractHtml($el) {
  var elHtml = $el.html();
  var config = $el.data('list') || $el.data('slot');
  let tName = config.t;
  if (!tName && !config.tf) {
    tName = 't_' + tId++;
    templates[tName] = elHtml;
  }
  $el.attr('data-tname', tName).empty();
}

function inlineTemplates($parent) {
  var selector = '[data-list], [data-slot]';
  var $children = $parent.find(selector);
  var tree = [];
  if ($children.length) {
    $children.each(function(index, el) {
      var $el = $(el);
      var depth = $el.parents(selector).length;
      tree[depth] = tree[depth] || [];
      tree[depth].push($el);
    });
    tree.reverse().forEach(function(branch) {
      branch.forEach(extractHtml);
    });
  }
  $parent = $parent.filter(selector);
  $parent.length && extractHtml($parent);
}

export function loadTemplates(templateStr) {
  var $html = $(templateStr);
  dataAttrFunc($html, 'template', function($item, name) {
    if (templates[name]) {
      fatal('Template exists', name);
    }
    inlineTemplates($item);
    templates[name] = $item[0].outerHTML;
  });
}

export function getTemplate(templateName, alt) {
  if (templates[templateName] || alt) {
    return templates[templateName] || alt;
  } else {
    fatal('No such template', templateName);
  }
}
