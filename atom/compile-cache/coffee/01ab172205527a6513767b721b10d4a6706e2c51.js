
/*≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡

	CONFIG DIRECTORY

	_Variables
	_DistractionFree

 * ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
 */

(function() {
  module.exports = {
    apply: function() {
      var hideIdleStatus, hideIdleTabs, hideInactiveFiles, hideSpotifiedPackage, root, toggleItemHoverEffect;
      root = document.documentElement;
      hideInactiveFiles = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-tree-items');
        } else {
          return root.classList.remove('hide-tree-items');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideFiles', function() {
        return hideInactiveFiles(atom.config.get('genesis-ui.distractionFree.hideFiles'));
      });
      hideInactiveFiles(atom.config.get('genesis-ui.distractionFree.hideFiles'));
      hideIdleTabs = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-idle-tabs');
        } else {
          return root.classList.remove('hide-idle-tabs');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideTabs', function() {
        return hideIdleTabs(atom.config.get('genesis-ui.distractionFree.hideTabs'));
      });
      hideIdleTabs(atom.config.get('genesis-ui.distractionFree.hideTabs'));
      hideIdleStatus = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-status-bar');
        } else {
          return root.classList.remove('hide-status-bar');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideBottom', function() {
        return hideIdleStatus(atom.config.get('genesis-ui.distractionFree.hideBottom'));
      });
      hideIdleStatus(atom.config.get('genesis-ui.distractionFree.hideBottom'));
      hideSpotifiedPackage = function(boolean) {
        if (boolean) {
          return root.classList.add('hide-spotified');
        } else {
          return root.classList.remove('hide-spotified');
        }
      };
      atom.config.onDidChange('genesis-ui.distractionFree.hideSpotified', function() {
        return hideSpotifiedPackage(atom.config.get('genesis-ui.distractionFree.hideSpotified'));
      });
      hideSpotifiedPackage(atom.config.get('genesis-ui.distractionFree.hideSpotified'));
      toggleItemHoverEffect = function(boolean) {
        if (boolean) {
          return root.classList.add('add-tree-item-hover');
        } else {
          return root.classList.remove('add-tree-item-hover');
        }
      };
      atom.config.onDidChange('genesis-ui.treeView.toggleHovers', function() {
        return toggleItemHoverEffect(atom.config.get('genesis-ui.treeView.toggleHovers'));
      });
      return toggleItemHoverEffect(atom.config.get('genesis-ui.treeView.toggleHovers'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dlbmVzaXMtdWkvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7Ozs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDQztBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQU1OLFVBQUEsa0dBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsZUFBaEIsQ0FBQTtBQUFBLE1BWUEsaUJBQUEsR0FBb0IsU0FBQyxPQUFELEdBQUE7QUFDbkIsUUFBQSxJQUFHLE9BQUg7aUJBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFmLENBQW1CLGlCQUFuQixFQUREO1NBQUEsTUFBQTtpQkFHQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsaUJBQXRCLEVBSEQ7U0FEbUI7TUFBQSxDQVpwQixDQUFBO0FBQUEsTUFrQkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHNDQUF4QixFQUFnRSxTQUFBLEdBQUE7ZUFDL0QsaUJBQUEsQ0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFsQixFQUQrRDtNQUFBLENBQWhFLENBbEJBLENBQUE7QUFBQSxNQXFCQSxpQkFBQSxDQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQWxCLENBckJBLENBQUE7QUFBQSxNQXdCQSxZQUFBLEdBQWUsU0FBQyxPQUFELEdBQUE7QUFDZCxRQUFBLElBQUcsT0FBSDtpQkFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsZ0JBQW5CLEVBREQ7U0FBQSxNQUFBO2lCQUdDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixDQUFzQixnQkFBdEIsRUFIRDtTQURj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

//# sourceURL=/Users/ah/.atom/packages/genesis-ui/lib/config.coffee
