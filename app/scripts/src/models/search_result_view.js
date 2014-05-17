define('models/search_result_view', ['marionette', 'vent'], function(Marionette, vent) {
  return Marionette.ItemView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    events: {
      'click' : 'select'
    },
    tagName: 'div',
    className: function () {
      var i = this.model.attributes.index
      if (i == 0) {
        return 'search_result btn btn-success';
      } else if (i > 0 && i <= 10) {
        return 'search_result btn btn-primary';
      } else if (i > 10 && i <= 40) {
        return 'search_result btn btn-info';
      } else if (i > 40) {
        return 'search_result btn btn-default';
      }
    },
    render: function() {
      var template = _.template($('#t-search_result').html(), this.model.attributes);
      this.$el.html( template );
    },
    select: function() {
      vent.trigger('artist:selected', this.model.attributes.oa_artist_id);
    }
  });
});
