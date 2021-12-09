import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  hasProp: function(parent, opts, prop) {
    return prop in parent;
  },
  isArray: function(val) {
    return Array.isArray(val);
  },
  perc: function(val) {
    return val + '%';
  }
});
