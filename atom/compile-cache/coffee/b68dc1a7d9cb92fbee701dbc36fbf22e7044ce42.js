(function() {
  module.exports = {
    config: {
      distractionFree: {
        type: 'object',
        properties: {
          hideFiles: {
            title: 'Tree View',
            description: 'Reduces the opacity of collapsed folders and files',
            type: 'boolean',
            "default": true
          },
          hideTabs: {
            title: 'Tabs',
            description: 'Reduces the opacity of idle tabs',
            type: 'boolean',
            "default": true
          },
          hideBottom: {
            title: 'Status Bar',
            description: 'Reduces the opacity of idle status bar',
            type: 'boolean',
            "default": true
          },
          hideSpotified: {
            title: 'Spotified Package',
            description: 'Reduces the opacity of Spotified package',
            type: 'boolean',
            "default": false
          }
        }
      },
      treeView: {
        type: 'object',
        properties: {
          toggleHovers: {
            title: 'Toggle Tree Item Hover Effect',
            description: 'Adds a rollover hover effect to files/folders in tree view',
            type: 'boolean',
            "default": true
          }
        }
      }
    },
    activate: function(state) {
      return atom.themes.onDidChangeActiveThemes(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dlbmVzaXMtdWkvbGliL3NldHRpbmdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxNQUFBLEVBQ0k7QUFBQSxNQUFBLGVBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFDSTtBQUFBLFVBQUEsU0FBQSxFQUNJO0FBQUEsWUFBQSxLQUFBLEVBQU8sV0FBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLG9EQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLElBSFQ7V0FESjtBQUFBLFVBS0EsUUFBQSxFQUNJO0FBQUEsWUFBQSxLQUFBLEVBQU8sTUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLGtDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLElBSFQ7V0FOSjtBQUFBLFVBVUEsVUFBQSxFQUNJO0FBQUEsWUFBQSxLQUFBLEVBQU8sWUFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHdDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLElBSFQ7V0FYSjtBQUFBLFVBZUEsYUFBQSxFQUNJO0FBQUEsWUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSwwQ0FEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxLQUhUO1dBaEJKO1NBRko7T0FESjtBQUFBLE1BdUJBLFFBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFDSTtBQUFBLFVBQUEsWUFBQSxFQUNJO0FBQUEsWUFBQSxLQUFBLEVBQU8sK0JBQVA7QUFBQSxZQUNBLFdBQUEsRUFBYSw0REFEYjtBQUFBLFlBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxZQUdBLFNBQUEsRUFBUyxJQUhUO1dBREo7U0FGSjtPQXhCSjtLQURKO0FBQUEsSUFpQ0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBWixDQUFvQyxTQUFBLEdBQUE7QUFDaEMsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBO2VBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBQSxFQUZnQztNQUFBLENBQXBDLEVBRE07SUFBQSxDQWpDVjtHQURKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/genesis-ui/lib/settings.coffee
