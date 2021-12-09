import getComp from 'setjs/template/component.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

export default function() {
  var comp = getComp('common/footer');
  $('#main-content').after(comp.$root);
  eventManager.addListener(eventTypes.route, 'footer', comp.update, null);
}
