import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.init, 'drop-menu', function() {
  $(document).on('click', function(e) {
    var $menuBtn = $('.menu-dropdown-btn');
    var $found = $menuBtn.find(e.target).add($menuBtn.filter(e.target));

    if ($(e.target).closest('.prevent-close').length) {
      return;
    }

    if ($found.length) {
      var $menu = $found.closest('.menu-dropdown');
      $menu.toggleClass('open');
      $('.menu-dropdown.open').not($menu).removeClass('open');
      $('body').toggleClass('dropdown', $menu.hasClass('open'));

      return !$menu.length;
    } else {
      $('.menu-dropdown.open').removeClass('open');
      $('body').removeClass('dropdown');
    }
  });
});
