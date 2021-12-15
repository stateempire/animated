const propList = [
  'opacity',
  'translateX',
  'translateY',
  'scale',
  'left',
  'top',
  'fontSize',
  'easing',
  'width',
  'height',
];

export const dataVersion = 5;

export function getRangeConfig(key) {
  if (key == 'opacity') {
    return {min: 0, max: 1};
  } else if (key == 'fontSize') {
    return {min: 1, max: 50};
  } else if (key == 'scale') {
    return {min: -50, max: 50};
  } else {
    return {min: -250, max: 250};
  }
}

export function hasUnits(key) {
  return 'translateX translateY left top fontSize width height'.indexOf(key) >= 0;
}

export function createItem(key) {
  var val = key == 'easing' ? 'linear' : getArr(key);
  if (hasUnits(key)) {
    return {key, val, unit: key == 'fontSize' ? 'rem' : '%'};
  } else {
    return {key, val};
  }
}

export function getUnits(key) {
  if (key == 'fontSize') {
    return ['rem', 'em', 'px'];
  } else {
    return ['%', 'vw', 'vh', 'rem', 'em', 'px'];
  }
}

export function getProps() {
  return propList.map(x => { return {value: x, txt: x}; });
}

function getArr(key) {
  if (key == 'fontSize') {
    return [2, 10];
  } else if (key == 'scale') {
    return [1, 10];
  } else if (key == 'opacity') {
    return [0.5, 1];
  } else if (key == 'width' || key == 'height') {
    return [100, 200];
  } else {
    return [0, 50];
  }
}
