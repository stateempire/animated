import {addAction} from 'core/acts-funcs.js';

addAction('copyInput', function(opts) {
  var $parent = opts.$el.parent();
  var $msg = $parent.find('.button');
  navigator.clipboard.writeText($parent.find('input').val());
  $msg.addClass('active');
  setTimeout(function() {
    $msg.removeClass('active');
  }, 1000);
});
