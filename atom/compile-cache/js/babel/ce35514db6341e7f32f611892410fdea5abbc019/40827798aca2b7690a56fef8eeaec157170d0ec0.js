Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _atom = require('atom');

var _reactForAtom = require('react-for-atom');

var _Blamer = require('./Blamer');

var _Blamer2 = _interopRequireDefault(_Blamer);

var _RemoteRevision = require('./RemoteRevision');

var _RemoteRevision2 = _interopRequireDefault(_RemoteRevision);

var _repositoryForEditorPath = require('./repositoryForEditorPath');

var _repositoryForEditorPath2 = _interopRequireDefault(_repositoryForEditorPath);

var _componentsBlameLine = require('../components/BlameLine');

var _componentsBlameLine2 = _interopRequireDefault(_componentsBlameLine);

var _componentsGutterResize = require('../components/GutterResize');

var _componentsGutterResize2 = _interopRequireDefault(_componentsGutterResize);

'use babel';

var GUTTER_ID = 'com.alexcorre.git-blame';
var GUTTER_STYLE_ID = 'com.alexcorre.git-blame.style';
var RESIZE_DEBOUNCE_MS = 5;

var BlameGutter = (function () {
  function BlameGutter(editor) {
    _classCallCheck(this, BlameGutter);

    this.editor = editor;
    this.isShown = false;
    this.lineDecorations = [];
    this.disposables = new _atom.CompositeDisposable();

    // resize
    var width = atom.config.get('git-blame.columnWidth');
    this.updateGutterWidth(width);

    this.resizeStartWidth = null;
    this.resizeStartX = null;
    this.isResizing = false;
    this.eventListeners = {};
  }

  /**
   * Top level API for toggling gutter visiblity + blaming the currently
   * open file, if any.
   */

  _createClass(BlameGutter, [{
    key: 'toggleVisibility',
    value: function toggleVisibility() {
      return this.setVisibility(!this.isShown);
    }

    /**
     * Set the visibility of the gutter. Bootstraps a new gutter if need be.
     *
     * @returns {Promise<boolean>}
     */
  }, {
    key: 'setVisibility',
    value: function setVisibility(visible) {
      // if we're trying to set the visiblity to the value it already has
      // just resolve and do nothing.
      if (this.isShown === visible) {
        return Promise.resolve(visible);
      }

      // grab filePath from editor
      var editor = this.editor;

      var filePath = editor.isEmpty() ? null : editor.getPath();
      if (!filePath) {
        return Promise.reject(new Error('No filePath could be determined for editor.'));
      }

      if (visible) {
        // we are showing the gutter
        this.gutter().show();
        this.updateLineMarkers(filePath);
      } else {
        this.removeLineMarkers();
        this.gutter().hide();
        this.gutter().destroy();
      }

      this.isShown = visible;
      return Promise.resolve(this.isShown);
    }

    /**
     * Lazily generate a Gutter instance for the current editor, the first time
     * we need it. Any other accesses will grab the same gutter reference until
     * the Gutter is explicitly disposed.
     */
  }, {
    key: 'gutter',
    value: function gutter() {
      var editor = this.editor;

      var gutter = editor.gutterWithName(GUTTER_ID);
      return gutter ? gutter : editor.addGutter({
        name: GUTTER_ID,
        visible: false,
        priority: 100
      });
    }
  }, {
    key: 'updateLineMarkers',
    value: function updateLineMarkers(filePath) {
      var _this = this;

      (0, _repositoryForEditorPath2['default'])(filePath).then(function (repo) {
        var blamer = new _Blamer2['default'](repo);
        return new Promise(function (resolve, reject) {
          blamer.blame(filePath, function (err, data) {
            return err ? reject(err) : resolve([repo, data]);
          });
        });
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var repo = _ref2[0];
        var blameData = _ref2[1];

        var lastHash = null;
        var className = null;

        blameData.forEach(function (lineData) {
          var lineNumber = lineData.lineNumber;
          var hash = lineData.hash;
          var noCommit = lineData.noCommit;

          if (noCommit) {
            return;
          }

          // set alternating background className
          if (lineData.hash !== lastHash) {
            className = className === 'lighter' ? 'darker' : 'lighter';
          }
          lastHash = lineData.hash;

          // generate a link to the commit
          var viewCommitUrl = _RemoteRevision2['default'].create(repo.getOriginURL(filePath)).url(lineData.hash);

          // construct props for BlameLine component
          var lineProps = _extends({}, lineData, {
            className: className,
            viewCommitUrl: viewCommitUrl
          });

          // adding one marker to the first line
          var lineRange = new _atom.Range([lineNumber - 1, 0], [lineNumber - 1, 0]);
          var lineMarker = _this.editor.markBufferRange(lineRange);

          var node = _this.generateLineElement(lineProps);
          var decoration = _this.gutter().decorateMarker(lineMarker, {
            'class': 'blame-line-marker',
            item: node
          });

          _this.lineDecorations.push(decoration);
        });
      });
    }
  }, {
    key: 'removeLineMarkers',
    value: function removeLineMarkers() {
      this.disposables.dispose();
      this.lineDecorations.forEach(function (decoration) {
        decoration.destroy();
      });
    }
  }, {
    key: 'generateLineElement',
    value: function generateLineElement(lineProps) {
      var div = document.createElement('div');

      // Use React to render the BlameLine component
      _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(
        _componentsGutterResize2['default'],
        { onResizeStart: this.onResizeStart.bind(this) },
        _reactForAtom.React.createElement(_componentsBlameLine2['default'], lineProps)
      ), div);

      var tip = atom.tooltips.add(div, {
        title: lineProps.summary,
        placement: 'right'
      });
      this.disposables.add(tip);

      return div;
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart(e) {
      this.isResizing = true;
      this.resizeStartX = e.pageX;
      this.resizeStartWidth = this.width;
      this.bindResizeEvents();
    }
  }, {
    key: 'onResizeEnd',
    value: function onResizeEnd(e) {
      this.unbindResizeEvents();
      this.isResizing = false;
      this.resizeStartX = null;
    }
  }, {
    key: 'onResizeMove',
    value: function onResizeMove(e) {
      var delta = e.pageX - this.resizeStartX;
      this.updateGutterWidth(this.resizeStartWidth + delta);
    }
  }, {
    key: 'bindResizeEvents',
    value: function bindResizeEvents() {
      if (!this.eventListeners['mouseup']) {
        var mouseupHandler = this.onResizeEnd.bind(this);
        this.eventListeners['mouseup'] = mouseupHandler;
        document.addEventListener('mouseup', mouseupHandler);
      }
      if (!this.eventListeners['mousemove']) {
        var mouseMoveHandler = (0, _underscore.debounce)(this.onResizeMove.bind(this), RESIZE_DEBOUNCE_MS);
        this.eventListeners['mousemove'] = mouseMoveHandler;
        document.addEventListener('mousemove', mouseMoveHandler);
      }
    }
  }, {
    key: 'unbindResizeEvents',
    value: function unbindResizeEvents() {
      var _eventListeners = this.eventListeners;
      var mousemove = _eventListeners.mousemove;
      var mouseup = _eventListeners.mouseup;

      document.removeEventListener('mousemove', mousemove);
      delete this.eventListeners.mousemove;
      document.removeEventListener('mouseup', mouseup);
      delete this.eventListeners.mouseup;
    }
  }, {
    key: 'updateGutterWidth',
    value: function updateGutterWidth(newWidth) {
      this.width = newWidth;
      atom.config.set('git-blame.columnWidth', newWidth);

      var tag = document.getElementById(GUTTER_STYLE_ID);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = GUTTER_STYLE_ID;
        tag.type = 'text/css';
        document.head.appendChild(tag);
      }

      var styles = '\n      atom-text-editor .gutter[gutter-name="' + GUTTER_ID + '"] {\n        width: ' + newWidth + 'px;\n      }\n    ';
      tag.textContent = styles;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      gutter().destroy();
    }
  }]);

  return BlameGutter;
})();

exports['default'] = BlameGutter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVHdXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MEJBRW9DLFlBQVk7O29CQUNMLE1BQU07OzRCQUNqQixnQkFBZ0I7O3NCQUU3QixVQUFVOzs7OzhCQUNGLGtCQUFrQjs7Ozt1Q0FDVCwyQkFBMkI7Ozs7bUNBQ3pDLHlCQUF5Qjs7OztzQ0FDdEIsNEJBQTRCOzs7O0FBVnJELFdBQVcsQ0FBQzs7QUFZWixJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLGVBQWUsR0FBRywrQkFBK0IsQ0FBQztBQUN4RCxJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7SUFFUixXQUFXO0FBRW5CLFdBRlEsV0FBVyxDQUVsQixNQUFNLEVBQUU7MEJBRkQsV0FBVzs7QUFHNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRzdDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0dBQzFCOzs7Ozs7O2VBaEJrQixXQUFXOztXQXNCZCw0QkFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENB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LGVBQWUsQ0FBQztBQUN6QixXQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUN0QixnQkFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDaEM7O0FBRUQsVUFBTSxNQUFNLHNEQUM4QixTQUFTLDZCQUN0QyxRQUFRLHVCQUVwQixDQUFDO0FBQ0YsU0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDMUI7OztXQUVNLG1CQUFHO0FBQ1IsWUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDcEI7OztTQXROa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZUd1dHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBtYXAsIGZpbmQsIGRlYm91bmNlIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgUmVhY3QsIFJlYWN0RE9NIH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuXG5pbXBvcnQgQmxhbWVyIGZyb20gJy4vQmxhbWVyJztcbmltcG9ydCBSZW1vdGVSZXZpc2lvbiBmcm9tICcuL1JlbW90ZVJldmlzaW9uJztcbmltcG9ydCByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aCBmcm9tICcuL3JlcG9zaXRvcnlGb3JFZGl0b3JQYXRoJztcbmltcG9ydCBCbGFtZUxpbmUgZnJvbSAnLi4vY29tcG9uZW50cy9CbGFtZUxpbmUnO1xuaW1wb3J0IEd1dHRlclJlc2l6ZSBmcm9tICcuLi9jb21wb25lbnRzL0d1dHRlclJlc2l6ZSc7XG5cbmNvbnN0IEdVVFRFUl9JRCA9ICdjb20uYWxleGNvcnJlLmdpdC1ibGFtZSc7XG5jb25zdCBHVVRURVJfU1RZTEVfSUQgPSAnY29tLmFsZXhjb3JyZS5naXQtYmxhbWUuc3R5bGUnO1xuY29uc3QgUkVTSVpFX0RFQk9VTkNFX01TID0gNTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxhbWVHdXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zID0gW107XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyByZXNpemVcbiAgICBjb25zdCB3aWR0aCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJyk7XG4gICAgdGhpcy51cGRhdGVHdXR0ZXJXaWR0aCh3aWR0aCk7XG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSBudWxsO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0ge307XG4gIH1cblxuICAvKipcbiAgICogVG9wIGxldmVsIEFQSSBmb3IgdG9nZ2xpbmcgZ3V0dGVyIHZpc2libGl0eSArIGJsYW1pbmcgdGhlIGN1cnJlbnRseVxuICAgKiBvcGVuIGZpbGUsIGlmIGFueS5cbiAgICovXG4gIHRvZ2dsZVZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmlzaWJpbGl0eSghdGhpcy5pc1Nob3duKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGd1dHRlci4gQm9vdHN0cmFwcyBhIG5ldyBndXR0ZXIgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBzZXRWaXNpYmlsaXR5KHZpc2libGUpIHtcbiAgICAvLyBpZiB3ZSdyZSB0cnlpbmcgdG8gc2V0IHRoZSB2aXNpYmxpdHkgdG8gdGhlIHZhbHVlIGl0IGFscmVhZHkgaGFzXG4gICAgLy8ganVzdCByZXNvbHZlIGFuZCBkbyBub3RoaW5nLlxuICAgIGlmICh0aGlzLmlzU2hvd24gPT09IHZpc2libGUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JhYiBmaWxlUGF0aCBmcm9tIGVkaXRvclxuICAgIGNvbnN0IHsgZWRpdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmlzRW1wdHkoKSA/IG51bGwgOiBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vIGZpbGVQYXRoIGNvdWxkIGJlIGRldGVybWluZWQgZm9yIGVkaXRvci4nKSk7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIC8vIHdlIGFyZSBzaG93aW5nIHRoZSBndXR0ZXJcbiAgICAgIHRoaXMuZ3V0dGVyKCkuc2hvdygpO1xuICAgICAgdGhpcy51cGRhdGVMaW5lTWFya2VycyhmaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGluZU1hcmtlcnMoKTtcbiAgICAgIHRoaXMuZ3V0dGVyKCkuaGlkZSgpO1xuICAgICAgdGhpcy5ndXR0ZXIoKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1Nob3duID0gdmlzaWJsZTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaXNTaG93bik7XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGdlbmVyYXRlIGEgR3V0dGVyIGluc3RhbmNlIGZvciB0aGUgY3VycmVudCBlZGl0b3IsIHRoZSBmaXJzdCB0aW1lXG4gICAqIHdlIG5lZWQgaXQuIEFueSBvdGhlciBhY2Nlc3NlcyB3aWxsIGdyYWIgdGhlIHNhbWUgZ3V0dGVyIHJlZmVyZW5jZSB1bnRpbFxuICAgKiB0aGUgR3V0dGVyIGlzIGV4cGxpY2l0bHkgZGlzcG9zZWQuXG4gICAqL1xuICBndXR0ZXIoKSB7XG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgZ3V0dGVyID0gZWRpdG9yLmd1dHRlcldpdGhOYW1lKEdVVFRFUl9JRCk7XG4gICAgcmV0dXJuIGd1dHRlciA/IGd1dHRlciA6IGVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgbmFtZTogR1VUVEVSX0lELFxuICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICBwcmlvcml0eTogMTAwLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlTGluZU1hcmtlcnMoZmlsZVBhdGgpIHtcbiAgICByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aChmaWxlUGF0aClcbiAgICAgIC50aGVuKHJlcG8gPT4ge1xuICAgICAgICBjb25zdCBibGFtZXIgPSBuZXcgQmxhbWVyKHJlcG8pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGJsYW1lci5ibGFtZShmaWxlUGF0aCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShbcmVwbywgZGF0YV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoW3JlcG8sIGJsYW1lRGF0YV0pID0+IHtcbiAgICAgICAgbGV0IGxhc3RIYXNoID0gbnVsbDtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IG51bGw7XG5cbiAgICAgICAgYmxhbWVEYXRhLmZvckVhY2gobGluZURhdGEgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgbGluZU51bWJlciwgaGFzaCwgbm9Db21taXQgfSA9IGxpbmVEYXRhO1xuICAgICAgICAgIGlmIChub0NvbW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNldCBhbHRlcm5hdGluZyBiYWNrZ3JvdW5kIGNsYXNzTmFtZVxuICAgICAgICAgIGlmIChsaW5lRGF0YS5oYXNoICE9PSBsYXN0SGFzaCkge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKGNsYXNzTmFtZSA9PT0gJ2xpZ2h0ZXInKSA/ICdkYXJrZXInIDogJ2xpZ2h0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0SGFzaCA9IGxpbmVEYXRhLmhhc2g7XG5cbiAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGxpbmsgdG8gdGhlIGNvbW1pdFxuICAgICAgICAgIGNvbnN0IHZpZXdDb21taXRVcmwgPSBSZW1vdGVSZXZpc2lvbi5jcmVhdGUocmVwby5nZXRPcmlnaW5VUkwoZmlsZVBhdGgpKS51cmwobGluZURhdGEuaGFzaCk7XG5cbiAgICAgICAgICAvLyBjb25zdHJ1Y3QgcHJvcHMgZm9yIEJsYW1lTGluZSBjb21wb25lbnRcbiAgICAgICAgICBjb25zdCBsaW5lUHJvcHMgPSB7XG4gICAgICAgICAgICAuLi5saW5lRGF0YSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgIHZpZXdDb21taXRVcmwsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIGFkZGluZyBvbmUgbWFya2VyIHRvIHRoZSBmaXJzdCBsaW5lXG4gICAgICAgICAgY29uc3QgbGluZVJhbmdlID0gbmV3IFJhbmdlKFtsaW5lTnVtYmVyIC0gMSwgMF0sIFtsaW5lTnVtYmVyIC0gMSwgMF0pO1xuICAgICAgICAgIGNvbnN0IGxpbmVNYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobGluZVJhbmdlKTtcblxuICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdlbmVyYXRlTGluZUVsZW1lbnQobGluZVByb3BzKTtcbiAgICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gdGhpcy5ndXR0ZXIoKS5kZWNvcmF0ZU1hcmtlcihsaW5lTWFya2VyLCB7XG4gICAgICAgICAgICBjbGFzczogJ2JsYW1lLWxpbmUtbWFya2VyJyxcbiAgICAgICAgICAgIGl0ZW06IG5vZGUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5wdXNoKGRlY29yYXRpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmVMaW5lTWFya2VycygpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4ge1xuICAgICAgZGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfSk7XG4gIH1cblxuICBnZW5lcmF0ZUxpbmVFbGVtZW50KGxpbmVQcm9wcykge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLy8gVXNlIFJlYWN0IHRvIHJlbmRlciB0aGUgQmxhbWVMaW5lIGNvbXBvbmVudFxuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgIDxHdXR0ZXJSZXNpemUgb25SZXNpemVTdGFydD17dGhpcy5vblJlc2l6ZVN0YXJ0LmJpbmQodGhpcyl9PlxuICAgICAgICA8QmxhbWVMaW5lIHsuLi5saW5lUHJvcHN9IC8+XG4gICAgICA8L0d1dHRlclJlc2l6ZT4sXG4gICAgICBkaXZcbiAgICApO1xuXG4gICAgY29uc3QgdGlwID0gYXRvbS50b29sdGlwcy5hZGQoZGl2LCB7XG4gICAgICB0aXRsZTogbGluZVByb3BzLnN1bW1hcnksXG4gICAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgfSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGlwKTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICBvblJlc2l6ZVN0YXJ0KGUpIHtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gZS5wYWdlWDtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSB0aGlzLndpZHRoO1xuICAgIHRoaXMuYmluZFJlc2l6ZUV2ZW50cygpO1xuICB9XG5cbiAgb25SZXNpemVFbmQoZSkge1xuICAgIHRoaXMudW5iaW5kUmVzaXplRXZlbnRzKCk7XG4gICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZXNpemVTdGFydFggPSBudWxsO1xuICB9XG5cbiAgb25SZXNpemVNb3ZlKGUpIHtcbiAgICBjb25zdCBkZWx0YSA9IGUucGFnZVggLSB0aGlzLnJlc2l6ZVN0YXJ0WDtcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcldpZHRoKHRoaXMucmVzaXplU3RhcnRXaWR0aCArIGRlbHRhKTtcbiAgfVxuXG4gIGJpbmRSZXNpemVFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzWydtb3VzZXVwJ10pIHtcbiAgICAgIGNvbnN0IG1vdXNldXBIYW5kbGVyID0gdGhpcy5vblJlc2l6ZUVuZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyc1snbW91c2V1cCddID0gbW91c2V1cEhhbmRsZXI7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnNbJ21vdXNlbW92ZSddKSB7XG4gICAgICBjb25zdCBtb3VzZU1vdmVIYW5kbGVyID0gZGVib3VuY2UodGhpcy5vblJlc2l6ZU1vdmUuYmluZCh0aGlzKSwgUkVTSVpFX0RFQk9VTkNFX01TKTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnNbJ21vdXNlbW92ZSddID0gbW91c2VNb3ZlSGFuZGxlcjtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHVuYmluZFJlc2l6ZUV2ZW50cygpIHtcbiAgICBjb25zdCB7IG1vdXNlbW92ZSwgbW91c2V1cCB9ID0gdGhpcy5ldmVudExpc3RlbmVycztcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2V1cDtcbiAgfVxuXG4gIHVwZGF0ZUd1dHRlcldpZHRoKG5ld1dpZHRoKSB7XG4gICAgdGhpcy53aWR0aCA9IG5ld1dpZHRoO1xuICAgIGF0b20uY29uZmlnLnNldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJywgbmV3V2lkdGgpO1xuXG4gICAgbGV0IHRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEdVVFRFUl9TVFlMRV9JRCk7XG4gICAgaWYgKCF0YWcpIHtcbiAgICAgIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICB0YWcuaWQgPSBHVVRURVJfU1RZTEVfSUQ7XG4gICAgICB0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRhZyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGVzID0gYFxuICAgICAgYXRvbS10ZXh0LWVkaXRvciAuZ3V0dGVyW2d1dHRlci1uYW1lPVwiJHtHVVRURVJfSUR9XCJdIHtcbiAgICAgICAgd2lkdGg6ICR7bmV3V2lkdGh9cHg7XG4gICAgICB9XG4gICAgYDtcbiAgICB0YWcudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIGd1dHRlcigpLmRlc3Ryb3koKTtcbiAgfVxuXG59XG4iXX0=