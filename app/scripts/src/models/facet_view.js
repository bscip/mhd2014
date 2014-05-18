define('models/facet_view', ['marionette', 'vent'], function(Marionette, vent) {
  return Marionette.ItemView.extend({
    initialize: function() {
      var that = this;
      that.render();
    },
    events: {
      'click' : 'select'
    },
    modelEvents: {
      'change': 'changeClass'
    },
    tagName: 'li',
    className: function() {
      return this.getClass;
    },
    getClass: function() {
      if (_.has(this, 'model')) {
        return this.model.attributes.active ? 'facet active' : 'facet';
      } else {
        return 'facet';
      }
    },
    render: function() {
      var template = _.template($('#t-facet').html(), this.model.attributes);
      this.$el.html( template );
    },
    select: function() {
      this.model.set('active', true);
      vent.trigger('facet:'+this.model.attributes.type+':select');
      console.dir(this.model.attributes.type);
    },
    changeClass: function() {
      this.$el.attr('class', this.className);
      this.render();
    }
  });
});
