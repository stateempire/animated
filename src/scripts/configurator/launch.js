import getComp from 'setjs/template/component.js';

export default function() {
  var launchComp = getComp('configurator-launch');
  $('body').append(launchComp.$root);
}
