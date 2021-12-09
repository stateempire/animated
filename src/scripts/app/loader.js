var timedata;

export default {
  init,
  getTimeData,
  setTimeData,
  historyPrefix: 'anim1-',
};

export function setTimeData(td) {
  timedata = td;
  $(window).trigger('timeline');
}

export function getTimeData() {
  return timedata;
}

function init(timejson) {
  timedata = timejson;
  timedata.pages = Math.max(1, Math.min(timedata.pages, 100)) || 1;
}
