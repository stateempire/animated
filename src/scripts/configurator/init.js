import {setDefData} from 'setjs/kernel/basics.js';
import {ensureTemplates} from 'setjs/template/templates.js';
import {loadAssets} from 'setjs/utility/assets.js';
import {batchCall} from 'setjs/utility/calls.js';
import initialiseSetjs from 'core/setjs-init.js';

import 'setjs/plugins/template-funcs/basic-filters.js';
import 'setjs/plugins/template-funcs/misc.js';
import 'setjs/plugins/template-funcs/debug.js';
import 'setjs/plugins/misc/dropdown-menu.js';

import 'configurator/funcs.js';
import 'configurator/waterfall.js';
import 'configurator/menu.js';

import initHistory from 'configurator/history.js';
import player from 'configurator/player.js';
import easings from 'configurator/easings.js';
import launch from 'configurator/launch.js';

var loader;

export function getLoader() {
  return loader;
}

export default function(_loader, cb) {
  loader = _loader;
  initHistory();
  initialiseSetjs();
  setDefProps();
  batchCall({
    success: function() {
      player();
      launch();
      cb();
    },
  })
  .add(ensureTemplates, {urls: ['/templates/configurator.html?t=' + Date.now()]})
  .add(loadAssets, {urlSets: [['/styles/configurator.css']]})
  .go();
}

function setDefProps() {
  setDefData('easings', easings);
}


