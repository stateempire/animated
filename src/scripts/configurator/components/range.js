import getComp from 'setjs/template/component.js';
import {roundNum} from 'setjs/utility/numbers.js';

export default function(opts) {
  let {$el, update, list, min, max, grow_by = 0, step = 0.1, double, decimals = 2} = opts;
  let restrict = opts.double ? opts.restrict : 0;
  let range = max - min;
  let rangeData = setupData({double, list, round});
  let rangeComp = getComp('config/range', rangeData, {
    change: function({$el, arg}) {
      let val = +$el.val();
      list[arg] = roundNum(val, decimals);
      setRange(arg, val);
      setupData(rangeData);
      update(val, +arg, opts);
    }
  });
  $el.append(rangeComp.$root);

  function setRange(arg, val) {
    if (arg) {
      max = Math.max(val, opts.max);
    } else {
      min = Math.min(val, opts.min);
    }
    range = max - min;
  }

  function setupData(data) {
    data.low_val = (list[0] - min) / range * 100;
    data.low_min = min - grow_by;
    data.low_max = restrict ? list[1] - step : max;
    if (double) {
      data.high_val = (list[1] - min) / range * 100;
      data.high_min = restrict ? list[0] + step : min;
      data.high_max = max + grow_by;
    }
    return data;
  }

  function round(num) {
    return roundNum(num, decimals);
  }
}
