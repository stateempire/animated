import {updateWatches} from 'setjs/template/binding.js';
import {addAction} from 'core/acts-funcs.js';
import {saveHistory} from 'configurator/history.js';
import showTimeline from 'configurator/timeline-panel.js';
import showHistory from 'configurator/history-panel.js';
import showWaterfall from 'configurator/waterfall.js';
import {getLoader} from 'configurator/init.js';

export default function() {
  $(window).on('timeline', displayTime).on('progress', currentTime);
  displayTime();
}

function displayTime() {
  $('#data-time').text(new Date(getLoader().getTimeData().timestamp).toLocaleString());
}

function currentTime(e, progress) {
  $('#current-time').text(progress.toFixed(1));
}

function createDownloadUrl() {
  return URL.createObjectURL(new Blob([JSON.stringify(getLoader().getTimeData(1), null, 2)], {
    type: 'text/json;encoding:utf-8',
  }));
}

function download({comp}) {
  comp.$downloadBtn.attr({download: Date.now() + '.json', href: createDownloadUrl()})[0].click();
}

function close() {
  $('.side-panel, .waterfall').remove();
  $('body').removeClass('panel-open');
  updateWatches();
}

function panelFunc(func) {
  return function() {
    close();
    func();
  };
}

addAction('close', close);
addAction('download', download);
addAction('saveHistory', function() {
  saveHistory();
  displayTime();
});

addAction('showTimeline', panelFunc(showTimeline));
addAction('showHistory', panelFunc(showHistory));
addAction('showWaterfall', panelFunc(showWaterfall));

addAction('import', function({e}) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    getLoader().setTimeData(JSON.parse(e.target.result));
  };
  reader.readAsText(file);
});



