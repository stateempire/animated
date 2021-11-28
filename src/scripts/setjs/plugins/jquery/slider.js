import anime from 'animejs';

$.fn.slider = function({duration, spring}) {
  var $slider = this;
  var $slides = $slider.find('.slide');
  var first = $slides[0];
  var index = 0;
  var startX = 0;
  var snapDuration = duration * 0.5;
  var moved;
  $slider.css('cursor', 'grab');
  $slider.swipe({
    move: function(diffX) {
      $slider.css('transform', `translateX(${startX + diffX}px)`);
      $slider.css('cursor', 'grabbing');
      moved = 1;
    },
    swipe,
  });

  function swipe({movedX, speed}) {
    let newIndex = index + Math.floor(Math.max(3, speed) / 3) * movedX;
    let slideWidth = first.getBoundingClientRect().width;
    $slider.css('cursor', 'grab');

    if ((newIndex >= 0 && newIndex < $slides.length) || moved) {
      snap(Math.max(0, Math.min(newIndex, $slides.length - 1)));
    } else {
      let diff = spring * slideWidth;
      animate(newIndex < 0 ? diff : startX - diff, snapDuration)
      .add({
        translateX: startX,
        duration: snapDuration,
        easing: 'easeInQuad',
      });
    }
    moved = 0;
  }

  function snap(newIndex) {
    let position = first.getBoundingClientRect().width * -newIndex;
    animate(position, duration);
    index = newIndex;
    startX = position;
  }

  function animate(position, time) {
    return anime.timeline({
      targets: $slider[0],
      easing: 'easeOutQuad',
    }).add({
      translateX: position,
      duration: time,
    });
  }

  return $slider.data('slider', {
    move: function(movedX) {
      swipe({movedX, diffX: 0, speed: 1});
    },
    reset: function() {
      first && animate(first.getBoundingClientRect().width * -index, duration);
    },
    next: function() {
      snap(index == $slides.length - 1 ? 0 : index + 1);
    },
  });
};
