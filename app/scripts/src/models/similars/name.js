define('models/similars/name', ['marionette', 'vent', 'models/similar_view'], function(Marionette, vent, SimilarView) {
  return SimilarView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    tagName: 'div',
    className: 'similar name col-xs-6 col-md-3',
    render: function() {
      var template = _.template($('#t-similar-name').html(), this.model.attributes);
      this.$el.html( template );
    },
  });
});
