var request = require('request'),
    async = require('async'),
    _ = require('lodash');
  

var MusicGraphApi = (function() {
  var API_KEY;
  var MusicGraph = function(key) {
    API_KEY = key;
  };

  MusicGraph.prototype.contstructor = MusicGraph;

  MusicGraph.prototype.similarArtists = function(cb) {
    var url = '';
    request.get({url: url, json: true}, function(error, resp, data) {
      console.dir(data)
      // cb("this is an error", null)
      cb(null, {"my data": "some data"})
    });
  };

  return MusicGraph;
}());


module.exports = MusicGraphApi;
