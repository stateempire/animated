import anime from 'animejs';
import {startApp} from 'setjs/kernel/setjs.js';
import setup from 'config/setup.js';
import langHelper from 'LangHelper';
import initAppData from 'core/app-data.js';
import storage from 'setjs/kernel/storage.js';
import pageLoader from 'setjs/kernel/page-loader.js';
import {batchCall} from 'setjs/utility/calls.js';
import appInit from 'app/init.js';
import initialiseSetjs from 'core/setjs-init.js';
import {loadTemplates} from 'setjs/template/templates.js';
import appAssets from 'bootstrap/app-assets.js';

import 'bootstrap/plugin-init.js';
import 'bootstrap/component-init.js';

$(function() {
  window.$win = $(window);
  window.$doc = $(document);
  setup.init(APP_SETTINGS);
  storage.init();
  langHelper.init();
  loadTemplates($('#init-error').html());
  initialiseSetjs();
  batchCall({
    error: pageLoader.initError,
    success: function() {
      appInit({
        error: pageLoader.initError,
        success: function() {
          $('.initial .pulse').removeClass('pulse');
          anime({
            scale: 40,
            opacity: 0,
            duration: 900,
            targets: '.initial',
            easing: 'linear',
            complete: function() {
              $('.initial').remove();
              $('#main-content').removeClass('invisible').css('opacity', 0).animate({opacity: 1});
            }
          });
          startApp();
        },
      });
    }
  })
  .add(appAssets)
  .add(initAppData)
  .add(langHelper.initData)
  .go();
});
