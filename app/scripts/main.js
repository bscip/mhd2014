require.config({
  paths: {
    jquery: 'lib/jquery', 
    jqueryUI: 'lib/jquery-ui-1.10.3.custom',
    lodash: 'lib/lodash-2.1.0',
    backbone: 'lib/backbone',
    marionette: 'lib/backbone.marionette',
    oa: 'lib/oa-all.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    lodash: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'lodash'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['jquery', 'lodash', 'backbone'],
      exports: 'Marionette'
    },
    oa: {
      exports: 'OA'
    }
  }
});

require(
  [
    'jquery', 'lodash', 'backbone', 'marionette', 'oa', 'vent'
  ], 
  function (
    $, _, Backbone, Marionette, OA, vent
  ) {

  // initialize our Marionette app
  var app = new Marionette.Application();
  // initialize our OA sdk interface
  OA.initialize({
    stream_key: "brian-test",
    info_key: "brian-test"
  });

  // Our main region for displaying content/search-results
  app.addRegions({
    content: '#main-container'
  });

  app.addInitializer(function() {
    // init stuff here
  });

  // start our marionette app
  app.start();
});
