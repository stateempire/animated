export function getQsMap(opts) {
  var {names, sep, values} = opts || {};
  var pairs = (window.location.href.split('?')[1] || '').split('&');
  var result = {};
  pairs.forEach(function(pair) {
    var [name, value] = pair.split('=');
    name = decodeURIComponent(name);
    value = decodeURIComponent(value);
    if (name && value) {
      value = sep ? value.split(sep) : value;
      result[name] = value;
    }
  });
  if (names) {
    Object.keys(result).forEach(key => {
      if (names.indexOf(key) < 0) {
        delete result[key];
      }
    });
  }
  if (values) {
    Object.keys(result).forEach(key => {
      if (values[key] && values[key].indexOf(result[key]) < 0) {
        delete result[key];
      }
    });
  }
  return result;
}

export function getQs(name, opts) {
  return getQsMap(opts)[name] || '';
}

export function makeQs(params, question) {
  var qs = '';
  $.each(params, function(name, val) {
    var isArray = Array.isArray(val);
    if (val && (!isArray || val.length)) {
      qs += (qs ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(isArray ? val.join(',') : val);
    }
  });
  return (question && qs) ? '?' + qs : qs;
}

// Obsolete. now use this: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
// export function copyText(text) {
//   let $body = $('body');
//   let input = $('<input type="text">').val(text)[0];
//   $body.append(input);
//   input.select();
//   input.setSelectionRange(0, 99999);
//   document.execCommand('copy');
//   $(input).remove();
// }
