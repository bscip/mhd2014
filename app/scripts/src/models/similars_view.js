define('models/similars_view', ['marionette', 'models/similar_view'], function (Marionette, SimilarView) {
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
    itemView: SimilarView,
    className: 'similars'
  });
});
