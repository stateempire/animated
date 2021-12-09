import {getLoader} from 'configurator/init.js';
import {dataVersion} from 'configurator/configs.js';

var history;

function getKey(name) {
  let prefix = getLoader().historyPrefix || '';
  return prefix + name;
}

export default function() {
  var index = localStorage.getItem(getKey('history-index'));
  var indexData = index ? JSON.parse(index) : 0;
  if (indexData && indexData.version != dataVersion) {
    localStorage.removeItem(getKey('history-index'));
    (Array.isArray(indexData) ? indexData : indexData.history || []).forEach(function(timestamp) {
      localStorage.removeItem('h-' + timestamp);
    });
    indexData = 0;
  }
  indexData = indexData || {history: []};
  history = indexData.history;
}

export function getHistory(_history) {
  var result = [];
  (_history || history).forEach(function(timestamp) {
    var itemStr = localStorage.getItem(getKey('h-' + timestamp));
    if (itemStr) {
      try {
        let historyItem = {time: new Date(timestamp).toLocaleString(), timedata: JSON.parse(itemStr)};
        historyItem.timedata.timestamp = timestamp;
        result.push(historyItem);
      } catch (e) {
        console.log(e);
        alert('Corrupt data. Please clear your local storage');
      }
    }
  });
  return result;
}

export function saveHistory() {
  var timedata = getLoader().getTimeData();
  var timestamp = history[0];
  var current = timestamp ? localStorage.getItem('h-' + timestamp) : 0;
  if (current != JSON.stringify(timedata)) {
    if (history.length > 100) {
      localStorage.removeItem(getKey('h' + history.pop()));
    }
    timedata = getLoader().getTimeData();
    timedata.timestamp = Date.now();
    history.unshift(timedata.timestamp);
    localStorage.setItem(getKey('history-index'), JSON.stringify({version: dataVersion, history}));
    localStorage.setItem(getKey('h-' + timedata.timestamp), JSON.stringify(timedata));
  }
}
