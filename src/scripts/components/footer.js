import getComp from 'setjs/template/component.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

export default function() {
  var comp = getComp('common/footer');
  $('#footer-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.route, 'footer', comp.update, null);
}
