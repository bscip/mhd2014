define('models/similars/media', ['marionette', 'vent', 'models/similar_view'], function(Marionette, vent, SimilarView) {
  return SimilarView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    attributes: function() {
      return {
        height: 328,
        width: 441,
        src: this.model.attributes.url
      };
    },
    tagName: 'iframe',
    className: 'similar media',
    render: function() {
      var template = _.template($('#t-similar-media').html(), this.model.attributes);
      this.$el.html( '<div class="video_container col-xs-6 col-md-3">'+template+'</div>' );
    }
  });
});
