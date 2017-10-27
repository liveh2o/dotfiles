(function() {
  var $;

  $ = require('atom-space-pen-views').$;

  module.exports.triggerMouseDownEvent = function(target, _arg) {
    var ctrlKey, event, which;
    which = _arg.which, ctrlKey = _arg.ctrlKey;
    event = {
      type: 'mousedown',
      which: which,
      ctrlKey: ctrlKey,
      preventDefault: jasmine.createSpy("preventDefault")
    };
    $(target).trigger(event);
    return event;
  };

  module.exports.buildDragEvents = function(dragged, dropTarget) {
    var dataTransfer, dragStartEvent, dropEvent;
    dataTransfer = {
      data: {},
      setData: function(key, value) {
        return this.data[key] = "" + value;
      },
      getData: function(key) {
        return this.data[key];
      }
    };
    dragStartEvent = $.Event();
    dragStartEvent.target = dragged;
    dragStartEvent.originalEvent = {
      dataTransfer: dataTransfer
    };
    dropEvent = $.Event();
    dropEvent.target = dropTarget;
    dropEvent.originalEvent = {
      dataTransfer: dataTransfer
    };
    return [dragStartEvent, dropEvent];
  };

  module.exports.buildWheelEvent = function(delta) {
    return $.Event("wheel", {
      originalEvent: {
        wheelDelta: delta
      }
    });
  };

}).call(this);
