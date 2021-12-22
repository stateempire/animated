import {roundNum} from 'setjs/utility/numbers.js';

let zIndexes = [];

for (var i = 1; i < 99; i++) {
  zIndexes.push(`.z-${i}{z-index:${i};}`);
}

$('head').append('<style>' + zIndexes.join('\n') + '</style>');
$('head').append(`<style>${createSize('lg', 5)}${mediaSize('md', 4, 1024)}${mediaSize('sm', 3, 768)}${mediaSize('xs', 2, 594)}${mediaSize('xxs', 2, 480)}</style>`);

function createSize(prefix, max) {
  let sizes = [];
  for (var i = 0.9; i <= max; i = roundNum(i + 0.1, 1)) {
    sizes.push(`.${prefix}-${('' + (i)).replace('.', '-')}{font-size:${i}rem;}`);
  }
  return sizes.join('\n') + '\n';
}

function mediaSize(prefix, max, res) {
  return `@media only screen and (max-width: ${res}px) {\n${createSize(prefix, max)}\n}`;
}
