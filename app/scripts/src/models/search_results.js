define('models/search_results', ['backbone','models/search_result'], function (Backbone, SearchResult) {
  return Backbone.Collection.extend({
    initialize: function(models) {
      var that = this;
    },
    comparator: function(model) {
      return model.get("index");
    },
    model: SearchResult
  });
});
