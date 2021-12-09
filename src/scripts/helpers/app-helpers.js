export function addPath(path2d, str, points) {
  let path = '';
  let index = 0;
  for (var i = 0; i < str.length; i++) {
    let char = str[i];
    if (char == 'M' || char == 'L' || char == 'Z') {
      path += (char == 'Z' ? 'L' : char) + points.slice(index, index + 2).join(',');
      index += 2;
    } else if (char == 'C') {
      path += char + points.slice(index, index + 6).join(',');
      index += 6;
    }
  }
  if (!path2d) {
    return new Path2D(path);
  }
  path2d.addPath(new Path2D(path));
  return path2d;
}

export function plus(r, d, w) {
  return [
    {x: r - w, y: d},
    {x: r + w, y: d},
    {x: r + w, y: r - w},
    {x: 2 * r - d , y: r - w},
    {x: 2 * r - d , y: r + w},
    {x: r + w , y: r + w},
    {x: r + w , y:  2 * r - d},
    {x: r - w , y:  2 * r - d},
    {x: r - w , y:  r + w},
    {x: d , y:  r + w},
    {x: d , y:  r - w},
    {x: r - w, y:  r - w},
  ];
}

export function getWinWidth() {
  return window.innerWidth && document.documentElement.clientWidth ?
    Math.min(window.innerWidth, document.documentElement.clientWidth) :
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export function getWinHeight() {
  return window.innerHeight && document.documentElement.clientHeight ?
    Math.min(window.innerHeight, document.documentElement.clientHeight) :
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
