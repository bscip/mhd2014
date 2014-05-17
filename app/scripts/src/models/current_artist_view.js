define('models/current_artist_view', ['marionette', 'vent'], function(Marionette, vent) {
  return Marionette.ItemView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    tagName: 'div',
    className: 'current-artist',
    render: function() {
      var template = _.template($('#t-current-artist').html(), this.model.attributes);
      this.$el.html( template );
    },
  });
});
