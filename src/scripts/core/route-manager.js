import {setRoute} from 'setjs/kernel/setjs.js';
import storage, {storageTypes} from 'setjs/kernel/storage.js';
import eventManager from 'setjs/kernel/event-manager.js';
import pageLoader from 'setjs/kernel/page-loader.js';

function processRoute(route) {
  eventManager.route(route);
  pageLoader.handleRoute(route);
}

function allowRoute(route) {
  if (['login'].indexOf(route.pageId) >= 0 && storage.get(storageTypes.token)) {
    setRoute();
  } else {
    return 1;
  }
}

export default function handleRoute(route) {
  if (allowRoute(route)) {
    processRoute(route);
  }
}
