Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _elementsHighlight = require('./elements/highlight');

var ProvidersHighlight = (function () {
  function ProvidersHighlight() {
    _classCallCheck(this, ProvidersHighlight);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersHighlight, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      if (!this.hasProvider(provider)) {
        (0, _validate.provider)(provider);
        this.providers.add(provider);
      }
    }
  }, {
    key: 'hasProvider',
    value: function hasProvider(provider) {
      return this.providers.has(provider);
    }
  }, {
    key: 'deleteProvider',
    value: function deleteProvider(provider) {
      if (this.hasProvider(provider)) {
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'trigger',
    value: _asyncToGenerator(function* (textEditor) {
      var editorPath = textEditor.getPath();
      var bufferPosition = textEditor.getCursorBufferPosition();

      if (!editorPath) {
        return [];
      }

      var scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray();
      scopes.push('*');

      var visibleRange = _atom.Range.fromObject([textEditor.bufferPositionForScreenPosition([textEditor.getFirstVisibleScreenRow(), 0]), textEditor.bufferPositionForScreenPosition([textEditor.getLastVisibleScreenRow(), 0])]);
      // Setting this to infinity on purpose, cause the buffer position just marks visible column
      // according to element width
      visibleRange.end.column = Infinity;

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, visibleRange: visibleRange }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsShow)(results);
            }
            return results;
          }));
        }
      });

      var number = ++this.number;
      var results = (yield Promise.all(promises)).reduce(function (items, item) {
        if (Array.isArray(item)) {
          return items.concat(item);
        }
        return items;
      }, []);

      if (number !== this.number || !results.length) {
        // If has been executed one more time, ignore these results
        // Or we just don't have any results
        return [];
      }

      return results;
    })
  }, {
    key: 'paint',
    value: function paint(textEditor, intentions) {
      var markers = [];

      var _loop = function (intention) {
        var matchedText = textEditor.getTextInBufferRange(intention.range);
        var marker = textEditor.markBufferRange(intention.range);
        var element = (0, _elementsHighlight.create)(intention, matchedText.length);
        intention.created({ textEditor: textEditor, element: element, marker: marker, matchedText: matchedText });
        textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'tail',
          item: element
        });
        marker.onDidChange(function (_ref) {
          var start = _ref.newHeadBufferPosition;
          var end = _ref.oldTailBufferPosition;

          element.textContent = _elementsHighlight.PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length);
        });
        markers.push(marker);
      };

      for (var intention of intentions) {
        _loop(intention);
      }
      return new _atom.Disposable(function () {
        markers.forEach(function (marker) {
          try {
            marker.destroy();
          } catch (_) {/* No Op */}
        });
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersHighlight;
})();

exports['default'] = ProvidersHighlight;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9wcm92aWRlcnMtaGlnaGxpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWtDLE1BQU07O3dCQUU2QyxZQUFZOztpQ0FDdEMsc0JBQXNCOztJQUc1RCxrQkFBa0I7QUFJMUIsV0FKUSxrQkFBa0IsR0FJdkI7MEJBSkssa0JBQWtCOztBQUtuQyxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtBQUNmLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMzQjs7ZUFQa0Isa0JBQWtCOztXQVExQixxQkFBQyxRQUEyQixFQUFFO0FBQ3ZDLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9CLGdDQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QjtLQUNGOzs7V0FDVSxxQkFBQyxRQUEyQixFQUFXO0FBQ2hELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDcEM7OztXQUNhLHdCQUFDLFFBQTJCLEVBQUU7QUFDMUMsVUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzlCLFlBQUksQ0FBQyxTQUFTLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGOzs7NkJBQ1ksV0FBQyxVQUFzQixFQUFpQztBQUNuRSxVQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkMsVUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLHVCQUF1QixFQUFFLENBQUE7O0FBRTNELFVBQUksQ0FBQyxVQUFVLEVBQUU7QUFDZixlQUFPLEVBQUUsQ0FBQTtPQUNWOztBQUVELFVBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxnQ0FB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QVcsQ0FBQyxVQUFTLElBQTRELEVBQUU7Y0FBckMsS0FBSyxHQUE5QixJQUE0RCxDQUExRCxxQkFBcUI7Y0FBZ0MsR0FBRyxHQUExRCxJQUE0RCxDQUE1QixxQkFBcUI7O0FBQy9FLGlCQUFPLENBQUMsV0FBVyxHQUFHLHFDQUFrQixNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDckcsQ0FBQyxDQUFBO0FBQ0YsZUFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7O0FBYnRCLFdBQUssSUFBTSxTQUFTLElBQUssVUFBVSxFQUF5QjtjQUFqRCxTQUFTO09BY25CO0FBQ0QsYUFBTyxxQkFBZSxZQUFXO0FBQy9CLGVBQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDL0IsY0FBSTtBQUNGLGtCQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7V0FDakIsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFlO1NBQzVCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdkI7OztTQWxHa0Isa0JBQWtCOzs7cUJBQWxCLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvcHJvdmlkZXJzLWhpZ2hsaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFJhbmdlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBwcm92aWRlciBhcyB2YWxpZGF0ZVByb3ZpZGVyLCBzdWdnZXN0aW9uc1Nob3cgYXMgdmFsaWRhdGVTdWdnZXN0aW9ucyB9IGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyBjcmVhdGUgYXMgY3JlYXRlRWxlbWVudCwgUEFERElOR19DSEFSQUNURVIgfSBmcm9tICcuL2VsZW1lbnRzL2hpZ2hsaWdodCdcbmltcG9ydCB0eXBlIHsgSGlnaGxpZ2h0UHJvdmlkZXIsIEhpZ2hsaWdodEl0ZW0gfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm92aWRlcnNIaWdobGlnaHQge1xuICBudW1iZXI6IG51bWJlcjtcbiAgcHJvdmlkZXJzOiBTZXQ8SGlnaGxpZ2h0UHJvdmlkZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubnVtYmVyID0gMFxuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gIH1cbiAgYWRkUHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKSB7XG4gICAgaWYgKCF0aGlzLmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkge1xuICAgICAgdmFsaWRhdGVQcm92aWRlcihwcm92aWRlcilcbiAgICAgIHRoaXMucHJvdmlkZXJzLmFkZChwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgaGFzUHJvdmlkZXIocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmhhcyhwcm92aWRlcilcbiAgfVxuICBkZWxldGVQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpIHtcbiAgICBpZiAodGhpcy5oYXNQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgYXN5bmMgdHJpZ2dlcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxBcnJheTxIaWdobGlnaHRJdGVtPj4ge1xuICAgIGNvbnN0IGVkaXRvclBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gdGV4dEVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBpZiAoIWVkaXRvclBhdGgpIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlcyA9IHRleHRFZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pLmdldFNjb3Blc0FycmF5KClcbiAgICBzY29wZXMucHVzaCgnKicpXG5cbiAgICBjb25zdCB2aXNpYmxlUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtcbiAgICAgIHRleHRFZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihbdGV4dEVkaXRvci5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKSwgMF0pLFxuICAgICAgdGV4dEVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFt0ZXh0RWRpdG9yLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCksIDBdKSxcbiAgICBdKVxuICAgIC8vIFNldHRpbmcgdGhpcyB0byBpbmZpbml0eSBvbiBwdXJwb3NlLCBjYXVzZSB0aGUgYnVmZmVyIHBvc2l0aW9uIGp1c3QgbWFya3MgdmlzaWJsZSBjb2x1bW5cbiAgICAvLyBhY2NvcmRpbmcgdG8gZWxlbWVudCB3aWR0aFxuICAgIHZpc2libGVSYW5nZS5lbmQuY29sdW1uID0gSW5maW5pdHlcblxuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBpZiAoc2NvcGVzLnNvbWUoc2NvcGUgPT4gcHJvdmlkZXIuZ3JhbW1hclNjb3Blcy5pbmRleE9mKHNjb3BlKSAhPT0gLTEpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIHJlc29sdmUocHJvdmlkZXIuZ2V0SW50ZW50aW9ucyh7IHRleHRFZGl0b3IsIHZpc2libGVSYW5nZSB9KSlcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlU3VnZ2VzdGlvbnMocmVzdWx0cylcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IG51bWJlciA9ICsrdGhpcy5udW1iZXJcbiAgICBjb25zdCByZXN1bHRzID0gKGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKSkucmVkdWNlKGZ1bmN0aW9uKGl0ZW1zLCBpdGVtKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbXMuY29uY2F0KGl0ZW0pXG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbXNcbiAgICB9LCBbXSlcblxuICAgIGlmIChudW1iZXIgIT09IHRoaXMubnVtYmVyIHx8ICFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgLy8gSWYgaGFzIGJlZW4gZXhlY3V0ZWQgb25lIG1vcmUgdGltZSwgaWdub3JlIHRoZXNlIHJlc3VsdHNcbiAgICAgIC8vIE9yIHdlIGp1c3QgZG9uJ3QgaGF2ZSBhbnkgcmVzdWx0c1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxuICBwYWludCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBpbnRlbnRpb25zOiBBcnJheTxIaWdobGlnaHRJdGVtPik6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IG1hcmtlcnMgPSBbXVxuICAgIGZvciAoY29uc3QgaW50ZW50aW9uIG9mIChpbnRlbnRpb25zOiBBcnJheTxIaWdobGlnaHRJdGVtPikpIHtcbiAgICAgIGNvbnN0IG1hdGNoZWRUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShpbnRlbnRpb24ucmFuZ2UpXG4gICAgICBjb25zdCBtYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShpbnRlbnRpb24ucmFuZ2UpXG4gICAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChpbnRlbnRpb24sIG1hdGNoZWRUZXh0Lmxlbmd0aClcbiAgICAgIGludGVudGlvbi5jcmVhdGVkKHsgdGV4dEVkaXRvciwgZWxlbWVudCwgbWFya2VyLCBtYXRjaGVkVGV4dCB9KVxuICAgICAgdGV4dEVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBwb3NpdGlvbjogJ3RhaWwnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICAgIG1hcmtlci5vbkRpZENoYW5nZShmdW5jdGlvbih7IG5ld0hlYWRCdWZmZXJQb3NpdGlvbjogc3RhcnQsIG9sZFRhaWxCdWZmZXJQb3NpdGlvbjogZW5kIH0pIHtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IFBBRERJTkdfQ0hBUkFDVEVSLnJlcGVhdCh0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtzdGFydCwgZW5kXSkubGVuZ3RoKVxuICAgICAgfSlcbiAgICAgIG1hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbihtYXJrZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgICAgIH0gY2F0Y2ggKF8pIHsgLyogTm8gT3AgKi8gfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuY2xlYXIoKVxuICB9XG59XG4iXX0=