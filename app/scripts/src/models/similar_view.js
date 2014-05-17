define('models/similar_view', ['marionette', 'vent'], function(Marionette, vent) {
  return Marionette.ItemView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    events: {
      'click' : 'select'
    },
    tagName: 'div',
    className: 'similar',
    render: function() {
      var template = _.template($('#t-similar').html(), this.model.attributes);
      this.$el.html( template );
    },
    select: function() {
    }
  });
});
