import timedata from 'data/timeline-1.json';

export default {
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
