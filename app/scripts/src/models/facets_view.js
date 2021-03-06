define('models/facets_view', ['marionette', 'models/facet_view'], function (Marionette, FacetView) {
  return Marionette.CollectionView.extend({
    initialize: function(models) {
      var that = this;
    },
    appendHtml: function(collectionView, itemView, index){
      var childrenContainer = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
      var children = childrenContainer.children();
      if (children.size() <= index) {
        childrenContainer.append(itemView.el);
      } else {
        children.eq(index).before(itemView.el);
      }
    },
    tagName: 'ul',
    itemView: FacetView,
    className: 'facets nav nav-justified'
  });
});
