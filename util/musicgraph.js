var request = require('request'),
    async = require('async'),
    _ = require('lodash'),
    oa = require('openaura-api');
  

var MusicGraphApi = (function() {
  var API_KEY;
  var MusicGraph = function(key) {
    API_KEY = key;
  };
  var OA_API_KEY = 'music-hack-day'

  MusicGraph.prototype.contstructor = MusicGraph;

  MusicGraph.prototype.similarArtists = function(params, cb) {
    var url = 'http://api.musicgraph.com/api/v2/artist/search?api_key='+API_KEY+'&similar_to='+params.artist_name;
    request.get({url: url, json: true}, function(error, resp, body) {
      if (error) {
        cb(error, null);
      } else {
        var artist_names = _.map(body.data, function(artist) { return artist.name });

        var oa_search = new oa.search(OA_API_KEY);
        var artist_id_get_functions = _.map(artist_names, function(artist_name) {
          return function(pcb) { // these will be executed in async.parallel
            oa_search.artist(artist_name, function(err) {cb(err, null)}, function(raw_data) {
              pcb(null, raw_data.length > 0 ? raw_data[0].oa_artist_id : null);
            })
          }
        });
        // console.dir(artist_id_get_functions)
        async.parallel(
            artist_id_get_functions,
            function(err, results) {
                console.dir(results)
                cb(null, _.compact(results));
            }
        );
      };
    });
  };

  return MusicGraph;
}());


module.exports = MusicGraphApi;
