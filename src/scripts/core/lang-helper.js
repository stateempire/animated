function noAct() {}

export default {
  initData: function(opts) {
    opts.success();
  },
  init: noAct,
  lang: noAct,
  data: function() {
    return {
      home: {
        meta: {
          title: 'setjs - scroll based animations',
          description: 'A scroll-based animation demo based on timelines'
        }
      }
    };
  }
};
