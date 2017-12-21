Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atom = require('atom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

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

    (0, _lodash.bindAll)(this, ['onResizeStart']);

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
      return gutter || editor.addGutter({
        name: GUTTER_ID,
        visible: false,
        priority: 100
      });
    }
  }, {
    key: 'updateLineMarkers',
    value: function updateLineMarkers(filePath) {
      var _this = this;

      var showOnlyLastNames = atom.config.get('git-blame.showOnlyLastNames');
      var showHash = atom.config.get('git-blame.showHash');
      var colorCommitAuthors = atom.config.get('git-blame.colorCommitAuthors');
      return (0, _repositoryForEditorPath2['default'])(filePath).then(function (repo) {
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

        var remoteRevision = new _RemoteRevision2['default'](repo.getOriginURL(filePath));
        var hasUrlTemplate = !!remoteRevision.getTemplate();
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
          if (hash !== lastHash) {
            className = className === 'lighter' ? 'darker' : 'lighter';
          }
          lastHash = hash;

          // generate a link to the commit
          var viewCommitUrl = hasUrlTemplate ? remoteRevision.url(lineData.hash) : '#';

          // construct props for BlameLine component
          var lineProps = _extends({}, lineData, {
            className: className,
            viewCommitUrl: viewCommitUrl,
            showOnlyLastNames: showOnlyLastNames,
            showHash: showHash,
            colorCommitAuthors: colorCommitAuthors
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
      this.disposables = new _atom.CompositeDisposable();
      this.lineDecorations.forEach(function (decoration) {
        decoration.destroy();
      });
    }
  }, {
    key: 'generateLineElement',
    value: function generateLineElement(lineProps) {
      var div = document.createElement('div');

      // Use React to render the BlameLine component
      _reactDom2['default'].render(_react2['default'].createElement(
        _componentsGutterResize2['default'],
        { onResizeStart: this.onResizeStart },
        _react2['default'].createElement(_componentsBlameLine2['default'], lineProps)
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
    value: function onResizeEnd() {
      this.unbindResizeEvents();
      this.isResizing = false;
      this.resizeStartX = null;
    }
  }, {
    key: 'onResizeMove',
    value: function onResizeMove(e) {
      if (!this.resizeStartX) {
        return;
      }
      var delta = e.pageX - this.resizeStartX;
      this.updateGutterWidth(this.resizeStartWidth + delta);
    }
  }, {
    key: 'bindResizeEvents',
    value: function bindResizeEvents() {
      if (!this.eventListeners.mouseup) {
        var mouseupHandler = this.onResizeEnd.bind(this);
        this.eventListeners.mouseup = mouseupHandler;
        document.addEventListener('mouseup', mouseupHandler);
      }
      if (!this.eventListeners.mousemove) {
        var mouseMoveHandler = (0, _lodash.debounce)(this.onResizeMove.bind(this), RESIZE_DEBOUNCE_MS);
        this.eventListeners.mousemove = mouseMoveHandler;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZUd1dHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFa0MsUUFBUTs7b0JBQ0MsTUFBTTs7cUJBQy9CLE9BQU87Ozs7d0JBQ0osV0FBVzs7OztzQkFFYixVQUFVOzs7OzhCQUNGLGtCQUFrQjs7Ozt1Q0FDVCwyQkFBMkI7Ozs7bUNBQ3pDLHlCQUF5Qjs7OztzQ0FDdEIsNEJBQTRCOzs7O0FBWHJELFdBQVcsQ0FBQzs7QUFhWixJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLGVBQWUsR0FBRywrQkFBK0IsQ0FBQztBQUN4RCxJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7SUFFUixXQUFXO0FBRW5CLFdBRlEsV0FBVyxDQUVsQixNQUFNLEVBQUU7MEJBRkQsV0FBVzs7QUFHNUIseUJBQVEsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRzdDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0dBQzFCOzs7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LG1CQUFtQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ3JDLGNBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakQsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztLQUNwQzs7O1dBRWdCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUN0QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNuRCxVQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsV0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEMsV0FBRyxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDekIsV0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDdEIsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2hDOztBQUVELFVBQU0sTUFBTSxzREFDOEIsU0FBUyw2QkFDdEMsUUFBUSx1QkFFcEIsQ0FBQztBQUNGLFNBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0tBQzFCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6Qjs7O1NBcE9rQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvdGVzdC8uZG90ZmlsZXMvYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVHdXR0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgZGVib3VuY2UsIGJpbmRBbGwgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcblxuaW1wb3J0IEJsYW1lciBmcm9tICcuL0JsYW1lcic7XG5pbXBvcnQgUmVtb3RlUmV2aXNpb24gZnJvbSAnLi9SZW1vdGVSZXZpc2lvbic7XG5pbXBvcnQgcmVwb3NpdG9yeUZvckVkaXRvclBhdGggZnJvbSAnLi9yZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aCc7XG5pbXBvcnQgQmxhbWVMaW5lIGZyb20gJy4uL2NvbXBvbmVudHMvQmxhbWVMaW5lJztcbmltcG9ydCBHdXR0ZXJSZXNpemUgZnJvbSAnLi4vY29tcG9uZW50cy9HdXR0ZXJSZXNpemUnO1xuXG5jb25zdCBHVVRURVJfSUQgPSAnY29tLmFsZXhjb3JyZS5naXQtYmxhbWUnO1xuY29uc3QgR1VUVEVSX1NUWUxFX0lEID0gJ2NvbS5hbGV4Y29ycmUuZ2l0LWJsYW1lLnN0eWxlJztcbmNvbnN0IFJFU0laRV9ERUJPVU5DRV9NUyA9IDU7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsYW1lR3V0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICBiaW5kQWxsKHRoaXMsIFsnb25SZXNpemVTdGFydCddKTtcblxuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zID0gW107XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyByZXNpemVcbiAgICBjb25zdCB3aWR0aCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJyk7XG4gICAgdGhpcy51cGRhdGVHdXR0ZXJXaWR0aCh3aWR0aCk7XG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSBudWxsO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0ge307XG4gIH1cblxuICAvKipcbiAgICogVG9wIGxldmVsIEFQSSBmb3IgdG9nZ2xpbmcgZ3V0dGVyIHZpc2libGl0eSArIGJsYW1pbmcgdGhlIGN1cnJlbnRseVxuICAgKiBvcGVuIGZpbGUsIGlmIGFueS5cbiAgICovXG4gIHRvZ2dsZVZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmlzaWJpbGl0eSghdGhpcy5pc1Nob3duKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGd1dHRlci4gQm9vdHN0cmFwcyBhIG5ldyBndXR0ZXIgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBzZXRWaXNpYmlsaXR5KHZpc2libGUpIHtcbiAgICAvLyBpZiB3ZSdyZSB0cnlpbmcgdG8gc2V0IHRoZSB2aXNpYmxpdHkgdG8gdGhlIHZhbHVlIGl0IGFscmVhZHkgaGFzXG4gICAgLy8ganVzdCByZXNvbHZlIGFuZCBkbyBub3RoaW5nLlxuICAgIGlmICh0aGlzLmlzU2hvd24gPT09IHZpc2libGUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JhYiBmaWxlUGF0aCBmcm9tIGVkaXRvclxuICAgIGNvbnN0IHsgZWRpdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmlzRW1wdHkoKSA/IG51bGwgOiBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vIGZpbGVQYXRoIGNvdWxkIGJlIGRldGVybWluZWQgZm9yIGVkaXRvci4nKSk7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIC8vIHdlIGFyZSBzaG93aW5nIHRoZSBndXR0ZXJcbiAgICAgIHRoaXMuZ3V0dGVyKCkuc2hvdygpO1xuICAgICAgdGhpcy51cGRhdGVMaW5lTWFya2VycyhmaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGluZU1hcmtlcnMoKTtcbiAgICAgIHRoaXMuZ3V0dGVyKCkuaGlkZSgpO1xuICAgICAgdGhpcy5ndXR0ZXIoKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1Nob3duID0gdmlzaWJsZTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaXNTaG93bik7XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGdlbmVyYXRlIGEgR3V0dGVyIGluc3RhbmNlIGZvciB0aGUgY3VycmVudCBlZGl0b3IsIHRoZSBmaXJzdCB0aW1lXG4gICAqIHdlIG5lZWQgaXQuIEFueSBvdGhlciBhY2Nlc3NlcyB3aWxsIGdyYWIgdGhlIHNhbWUgZ3V0dGVyIHJlZmVyZW5jZSB1bnRpbFxuICAgKiB0aGUgR3V0dGVyIGlzIGV4cGxpY2l0bHkgZGlzcG9zZWQuXG4gICAqL1xuICBndXR0ZXIoKSB7XG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgZ3V0dGVyID0gZWRpdG9yLmd1dHRlcldpdGhOYW1lKEdVVFRFUl9JRCk7XG4gICAgcmV0dXJuIGd1dHRlciB8fCBlZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6IEdVVFRFUl9JRCxcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUxpbmVNYXJrZXJzKGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgc2hvd09ubHlMYXN0TmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5zaG93T25seUxhc3ROYW1lcycpO1xuICAgIGNvbnN0IHNob3dIYXNoID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuc2hvd0hhc2gnKTtcbiAgICBjb25zdCBjb2xvckNvbW1pdEF1dGhvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5jb2xvckNvbW1pdEF1dGhvcnMnKTtcbiAgICByZXR1cm4gcmVwb3NpdG9yeUZvckVkaXRvclBhdGgoZmlsZVBhdGgpXG4gICAgICAudGhlbigocmVwbykgPT4ge1xuICAgICAgICBjb25zdCBibGFtZXIgPSBuZXcgQmxhbWVyKHJlcG8pO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGJsYW1lci5ibGFtZShmaWxlUGF0aCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShbcmVwbywgZGF0YV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoW3JlcG8sIGJsYW1lRGF0YV0pID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3RlUmV2aXNpb24gPSBuZXcgUmVtb3RlUmV2aXNpb24ocmVwby5nZXRPcmlnaW5VUkwoZmlsZVBhdGgpKTtcbiAgICAgICAgY29uc3QgaGFzVXJsVGVtcGxhdGUgPSAhIXJlbW90ZVJldmlzaW9uLmdldFRlbXBsYXRlKCk7XG4gICAgICAgIGxldCBsYXN0SGFzaCA9IG51bGw7XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSBudWxsO1xuXG4gICAgICAgIGJsYW1lRGF0YS5mb3JFYWNoKChsaW5lRGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgbGluZU51bWJlciwgaGFzaCwgbm9Db21taXQgfSA9IGxpbmVEYXRhO1xuICAgICAgICAgIGlmIChub0NvbW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNldCBhbHRlcm5hdGluZyBiYWNrZ3JvdW5kIGNsYXNzTmFtZVxuICAgICAgICAgIGlmIChoYXNoICE9PSBsYXN0SGFzaCkge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKGNsYXNzTmFtZSA9PT0gJ2xpZ2h0ZXInKSA/ICdkYXJrZXInIDogJ2xpZ2h0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0SGFzaCA9IGhhc2g7XG5cbiAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGxpbmsgdG8gdGhlIGNvbW1pdFxuICAgICAgICAgIGNvbnN0IHZpZXdDb21taXRVcmwgPSBoYXNVcmxUZW1wbGF0ZSA/IHJlbW90ZVJldmlzaW9uLnVybChsaW5lRGF0YS5oYXNoKSA6ICcjJztcblxuICAgICAgICAgIC8vIGNvbnN0cnVjdCBwcm9wcyBmb3IgQmxhbWVMaW5lIGNvbXBvbmVudFxuICAgICAgICAgIGNvbnN0IGxpbmVQcm9wcyA9IHtcbiAgICAgICAgICAgIC4uLmxpbmVEYXRhLFxuICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgdmlld0NvbW1pdFVybCxcbiAgICAgICAgICAgIHNob3dPbmx5TGFzdE5hbWVzLFxuICAgICAgICAgICAgc2hvd0hhc2gsXG4gICAgICAgICAgICBjb2xvckNvbW1pdEF1dGhvcnMsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIGFkZGluZyBvbmUgbWFya2VyIHRvIHRoZSBmaXJzdCBsaW5lXG4gICAgICAgICAgY29uc3QgbGluZVJhbmdlID0gbmV3IFJhbmdlKFtsaW5lTnVtYmVyIC0gMSwgMF0sIFtsaW5lTnVtYmVyIC0gMSwgMF0pO1xuICAgICAgICAgIGNvbnN0IGxpbmVNYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobGluZVJhbmdlKTtcblxuICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdlbmVyYXRlTGluZUVsZW1lbnQobGluZVByb3BzKTtcbiAgICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gdGhpcy5ndXR0ZXIoKS5kZWNvcmF0ZU1hcmtlcihsaW5lTWFya2VyLCB7XG4gICAgICAgICAgICBjbGFzczogJ2JsYW1lLWxpbmUtbWFya2VyJyxcbiAgICAgICAgICAgIGl0ZW06IG5vZGUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5wdXNoKGRlY29yYXRpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmVMaW5lTWFya2VycygpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5mb3JFYWNoKChkZWNvcmF0aW9uKSA9PiB7XG4gICAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdlbmVyYXRlTGluZUVsZW1lbnQobGluZVByb3BzKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvLyBVc2UgUmVhY3QgdG8gcmVuZGVyIHRoZSBCbGFtZUxpbmUgY29tcG9uZW50XG4gICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgPEd1dHRlclJlc2l6ZSBvblJlc2l6ZVN0YXJ0PXt0aGlzLm9uUmVzaXplU3RhcnR9PlxuICAgICAgICA8QmxhbWVMaW5lIHsuLi5saW5lUHJvcHN9IC8+XG4gICAgICA8L0d1dHRlclJlc2l6ZT4sXG4gICAgICBkaXZcbiAgICApO1xuXG4gICAgY29uc3QgdGlwID0gYXRvbS50b29sdGlwcy5hZGQoZGl2LCB7XG4gICAgICB0aXRsZTogbGluZVByb3BzLnN1bW1hcnksXG4gICAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgfSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGlwKTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICBvblJlc2l6ZVN0YXJ0KGUpIHtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gZS5wYWdlWDtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSB0aGlzLndpZHRoO1xuICAgIHRoaXMuYmluZFJlc2l6ZUV2ZW50cygpO1xuICB9XG5cbiAgb25SZXNpemVFbmQoKSB7XG4gICAgdGhpcy51bmJpbmRSZXNpemVFdmVudHMoKTtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0WCA9IG51bGw7XG4gIH1cblxuICBvblJlc2l6ZU1vdmUoZSkge1xuICAgIGlmICghdGhpcy5yZXNpemVTdGFydFgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGVsdGEgPSBlLnBhZ2VYIC0gdGhpcy5yZXNpemVTdGFydFg7XG4gICAgdGhpcy51cGRhdGVHdXR0ZXJXaWR0aCh0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggKyBkZWx0YSk7XG4gIH1cblxuICBiaW5kUmVzaXplRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZXVwKSB7XG4gICAgICBjb25zdCBtb3VzZXVwSGFuZGxlciA9IHRoaXMub25SZXNpemVFbmQuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2V1cCA9IG1vdXNldXBIYW5kbGVyO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXBIYW5kbGVyKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZSkge1xuICAgICAgY29uc3QgbW91c2VNb3ZlSGFuZGxlciA9IGRlYm91bmNlKHRoaXMub25SZXNpemVNb3ZlLmJpbmQodGhpcyksIFJFU0laRV9ERUJPVU5DRV9NUyk7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZSA9IG1vdXNlTW92ZUhhbmRsZXI7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICB1bmJpbmRSZXNpemVFdmVudHMoKSB7XG4gICAgY29uc3QgeyBtb3VzZW1vdmUsIG1vdXNldXAgfSA9IHRoaXMuZXZlbnRMaXN0ZW5lcnM7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZW1vdmU7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXApO1xuICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNldXA7XG4gIH1cblxuICB1cGRhdGVHdXR0ZXJXaWR0aChuZXdXaWR0aCkge1xuICAgIHRoaXMud2lkdGggPSBuZXdXaWR0aDtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2dpdC1ibGFtZS5jb2x1bW5XaWR0aCcsIG5ld1dpZHRoKTtcblxuICAgIGxldCB0YWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChHVVRURVJfU1RZTEVfSUQpO1xuICAgIGlmICghdGFnKSB7XG4gICAgICB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgdGFnLmlkID0gR1VUVEVSX1NUWUxFX0lEO1xuICAgICAgdGFnLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh0YWcpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlcyA9IGBcbiAgICAgIGF0b20tdGV4dC1lZGl0b3IgLmd1dHRlcltndXR0ZXItbmFtZT1cIiR7R1VUVEVSX0lEfVwiXSB7XG4gICAgICAgIHdpZHRoOiAke25ld1dpZHRofXB4O1xuICAgICAgfVxuICAgIGA7XG4gICAgdGFnLnRleHRDb250ZW50ID0gc3R5bGVzO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmd1dHRlcigpLmRlc3Ryb3koKTtcbiAgfVxuXG59XG4iXX0=