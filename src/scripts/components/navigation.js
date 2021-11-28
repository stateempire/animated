import getComp from 'setjs/template/component.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

export default function() {
  var comp = getComp('common/navigation');
  $('#nav-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.route, 'nav', comp.update, null);
}
