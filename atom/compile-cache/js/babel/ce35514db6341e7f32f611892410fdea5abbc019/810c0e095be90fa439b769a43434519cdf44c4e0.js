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
        var remoteRevision = new _RemoteRevision2['default'](repo.getOriginURL(filePath));
        var hasUrlTemplate = !!remoteRevision.getTemplate();

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
          var viewCommitUrl = hasUrlTemplate ? remoteRevision.url(lineData.hash) : '#';

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
      this.gutter().destroy();
    }
  }]);

  return BlameGutter;
})();

exports['default'] = BlameGutter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVHdXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MEJBRW9DLFlBQVk7O29CQUNMLE1BQU07OzRCQUNqQixnQkFBZ0I7O3NCQUU3QixVQUFVOzs7OzhCQUNGLGtCQUFrQjs7Ozt1Q0FDVCwyQkFBMkI7Ozs7bUNBQ3pDLHlCQUF5Qjs7OztzQ0FDdEIsNEJBQTRCOzs7O0FBVnJELFdBQVcsQ0FBQzs7QUFZWixJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLGVBQWUsR0FBRywrQkFBK0IsQ0FBQztBQUN4RCxJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7SUFFUixXQUFXO0FBRW5CLFdBRlEsV0FBVyxDQUVsQixNQUFNLEVBQUU7MEJBRkQsV0FBVzs7QUFHNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRzdDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0dBQzFCOzs7Ozs7O2VBaEJrQixXQUFXOztXQXNCZCw0QkFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENB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bkQsVUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFdBQUcsQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFDO0FBQ3pCLFdBQUcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGdCQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNoQzs7QUFFRCxVQUFNLE1BQU0sc0RBQzhCLFNBQVMsNkJBQ3RDLFFBQVEsdUJBRXBCLENBQUM7QUFDRixTQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztLQUMxQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztTQXhOa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZUd1dHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBtYXAsIGZpbmQsIGRlYm91bmNlIH0gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgUmVhY3QsIFJlYWN0RE9NIH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuXG5pbXBvcnQgQmxhbWVyIGZyb20gJy4vQmxhbWVyJztcbmltcG9ydCBSZW1vdGVSZXZpc2lvbiBmcm9tICcuL1JlbW90ZVJldmlzaW9uJztcbmltcG9ydCByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aCBmcm9tICcuL3JlcG9zaXRvcnlGb3JFZGl0b3JQYXRoJztcbmltcG9ydCBCbGFtZUxpbmUgZnJvbSAnLi4vY29tcG9uZW50cy9CbGFtZUxpbmUnO1xuaW1wb3J0IEd1dHRlclJlc2l6ZSBmcm9tICcuLi9jb21wb25lbnRzL0d1dHRlclJlc2l6ZSc7XG5cbmNvbnN0IEdVVFRFUl9JRCA9ICdjb20uYWxleGNvcnJlLmdpdC1ibGFtZSc7XG5jb25zdCBHVVRURVJfU1RZTEVfSUQgPSAnY29tLmFsZXhjb3JyZS5naXQtYmxhbWUuc3R5bGUnO1xuY29uc3QgUkVTSVpFX0RFQk9VTkNFX01TID0gNTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxhbWVHdXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zID0gW107XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyByZXNpemVcbiAgICBjb25zdCB3aWR0aCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJyk7XG4gICAgdGhpcy51cGRhdGVHdXR0ZXJXaWR0aCh3aWR0aCk7XG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSBudWxsO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0ge307XG4gIH1cblxuICAvKipcbiAgICogVG9wIGxldmVsIEFQSSBmb3IgdG9nZ2xpbmcgZ3V0dGVyIHZpc2libGl0eSArIGJsYW1pbmcgdGhlIGN1cnJlbnRseVxuICAgKiBvcGVuIGZpbGUsIGlmIGFueS5cbiAgICovXG4gIHRvZ2dsZVZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmlzaWJpbGl0eSghdGhpcy5pc1Nob3duKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGd1dHRlci4gQm9vdHN0cmFwcyBhIG5ldyBndXR0ZXIgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBzZXRWaXNpYmlsaXR5KHZpc2libGUpIHtcbiAgICAvLyBpZiB3ZSdyZSB0cnlpbmcgdG8gc2V0IHRoZSB2aXNpYmxpdHkgdG8gdGhlIHZhbHVlIGl0IGFscmVhZHkgaGFzXG4gICAgLy8ganVzdCByZXNvbHZlIGFuZCBkbyBub3RoaW5nLlxuICAgIGlmICh0aGlzLmlzU2hvd24gPT09IHZpc2libGUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JhYiBmaWxlUGF0aCBmcm9tIGVkaXRvclxuICAgIGNvbnN0IHsgZWRpdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmlzRW1wdHkoKSA/IG51bGwgOiBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vIGZpbGVQYXRoIGNvdWxkIGJlIGRldGVybWluZWQgZm9yIGVkaXRvci4nKSk7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIC8vIHdlIGFyZSBzaG93aW5nIHRoZSBndXR0ZXJcbiAgICAgIHRoaXMuZ3V0dGVyKCkuc2hvdygpO1xuICAgICAgdGhpcy51cGRhdGVMaW5lTWFya2VycyhmaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGluZU1hcmtlcnMoKTtcbiAgICAgIHRoaXMuZ3V0dGVyKCkuaGlkZSgpO1xuICAgICAgdGhpcy5ndXR0ZXIoKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1Nob3duID0gdmlzaWJsZTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaXNTaG93bik7XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGdlbmVyYXRlIGEgR3V0dGVyIGluc3RhbmNlIGZvciB0aGUgY3VycmVudCBlZGl0b3IsIHRoZSBmaXJzdCB0aW1lXG4gICAqIHdlIG5lZWQgaXQuIEFueSBvdGhlciBhY2Nlc3NlcyB3aWxsIGdyYWIgdGhlIHNhbWUgZ3V0dGVyIHJlZmVyZW5jZSB1bnRpbFxuICAgKiB0aGUgR3V0dGVyIGlzIGV4cGxpY2l0bHkgZGlzcG9zZWQuXG4gICAqL1xuICBndXR0ZXIoKSB7XG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgZ3V0dGVyID0gZWRpdG9yLmd1dHRlcldpdGhOYW1lKEdVVFRFUl9JRCk7XG4gICAgcmV0dXJuIGd1dHRlciA/IGd1dHRlciA6IGVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgbmFtZTogR1VUVEVSX0lELFxuICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICBwcmlvcml0eTogMTAwLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlTGluZU1hcmtlcnMoZmlsZVBhdGgpIHtcbiAgICByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aChmaWxlUGF0aClcbiAgICAgIC50aGVuKHJlcG8gPT4ge1xuICAgICAgICBjb25zdCBibGFtZXIgPSBuZXcgQmxhbWVyKHJlcG8pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGJsYW1lci5ibGFtZShmaWxlUGF0aCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShbcmVwbywgZGF0YV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoW3JlcG8sIGJsYW1lRGF0YV0pID0+IHtcbiAgICAgICAgbGV0IGxhc3RIYXNoID0gbnVsbDtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9IG51bGw7XG4gICAgICAgIGxldCByZW1vdGVSZXZpc2lvbiA9IG5ldyBSZW1vdGVSZXZpc2lvbihyZXBvLmdldE9yaWdpblVSTChmaWxlUGF0aCkpO1xuICAgICAgICBsZXQgaGFzVXJsVGVtcGxhdGUgPSAhIXJlbW90ZVJldmlzaW9uLmdldFRlbXBsYXRlKCk7XG5cbiAgICAgICAgYmxhbWVEYXRhLmZvckVhY2gobGluZURhdGEgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgbGluZU51bWJlciwgaGFzaCwgbm9Db21taXQgfSA9IGxpbmVEYXRhO1xuICAgICAgICAgIGlmIChub0NvbW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNldCBhbHRlcm5hdGluZyBiYWNrZ3JvdW5kIGNsYXNzTmFtZVxuICAgICAgICAgIGlmIChsaW5lRGF0YS5oYXNoICE9PSBsYXN0SGFzaCkge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKGNsYXNzTmFtZSA9PT0gJ2xpZ2h0ZXInKSA/ICdkYXJrZXInIDogJ2xpZ2h0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0SGFzaCA9IGxpbmVEYXRhLmhhc2g7XG5cbiAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGxpbmsgdG8gdGhlIGNvbW1pdFxuICAgICAgICAgIGNvbnN0IHZpZXdDb21taXRVcmwgPSBoYXNVcmxUZW1wbGF0ZSA/IHJlbW90ZVJldmlzaW9uLnVybChsaW5lRGF0YS5oYXNoKSA6ICcjJztcblxuICAgICAgICAgIC8vIGNvbnN0cnVjdCBwcm9wcyBmb3IgQmxhbWVMaW5lIGNvbXBvbmVudFxuICAgICAgICAgIGNvbnN0IGxpbmVQcm9wcyA9IHtcbiAgICAgICAgICAgIC4uLmxpbmVEYXRhLFxuICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgdmlld0NvbW1pdFVybCxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gYWRkaW5nIG9uZSBtYXJrZXIgdG8gdGhlIGZpcnN0IGxpbmVcbiAgICAgICAgICBjb25zdCBsaW5lUmFuZ2UgPSBuZXcgUmFuZ2UoW2xpbmVOdW1iZXIgLSAxLCAwXSwgW2xpbmVOdW1iZXIgLSAxLCAwXSk7XG4gICAgICAgICAgY29uc3QgbGluZU1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShsaW5lUmFuZ2UpO1xuXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2VuZXJhdGVMaW5lRWxlbWVudChsaW5lUHJvcHMpO1xuICAgICAgICAgIGNvbnN0IGRlY29yYXRpb24gPSB0aGlzLmd1dHRlcigpLmRlY29yYXRlTWFya2VyKGxpbmVNYXJrZXIsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnYmxhbWUtbGluZS1tYXJrZXInLFxuICAgICAgICAgICAgaXRlbTogbm9kZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMubGluZURlY29yYXRpb25zLnB1c2goZGVjb3JhdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZUxpbmVNYXJrZXJzKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zLmZvckVhY2goZGVjb3JhdGlvbiA9PiB7XG4gICAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdlbmVyYXRlTGluZUVsZW1lbnQobGluZVByb3BzKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvLyBVc2UgUmVhY3QgdG8gcmVuZGVyIHRoZSBCbGFtZUxpbmUgY29tcG9uZW50XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgPEd1dHRlclJlc2l6ZSBvblJlc2l6ZVN0YXJ0PXt0aGlzLm9uUmVzaXplU3RhcnQuYmluZCh0aGlzKX0+XG4gICAgICAgIDxCbGFtZUxpbmUgey4uLmxpbmVQcm9wc30gLz5cbiAgICAgIDwvR3V0dGVyUmVzaXplPixcbiAgICAgIGRpdlxuICAgICk7XG5cbiAgICBjb25zdCB0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZChkaXYsIHtcbiAgICAgIHRpdGxlOiBsaW5lUHJvcHMuc3VtbWFyeSxcbiAgICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB9KTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aXApO1xuXG4gICAgcmV0dXJuIGRpdjtcbiAgfVxuXG4gIG9uUmVzaXplU3RhcnQoZSkge1xuICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgdGhpcy5yZXNpemVTdGFydFggPSBlLnBhZ2VYO1xuICAgIHRoaXMucmVzaXplU3RhcnRXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5iaW5kUmVzaXplRXZlbnRzKCk7XG4gIH1cblxuICBvblJlc2l6ZUVuZChlKSB7XG4gICAgdGhpcy51bmJpbmRSZXNpemVFdmVudHMoKTtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0WCA9IG51bGw7XG4gIH1cblxuICBvblJlc2l6ZU1vdmUoZSkge1xuICAgIGNvbnN0IGRlbHRhID0gZS5wYWdlWCAtIHRoaXMucmVzaXplU3RhcnRYO1xuICAgIHRoaXMudXBkYXRlR3V0dGVyV2lkdGgodGhpcy5yZXNpemVTdGFydFdpZHRoICsgZGVsdGEpO1xuICB9XG5cbiAgYmluZFJlc2l6ZUV2ZW50cygpIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnNbJ21vdXNldXAnXSkge1xuICAgICAgY29uc3QgbW91c2V1cEhhbmRsZXIgPSB0aGlzLm9uUmVzaXplRW5kLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzWydtb3VzZXVwJ10gPSBtb3VzZXVwSGFuZGxlcjtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwSGFuZGxlcik7XG4gICAgfVxuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVyc1snbW91c2Vtb3ZlJ10pIHtcbiAgICAgIGNvbnN0IG1vdXNlTW92ZUhhbmRsZXIgPSBkZWJvdW5jZSh0aGlzLm9uUmVzaXplTW92ZS5iaW5kKHRoaXMpLCBSRVNJWkVfREVCT1VOQ0VfTVMpO1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyc1snbW91c2Vtb3ZlJ10gPSBtb3VzZU1vdmVIYW5kbGVyO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlcik7XG4gICAgfVxuICB9XG5cbiAgdW5iaW5kUmVzaXplRXZlbnRzKCkge1xuICAgIGNvbnN0IHsgbW91c2Vtb3ZlLCBtb3VzZXVwIH0gPSB0aGlzLmV2ZW50TGlzdGVuZXJzO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2Vtb3ZlO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZXVwO1xuICB9XG5cbiAgdXBkYXRlR3V0dGVyV2lkdGgobmV3V2lkdGgpIHtcbiAgICB0aGlzLndpZHRoID0gbmV3V2lkdGg7XG4gICAgYXRvbS5jb25maWcuc2V0KCdnaXQtYmxhbWUuY29sdW1uV2lkdGgnLCBuZXdXaWR0aCk7XG5cbiAgICBsZXQgdGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoR1VUVEVSX1NUWUxFX0lEKTtcbiAgICBpZiAoIXRhZykge1xuICAgICAgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIHRhZy5pZCA9IEdVVFRFUl9TVFlMRV9JRDtcbiAgICAgIHRhZy50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGFnKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZXMgPSBgXG4gICAgICBhdG9tLXRleHQtZWRpdG9yIC5ndXR0ZXJbZ3V0dGVyLW5hbWU9XCIke0dVVFRFUl9JRH1cIl0ge1xuICAgICAgICB3aWR0aDogJHtuZXdXaWR0aH1weDtcbiAgICAgIH1cbiAgICBgO1xuICAgIHRhZy50ZXh0Q29udGVudCA9IHN0eWxlcztcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5ndXR0ZXIoKS5kZXN0cm95KCk7XG4gIH1cblxufVxuIl19