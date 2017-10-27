(function() {
  var closest, indexOf, matches;

  closest = function(element, selector) {
    if (element == null) {
      return;
    }
    if (element.matches(selector)) {
      return element;
    }
    return closest(element.parentElement, selector);
  };

  indexOf = function(element, elements) {
    var child, index, _i, _len;
    if (elements == null) {
      elements = element.parentElement.children;
    }
    for (index = _i = 0, _len = elements.length; _i < _len; index = ++_i) {
      child = elements[index];
      if (element === child) {
        return index;
      }
    }
    return -1;
  };

  matches = function(element, selector) {
    return element.matches(selector) || element.matches(selector + " *");
  };

  module.exports = {
    matches: matches,
    closest: closest,
    indexOf: indexOf
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2h0bWwtaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsUUFBVixHQUFBO0FBQ1IsSUFBQSxJQUFjLGVBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUNBLElBQUEsSUFBa0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBaEIsQ0FBbEI7QUFBQSxhQUFPLE9BQVAsQ0FBQTtLQURBO1dBRUEsT0FBQSxDQUFRLE9BQU8sQ0FBQyxhQUFoQixFQUErQixRQUEvQixFQUhRO0VBQUEsQ0FBVixDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLFFBQVYsR0FBQTtBQUNSLFFBQUEsc0JBQUE7O01BQUEsV0FBWSxPQUFPLENBQUMsYUFBYSxDQUFDO0tBQWxDO0FBQ0EsU0FBQSwrREFBQTs4QkFBQTtBQUNFLE1BQUEsSUFBZ0IsT0FBQSxLQUFXLEtBQTNCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FERjtBQUFBLEtBREE7QUFHQSxXQUFPLENBQUEsQ0FBUCxDQUpRO0VBQUEsQ0FMVixDQUFBOztBQUFBLEVBV0EsT0FBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLFFBQVYsR0FBQTtXQUNSLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQUEsSUFBNkIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBQSxHQUFXLElBQTNCLEVBRHJCO0VBQUEsQ0FYVixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFNBQUEsT0FBRDtBQUFBLElBQVUsU0FBQSxPQUFWO0FBQUEsSUFBbUIsU0FBQSxPQUFuQjtHQWRqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/html-helpers.coffee
