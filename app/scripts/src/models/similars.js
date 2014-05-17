define('models/similars', ['backbone','models/facet'], function (Backbone, Similar) {
  return Backbone.Collection.extend({
    initialize: function(models) {
      var that = this;
    },
    comparator: function(model) {
      return model.get("index");
    },
    model: Similar
  });
});
