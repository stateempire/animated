import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.init, 'drop-menu', function() {
  $(document).on('click', function(e) {
    var $menuBtn = $('.js-dropdown-btn');
    var $found = $menuBtn.find(e.target).add($menuBtn.filter(e.target));

    if ($(e.target).closest('.prevent-close').length) {
      return;
    }
    if ($found.length) {
      var $menu = $found.closest('.dropdown');
      $menu.toggleClass('open');

      $('.dropdown.open').not($menu).removeClass('open');
      $('body').toggleClass('dropdown', $menu.hasClass('open'));
      return !$menu.length;
    } else {
      $('.dropdown.open').removeClass('open');
      $('body').removeClass('dropdown');
    }
  });
});
