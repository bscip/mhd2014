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
    className: 'similar col-xs-6 col-md-3',
    render: function() {
      var template = _.template($('#t-similar').html(), this.model.attributes);
      this.$el.html( template );
    },
    select: function() {
    }
  });
});
