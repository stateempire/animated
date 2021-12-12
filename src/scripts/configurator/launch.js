import getComp from 'setjs/template/component.js';

export default function() {
  var launchComp = getComp('config/launch');
  $('body').append(launchComp.$root);
}
