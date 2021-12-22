import getComp from 'setjs/template/component.js';

var $notification = $('#notification');

export default function notification(res, cls, sticky) {
  let msgObj = typeof res == 'string' ? {message: res} : typeof res.message == 'object' ? res.message : res;
  let notificationComp = getComp('common/notification', msgObj, {
    close,
  });
  sticky = msgObj.sticky || sticky;
  $notification.html(notificationComp.$root).addClass('active').addClass(cls).toggleClass('sticky', !!sticky);
  if (!sticky) {
    setTimeout(close, 4000);
  }

  function close() {
    $notification.removeClass('active sticky');
      setTimeout(function() {
        $notification.removeClass(cls).removeClass('error success');
      }, 400);
  }
}

export function errorNotification(callback) {
  return function (msgObj) {
    notification(msgObj, 'error');
    callback && callback(msgObj);
  };
}

export function successNotification(callback) {
  return function (msgObj) {
    notification(msgObj, 'success');
    callback && callback(msgObj);
  };
}
