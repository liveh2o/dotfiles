(function() {
  describe('Bottom Status Element', function() {
    var BottomStatus, bottomStatus;
    BottomStatus = require('../../lib/ui/bottom-status');
    bottomStatus = null;
    beforeEach(function() {
      return bottomStatus = new BottomStatus;
    });
    return describe('::visibility', function() {
      it('adds and removes the hidden attribute', function() {
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = true;
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = false;
        expect(bottomStatus.hasAttribute('hidden')).toBe(true);
        bottomStatus.visibility = true;
        return expect(bottomStatus.hasAttribute('hidden')).toBe(false);
      });
      return it('reports the visibility when getter is invoked', function() {
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = true;
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = false;
        expect(bottomStatus.visibility).toBe(false);
        bottomStatus.visibility = true;
        return expect(bottomStatus.visibility).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1zdGF0dXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLDBCQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLDRCQUFSLENBQWYsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLElBRGYsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULFlBQUEsR0FBZSxHQUFBLENBQUEsYUFETjtJQUFBLENBQVgsQ0FIQSxDQUFBO1dBTUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUEwQixRQUExQixDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsS0FBakQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxZQUFZLENBQUMsVUFBYixHQUEwQixJQUQxQixDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELEtBQWpELENBRkEsQ0FBQTtBQUFBLFFBR0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsS0FIMUIsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFiLENBQTBCLFFBQTFCLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxJQUFqRCxDQUpBLENBQUE7QUFBQSxRQUtBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLElBTDFCLENBQUE7ZUFNQSxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELEtBQWpELEVBUDBDO01BQUEsQ0FBNUMsQ0FBQSxDQUFBO2FBU0EsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxRQUFBLE1BQUEsQ0FBTyxZQUFZLENBQUMsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxDQUFBLENBQUE7QUFBQSxRQUNBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLElBRDFCLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxZQUFZLENBQUMsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxDQUZBLENBQUE7QUFBQSxRQUdBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLEtBSDFCLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxZQUFZLENBQUMsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxLQUFyQyxDQUpBLENBQUE7QUFBQSxRQUtBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLElBTDFCLENBQUE7ZUFNQSxNQUFBLENBQU8sWUFBWSxDQUFDLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsSUFBckMsRUFQa0Q7TUFBQSxDQUFwRCxFQVZ1QjtJQUFBLENBQXpCLEVBUGdDO0VBQUEsQ0FBbEMsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/linter/spec/ui/bottom-status-spec.coffee
