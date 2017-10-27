(function() {
  var $, buildMouseEvent;

  $ = require('atom-space-pen-views').$;

  buildMouseEvent = function(type, target, _arg) {
    var ctrlKey, event, which, _ref;
    _ref = _arg != null ? _arg : {}, which = _ref.which, ctrlKey = _ref.ctrlKey;
    event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true
    });
    if (which != null) {
      Object.defineProperty(event, 'which', {
        get: function() {
          return which;
        }
      });
    }
    if (ctrlKey != null) {
      Object.defineProperty(event, 'ctrlKey', {
        get: function() {
          return ctrlKey;
        }
      });
    }
    Object.defineProperty(event, 'target', {
      get: function() {
        return target;
      }
    });
    Object.defineProperty(event, 'srcObject', {
      get: function() {
        return target;
      }
    });
    spyOn(event, "preventDefault");
    return event;
  };

  module.exports.triggerMouseEvent = function(type, target, _arg) {
    var ctrlKey, event, which, _ref;
    _ref = _arg != null ? _arg : {}, which = _ref.which, ctrlKey = _ref.ctrlKey;
    event = buildMouseEvent.apply(null, arguments);
    target.dispatchEvent(event);
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
    dragStartEvent = buildMouseEvent("dragstart", dragged);
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      get: function() {
        return dataTransfer;
      }
    });
    dropEvent = buildMouseEvent("drop", dropTarget);
    Object.defineProperty(dropEvent, 'dataTransfer', {
      get: function() {
        return dataTransfer;
      }
    });
    return [dragStartEvent, dropEvent];
  };

  module.exports.buildWheelEvent = function(delta) {
    return new WheelEvent("mousewheel", {
      wheelDeltaY: delta
    });
  };

  module.exports.buildWheelPlusShiftEvent = function(delta) {
    return new WheelEvent("mousewheel", {
      wheelDeltaY: delta,
      shiftKey: true
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9ldmVudC1oZWxwZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBRUEsZUFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsSUFBZixHQUFBO0FBQ2hCLFFBQUEsMkJBQUE7QUFBQSwwQkFEK0IsT0FBaUIsSUFBaEIsYUFBQSxPQUFPLGVBQUEsT0FDdkMsQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFZLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUI7QUFBQSxNQUFDLE9BQUEsRUFBUyxJQUFWO0FBQUEsTUFBZ0IsVUFBQSxFQUFZLElBQTVCO0tBQWpCLENBQVosQ0FBQTtBQUNBLElBQUEsSUFBd0QsYUFBeEQ7QUFBQSxNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLE9BQTdCLEVBQXNDO0FBQUEsUUFBQSxHQUFBLEVBQUssU0FBQSxHQUFBO2lCQUFHLE1BQUg7UUFBQSxDQUFMO09BQXRDLENBQUEsQ0FBQTtLQURBO0FBRUEsSUFBQSxJQUE0RCxlQUE1RDtBQUFBLE1BQUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsU0FBN0IsRUFBd0M7QUFBQSxRQUFBLEdBQUEsRUFBSyxTQUFBLEdBQUE7aUJBQUcsUUFBSDtRQUFBLENBQUw7T0FBeEMsQ0FBQSxDQUFBO0tBRkE7QUFBQSxJQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQUEsTUFBQSxHQUFBLEVBQUssU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBQUw7S0FBdkMsQ0FIQSxDQUFBO0FBQUEsSUFJQSxN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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/event-helpers.coffee
