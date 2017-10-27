(function() {
  var ContentsByMode, StatusBarManager;

  ContentsByMode = {
    'insert': ["status-bar-vim-mode-insert", "Insert"],
    'insert.replace': ["status-bar-vim-mode-insert", "Replace"],
    'normal': ["status-bar-vim-mode-normal", "Normal"],
    'visual': ["status-bar-vim-mode-visual", "Visual"],
    'visual.characterwise': ["status-bar-vim-mode-visual", "Visual"],
    'visual.linewise': ["status-bar-vim-mode-visual", "Visual Line"],
    'visual.blockwise': ["status-bar-vim-mode-visual", "Visual Block"]
  };

  module.exports = StatusBarManager = (function() {
    function StatusBarManager() {
      this.element = document.createElement("div");
      this.element.id = "status-bar-vim-mode";
      this.container = document.createElement("div");
      this.container.className = "inline-block";
      this.container.appendChild(this.element);
    }

    StatusBarManager.prototype.initialize = function(statusBar) {
      this.statusBar = statusBar;
    };

    StatusBarManager.prototype.update = function(currentMode, currentSubmode) {
      var klass, newContents, text;
      if (currentSubmode != null) {
        currentMode = currentMode + "." + currentSubmode;
      }
      if (newContents = ContentsByMode[currentMode]) {
        klass = newContents[0], text = newContents[1];
        this.element.className = klass;
        return this.element.textContent = text;
      } else {
        return this.hide();
      }
    };

    StatusBarManager.prototype.hide = function() {
      return this.element.className = 'hidden';
    };

    StatusBarManager.prototype.attach = function() {
      return this.tile = this.statusBar.addRightTile({
        item: this.container,
        priority: 20
      });
    };

    StatusBarManager.prototype.detach = function() {
      return this.tile.destroy();
    };

    return StatusBarManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zdGF0dXMtYmFyLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsY0FBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUFWO0FBQUEsSUFDQSxnQkFBQSxFQUFrQixDQUFDLDRCQUFELEVBQStCLFNBQS9CLENBRGxCO0FBQUEsSUFFQSxRQUFBLEVBQVUsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUZWO0FBQUEsSUFHQSxRQUFBLEVBQVUsQ0FBQyw0QkFBRCxFQUErQixRQUEvQixDQUhWO0FBQUEsSUFJQSxzQkFBQSxFQUF3QixDQUFDLDRCQUFELEVBQStCLFFBQS9CLENBSnhCO0FBQUEsSUFLQSxpQkFBQSxFQUFtQixDQUFDLDRCQUFELEVBQStCLGFBQS9CLENBTG5CO0FBQUEsSUFNQSxrQkFBQSxFQUFvQixDQUFDLDRCQUFELEVBQStCLGNBQS9CLENBTnBCO0dBREYsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDBCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsR0FBYyxxQkFEZCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSGIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLGNBSnZCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsT0FBeEIsQ0FMQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwrQkFRQSxVQUFBLEdBQVksU0FBRSxTQUFGLEdBQUE7QUFBYyxNQUFiLElBQUMsQ0FBQSxZQUFBLFNBQVksQ0FBZDtJQUFBLENBUlosQ0FBQTs7QUFBQSwrQkFVQSxNQUFBLEdBQVEsU0FBQyxXQUFELEVBQWMsY0FBZCxHQUFBO0FBQ04sVUFBQSx3QkFBQTtBQUFBLE1BQUEsSUFBb0Qsc0JBQXBEO0FBQUEsUUFBQSxXQUFBLEdBQWMsV0FBQSxHQUFjLEdBQWQsR0FBb0IsY0FBbEMsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFHLFdBQUEsR0FBYyxjQUFlLENBQUEsV0FBQSxDQUFoQztBQUNFLFFBQUMsc0JBQUQsRUFBUSxxQkFBUixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsS0FEckIsQ0FBQTtlQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxHQUF1QixLQUh6QjtPQUFBLE1BQUE7ZUFLRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBTEY7T0FGTTtJQUFBLENBVlIsQ0FBQTs7QUFBQSwrQkFtQkEsSUFBQSxHQUFNLFNBQUEsR0FBQTthQUNKLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQixTQURqQjtJQUFBLENBbkJOLENBQUE7O0FBQUEsK0JBd0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxTQUFTLENBQUMsWUFBWCxDQUF3QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxTQUFQO0FBQUEsUUFBa0IsUUFBQSxFQUFVLEVBQTVCO09BQXhCLEVBREY7SUFBQSxDQXhCUixDQUFBOztBQUFBLCtCQTJCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsRUFETTtJQUFBLENBM0JSLENBQUE7OzRCQUFBOztNQVhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/status-bar-manager.coffee
