/*global define, Backbone*/
define('vent', ['backbone', 'marionette'], function (Backbone, Marionette) {
  'use strict';

  var vent = new Backbone.Wreqr.EventAggregator();

  // toggleSnoop: Wrap event callbacks in a function to trace event
  // calls.
  vent.toggleSnoop = function (fn) {
    if (typeof vent.__on === 'undefined' && typeof fn === 'function') {
      // if vent.__on is not defined we add the wrapper.
      vent.__on = vent.on;
      vent.on = function (evtName, oldCb) {
        vent.__on(evtName, function() {
          var args = Array.prototype.slice.call(arguments, 0);
          fn(evtName, args);
          oldCb.apply(this, args);
        });
      };
    } else if (typeof vent.__on === 'function') {
      // otherwise, reset on, and delete the copy fn.
      vent.on = vent.__on;
      delete vent['__on'];
    }
  };

  return vent;
});
