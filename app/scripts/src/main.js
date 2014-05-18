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
      current_similar_set,
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
      aidata.name = ai.name();
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
      facets.add({
        type: facet_types[i], 
        index: i, 
        active: facet_types[i] === 'name' ? true : false
      });
    }
    contentLayout_similar.facets.show(facetsView);
  });

  vent.on('similar:setup', function(current_artist) {
    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars,
      options: {type: 'name'}
    });
    contentLayout_similar.similar.show(similarsView);
    $.ajax({
      type: 'GET',
      url: '/musicgraph/similar',
      data: {artist_name: current_artist.name},
      success: function(data, textStatus) {
        if (textStatus == 'success') {
          current_similar_set = data.data;
          // DEFAULT TO NAME FOR INITIAL SETUP:
          _.each(data.data, function(d) {
            OA.ArtistInfo.fetchByOaArtistId(d.oa_artist_id, function(ai) {
              similars.add(ai.asObject());
            });
          });
        }
      }
    });
  });

  vent.on('facet:name:select', function() {
    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars,
      options: {type: 'name'}
    });
    contentLayout_similar.similar.show(similarsView);
    _.each(current_similar_set, function(d) {
      OA.ArtistInfo.fetchByOaArtistId(d.oa_artist_id, function(ai) {
        console.dir(ai.asObject());
        similars.add(ai.asObject());
      });
    });
  });
  vent.on('facet:image:select', function() {
    var particle;

    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars,
      options: {type: 'image'}
    });
    contentLayout_similar.similar.show(similarsView);
    _.each(current_similar_set, function(d) {
      OA.ArtistInfo.fetchByOaArtistId(d.oa_artist_id, function(ai) {
        OA.Aura.fetchByOaArtistId(d.oa_artist_id, function(aura) {
          particle = aura
            .particles()
            .withMediaWithin(200,200,1000,2000)
            .filterByProvider('lastfm')
            .filterByMedia(function(m) { return m.mediaType() == 'image'; })
            .first();
          if (particle) {
            similars.add(_.extend(ai.asObject(),{url: particle.media().last().url()}));
          } else {
            // ok, use something besides lastfm if we don't have lastfm
            OA.Aura.fetchByOaArtistId(d.oa_artist_id, function(aura) {
              particle = aura
                .particles()
                .withMediaWithin(200,200,1000,2000)
                .filterByMedia(function(m) { return m.mediaType() == 'image'; })
                .first();
              if (particle) {
                similars.add(_.extend(ai.asObject(),{url: particle.media().last().url()}));
              } else {
                similars.add(_.extend(ai.asObject(),{url: ''}));
              }
            });
          }
        });
      });
    });
  });
  vent.on('facet:bio:select', function() {
    var particle;

    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars,
      options: {type: 'bio'}
    });
    contentLayout_similar.similar.show(similarsView);
    _.each(current_similar_set, function(d) {
      OA.ArtistInfo.fetchByOaArtistId(d.oa_artist_id, function(ai) {
        similars.add(ai.asObject());
      });
    });
  });
  vent.on('facet:media:select', function() {
    var particle;

    similars = new Similars();
    similarsView = new SimilarsView({
      collection: similars,
      options: {type: 'media'}
    });
    contentLayout_similar.similar.show(similarsView);
    _.each(current_similar_set, function(d) {
      OA.ArtistInfo.fetchByOaArtistId(d.oa_artist_id, function(ai) {
        OA.Aura.fetchByOaArtistId(d.oa_artist_id, function(aura) {
          particle = aura
            .particles()
            .filterByProvider('youtube')
            .filterByMedia(function(m) { return m.mediaType() == 'embed' || m.mediaType() == 'video'; })
            .first();
          if (particle) {
            console.dir(particle);
            similars.add(_.extend(ai.asObject(),{url: particle.media().first().url()}));
          } else {
            // try soundcloud?
            OA.Aura.fetchByOaArtistId(d.oa_artist_id, function(aura) {
              particle = aura
                .particles()
                .filterByProvider('soundcloud')
                .filterByMedia(function(m) { return m.mediaType() == 'embed' || m.mediaType() == 'video'; })
                .first();
              if (particle) {
                similars.add(_.extend(ai.asObject(),{url: particle.media().first().url()}));
              }
            });
          }
        });
      });
    });
  });








  // SIMILAR SELECTED
  vent.on('similar:selected', function(artist) {
    // switch out our main region to show our first layout
    ContentLayout_similar_details = Marionette.Layout.extend({
      className: 'details-layout',
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
