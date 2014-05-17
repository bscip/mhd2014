define('models/facets', ['backbone','models/facet'], function (Backbone, Facet) {
  return Backbone.Collection.extend({
    initialize: function(models) {
      var that = this;
    },
    comparator: function(model) {
      return model.get("index");
    },
    model: Facet
  });
});
