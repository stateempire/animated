import {addFuncs} from 'core/acts-funcs.js';
import {makeLazy} from 'setjs/utility/lazy-media.js';

addFuncs({
  lazyImg: makeLazy('src'),
  lazyBg: makeLazy('bg'),
});
