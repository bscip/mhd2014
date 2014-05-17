require.config({
  paths: {
    jquery: '../lib/jquery', 
    jqueryUI: '../lib/jquery-ui-1.10.3.custom',
    lodash: '../lib/lodash-2.1.0',
    backbone: '../lib/backbone',
    marionette: '../lib/backbone.marionette',
    oa: '../lib/oa-all.min'
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
    'jquery', 'lodash', 'backbone', 'marionette', 'oa', 'vent',
    'models/search_results', 'models/search_results_view',
  ], 
  function (
    $, _, Backbone, Marionette, OA, vent,
    SearchResults, SearchResultsView
  ) {

  // initialize our Marionette app
  var app = new Marionette.Application(),
      // models, collections, views, layouts:
      contentLayout, ContentLayout,
      searchResults, searchResultsView
      ;
  // initialize our OA sdk interface
  window.MHDapp = app;

  OA.initialize({
    stream_key: "brian-test",
    info_key: "brian-test"
  });
  app.OA = OA;

  // Our main region for displaying content/search-results
  app.addRegions({
    content: '#content-container'
  });

  app.addInitializer(function() {
    // init stuff here
    searchResults = new SearchResults();
    searchResultsView = new SearchResultsView({
      collection: searchResults
    });
    // Setup our layout that we'll use after an artist is selected
    ContentLayout = Marionette.Layout.extend({
      className: 'main-layout',
      regions: {
        current: '#current-container',
        similar: '#similar-container',
        facets: '#facets-container'
      },
      render: function() {
        var template = _.template($('#t-main-layout').html(), {});
        this.$el.html( template );
      },
    });
  });

  // Search inputs:
  $('.fa-search').on('click', function() {
    vent.trigger('artist:search', $('#search_input').val());
  });
  $('#search_input').keypress(function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      $('.fa-search').click();
    }
  });

  // ARTIST SEARCH
  vent.on('artist:search', function(req) {
    searchResults.reset();
    app.content.show(searchResultsView);

    $.ajax({
      type: 'GET',
      url: 'http://api.openaura.com/v1/search/artists',
      data: {q: req, limit: 100, api_key:"brian-test"},
      success: function(data, textStatus) {
        if (textStatus == 'success') {
          data.forEach(function(d,i) {
            searchResults.add(_.extend(d,{index:i}));
          });
          searchResultsView.render();
        }
      }
    });
  });



  // start our marionette app
  app.start();
});
