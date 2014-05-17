define('models/facet_view', ['marionette', 'vent'], function(Marionette, vent) {
  return Marionette.ItemView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    events: {
      'click' : 'select'
    },
    tagName: 'div',
    className: 'facet',
    render: function() {
      var template = _.template($('#t-facet').html(), this.model.attributes);
      this.$el.html( template );
    },
    select: function() {
    }
  });
});
