define('models/facets', ['backbone','models/facet'], function (Backbone, Facet) {
  return Backbone.Collection.extend({
    initialize: function(models) {
      var that = this;
      that.on('change:active', function (changed) {
        if (changed.get('active')) {
          that.each(function (f) {
            if (f !== changed) {
              f.set('active', false);
            }
          });
        }
      });
    },
    comparator: function(model) {
      return model.get("index");
    },
    model: Facet
  });
});
