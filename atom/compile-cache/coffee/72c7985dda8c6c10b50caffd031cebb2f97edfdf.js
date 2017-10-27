(function() {
  var Range;

  Range = require('atom').Range;

  module.exports = {
    copyType: function(text) {
      if (text.lastIndexOf("\n") === text.length - 1) {
        return 'linewise';
      } else if (text.lastIndexOf("\r") === text.length - 1) {
        return 'linewise';
      } else {
        return 'character';
      }
    },
    mergeRanges: function(oldRange, newRange) {
      oldRange = Range.fromObject(oldRange);
      newRange = Range.fromObject(newRange);
      if (oldRange.isEmpty()) {
        return newRange;
      } else {
        return oldRange.union(newRange);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi91dGlscy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsS0FBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQU9FO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixNQUFBLElBQUcsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakIsQ0FBQSxLQUEwQixJQUFJLENBQUMsTUFBTCxHQUFjLENBQTNDO2VBQ0UsV0FERjtPQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFqQixDQUFBLEtBQTBCLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBM0M7ZUFDSCxXQURHO09BQUEsTUFBQTtlQUdILFlBSEc7T0FIRztJQUFBLENBQVY7QUFBQSxJQVdBLFdBQUEsRUFBYSxTQUFDLFFBQUQsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQUFBLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFqQixDQUFYLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBTixDQUFpQixRQUFqQixDQURYLENBQUE7QUFFQSxNQUFBLElBQUcsUUFBUSxDQUFDLE9BQVQsQ0FBQSxDQUFIO2VBQ0UsU0FERjtPQUFBLE1BQUE7ZUFHRSxRQUFRLENBQUMsS0FBVCxDQUFlLFFBQWYsRUFIRjtPQUhXO0lBQUEsQ0FYYjtHQVRGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/utils.coffee
