define('models/similars_view', 
       ['marionette', 'models/similars/name',
         'models/similars/image',
         'models/similars/bio',
         'models/similars/media'
       ], function (Marionette, NameView, ImageView, BioView, MediaView) {
  var view_type;
  return Marionette.CollectionView.extend({
    initialize: function(models) {
      var that = this;
      view_type = models.options.type;
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
    itemView: function(params) {
      switch (view_type) {
        case 'name':
          return new NameView(params);
          break;
        case 'image':
          return new ImageView(params);
          break;
        case 'bio':
          return new BioView(params);
          break;
        case 'media':
          return new MediaView(params);
          break;
        default:
          break;
      }
    },
    className: 'similars'
  });
});
