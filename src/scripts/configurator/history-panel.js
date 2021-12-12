import getComp from 'setjs/template/component.js';
import {getLoader} from 'configurator/init.js';
import {getHistory} from 'configurator/history.js';

export default function() {
  var compData = {
    history: getHistory(),
    targetCount: function(targets) {
      return targets.reduce((n, x) => {
        if (Array.isArray(x.fields)) {
          n += x.fields.length;
        }
        return n;
      }, 0);
    },
  };
  var historyComp = getComp('config/history', compData, {
    applyHistory: function(opts) {
      getLoader().setTimeData(opts.data.item.timedata);
      historyComp.$root.find('.close-btn')[0].click();
    },
  });
  $('body').append(historyComp.$root).addClass('panel-open');
}
