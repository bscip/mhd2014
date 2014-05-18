var secret = require('../util/secret'),
    MusicGraphApi = require('../util/musicgraph'),
    MG = new MusicGraphApi(secret.api_key_musicgraph);


var api_musicgraph = (function() {
  var api = function() {};
  api.prototype.constructor = api;

  function processResult(res, err, data) {
    var status = 'ok';
    if (!err) {
      res.json({status: status, data: data});
    } else {
      res.json({status: err, data: null});
    }
  }

  api.prototype.similarArtists = function(req, res) {
    MG.similarArtists({'artist_name': req.query.artist_name}, function(err, data) {
      processResult(res, err, data);
    });
  };

  return api;
}());

module.exports = api_musicgraph;
