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
    'models/current_artist', 'models/current_artist_view',
    'models/facets', 'models/facets_view',
    'models/similars', 'models/similars_view',
  ], 
  function (
    $, _, Backbone, Marionette, OA, vent,
    SearchResults, SearchResultsView,
    CurrentArtist, CurrentArtistView,
    Facets, FacetsView,
    Similars, SimilarsView
  ) {

  // initialize our Marionette app
  var app = new Marionette.Application(),
      // models, collections, views, layouts:
      contentLayout_similar, ContentLayout_similar,
      contentLayout_similar_details, ContentLayout_similar_details,
      searchResults, searchResultsView,
      currentArtistView,
      facets, facetsView,
      // other global vars
      current_selected_artist,
      current_similar_artist_selected
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
    main: '#main-container',
    search_results: '#search-results-container'
  });

  app.addInitializer(function() {
    // init stuff here
    searchResults = new SearchResults();
    searchResultsView = new SearchResultsView({
      collection: searchResults
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
    app.search_results.show(searchResultsView);

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

  // ARTIST SELECTED
  vent.on('artist:selected', function(artist) {
    current_selected_artist = artist;
    // switch out our main region to show our first layout
    ContentLayout_similar = Marionette.Layout.extend({
      className: 'main-layout',
      regions: {
        current: '#current-container',
        similar: '#similar-container',
        facets: '#facets-container'
      },
      render: function() {
        var template = _.template($('#t-layout-similar').html(), {});
        this.$el.html( template );
      }
    });
    contentLayout_similar = new ContentLayout_similar();
    app.main.show(contentLayout_similar);

    vent.trigger('current:setup', artist);
    vent.trigger('facets:setup');
    vent.trigger('similar:setup', artist);
  });


  vent.on('current:setup', function(artist) {
    var aidata = {};
    OA.ArtistInfo.fetchByOaArtistId(artist.oa_artist_id, function(ai) {
      aidata.bio = ai.bio();
      aidata.styles = ai.styleTags().media[0].data.tags;
      aidata.profile_image_src = ai.profilePhoto().last().url();
      currentArtistView = new CurrentArtistView({
        model: new CurrentArtist(aidata)
      });
      contentLayout_similar.current.show(currentArtistView);
    });
  });

  vent.on('facets:setup', function() {
    var i, len,
        facet_types = [ 'name', 'image', 'bio', 'media', 'tweet' ];

    facets = new Facets();
    facetsView = new FacetsView({
      collection: facets
    });
    for(i=0, len=facet_types.length; i<len; i++) {
      facets.add({type: facet_types[i], index: i});
    }
    contentLayout_similar.facets.show(facetsView);
  });

  vent.on('similar:setup', function(current_artist) {
    var i, len;

    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars
    });
    contentLayout_similar.similars.show(similarsView);
  });


  // SIMILAR SELECTED
  vent.on('similar:selected', function(artist) {
    // switch out our main region to show our first layout
    ContentLayout_similar_details = Marionette.Layout.extend({
      className: 'main-layout',
      regions: {
        current: '#current-container',
        similar: '#similar-selected-container',
        facets: '#similar-details-container'
      },
      render: function() {
        var template = _.template($('#t-layout-similar-details').html(), {});
        this.$el.html( template );
      }
    });
    contentLayout_similar_details = new ContentLayout_similar_details();
    app.main.show(contentLayout_similar_details);

    vent.trigger('current:details:setup', artist);
    vent.trigger('similar:selected:setup', artist);
    vent.trigger('similar:details:setup', artist);
  });


  // start our marionette app
  app.start();
});
