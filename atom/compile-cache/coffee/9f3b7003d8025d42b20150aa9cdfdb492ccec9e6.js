(function() {
  var Helpers, Range, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, bufferModifying, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      if (linter.modifiesBuffer !== bufferModifying) {
        return false;
      }
      return true;
    },
    requestUpdateFrame: function(callback) {
      return setTimeout(callback, 100);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUZoQixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLEdBQ1I7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLENBQUQsR0FBQTthQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsQ0FBQyxDQUFDLFFBQUYsQ0FBQSxDQUE1QixFQUEwQztBQUFBLFFBQUMsTUFBQSxFQUFRLENBQUMsQ0FBQyxLQUFGLElBQVcsRUFBcEI7QUFBQSxRQUF3QixXQUFBLEVBQWEsSUFBckM7T0FBMUMsRUFESztJQUFBLENBQVA7QUFBQSxJQUVBLG1CQUFBLEVBQXFCLFNBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsUUFBMUIsRUFBb0MsTUFBcEMsR0FBQTtBQUluQixNQUFBLElBQWdCLFFBQUEsSUFBYSxDQUFBLE1BQVUsQ0FBQyxTQUF4QztBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxNQUEwQixDQUFDLElBQVAsQ0FBWSxTQUFDLEtBQUQsR0FBQTtlQUFXLGVBQVMsTUFBTSxDQUFDLGFBQWhCLEVBQUEsS0FBQSxPQUFYO01BQUEsQ0FBWixDQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxNQUFBLElBQWdCLE1BQU0sQ0FBQyxjQUFQLEtBQTJCLGVBQTNDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FGQTtBQUdBLGFBQU8sSUFBUCxDQVBtQjtJQUFBLENBRnJCO0FBQUEsSUFVQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQsR0FBQTthQUNsQixVQUFBLENBQVcsUUFBWCxFQUFxQixHQUFyQixFQURrQjtJQUFBLENBVnBCO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/linter/lib/helpers.coffee
