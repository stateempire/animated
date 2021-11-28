import {getProp} from 'setjs/utility/objects.js';
import pageLoader from 'setjs/kernel/page-loader.js';
import storage, {storageTypes} from 'setjs/kernel/storage.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import setup from 'config/setup.js';

export let api = {};
let isLoading = 0;

eventManager.addListener(eventTypes.route, 'body', function() {
  $('body').removeClass('loading');
});

export function addApis(apis) {
  Object.keys(apis).forEach(function(key) {
    if (api[key]) {
      throw key + ' is already defined in api-helper.';
    }
  });
  $.extend(api, apis);
}

export function dataGet(url, opts) {
  ajaxCall($.extend({useData: 1}, opts, {type: 'GET', relativeUrl: url}));
}

export function dataFunc(url) {
  return function(opts) {
    dataGet(typeof url == 'string' ? url : url(opts), opts);
  };
}

export function jsonSave(url, type, opts) {
  ajaxCall($.extend({isJSON: 1}, opts, {type, relativeUrl: url}));
}

export function jsonFunc(url, type = 'POST') {
  return function(opts) {
    jsonSave(`${typeof url == 'string' ? url : url(opts)}${opts.urlSeg || ''}`, type, opts);
  };
}

export function getById(url, id = 'id') {
  return function(opts) {
    dataGet(`${url}/${getProp(id, opts)}`, opts);
  };
}

export function getWithUrlSeg(url) {
  return function(opts) {
    dataGet(`${url}${opts.urlSeg || ''}`, opts);
  };
}

export function saveById(url, id = 'data.uuid') {
  return function(opts) {
    jsonSave(typeof url == 'string' ? url : url(opts), getProp(id, opts) ? 'PUT' : 'POST', opts);
  };
}

export function deleteById(url, id = 'uuid') {
  return function(opts) {
    let urlId = getProp(id, opts);
    if (urlId) {
      ajaxCall($.extend({}, opts, {type: 'DELETE', relativeUrl: typeof url == 'string' ? `${url}/${urlId}` : url(opts)}));
    } else {
      opts.success();
    }
  };
}


/**
 * Consolidate Ajax Call
 * @param {Object} opts - The options object
 */
export function ajaxCall(ajaxOpts) {
  let {isJSON, relativeUrl, type, data, success, error, complete, ignore401, noToken, useData, noLoading, api_url} = ajaxOpts;
  let token = storage.get(storageTypes.token);
  let headers = (token && !noToken) ? {[setup.authHeader()]: 'Bearer ' + token} : null;
  let ajaxSettings = {
    url: (api_url || setup.api_url()) + relativeUrl,
    type: type || 'POST',
    headers,
    data,
    success, // res, textStatus, jqXHR
    complete: function(...args) {
      if (ajaxSettings.type != 'GET') {
        $('body').toggleClass('loading', --isLoading > 0);
      }
      complete && complete(...args);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401 && !ignore401 && pageLoader.handleAuthError(type, function() {
        ajaxCall(ajaxOpts);
      })) {
        return;
      }
      let responseObj = jqXHR.responseJSON || {};
      let errorMsg = 'Could not connect. Please try later.';
      let errors = responseObj.data;
      if (jqXHR.responseJSON) {
        errorMsg = responseObj.message || 'There was an error. Please try later.';
      } else if (errorThrown) {
        errorMsg = errorThrown;
      }
      if (Array.isArray(errors) && errors.length == 1) {
        errorMsg = errors[0];
      }
      error && error(errorMsg, errors, jqXHR);
    },
  };
  if (isJSON) {
    ajaxSettings.data = typeof data == 'string' ? data : JSON.stringify(data);
    ajaxSettings.contentType = 'application/json';
  }
  if (useData) {
    ajaxSettings.success = function(res) {
      success(res.data, res);
    };
  }
  if (ajaxSettings.type != 'GET' && !noLoading) {
    $('body').addClass('loading');
    isLoading++;
  }
  $.ajax(ajaxSettings);
}
