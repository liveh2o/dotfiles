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

      var showOnlyLastNames = atom.config.get('git-blame.showOnlyLastNames');
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
          if (lineData.hash !== lastHash) {
            className = className === 'lighter' ? 'darker' : 'lighter';
          }
          lastHash = lineData.hash;

          // generate a link to the commit
          var viewCommitUrl = hasUrlTemplate ? remoteRevision.url(lineData.hash) : '#';

          // construct props for BlameLine component
          var lineProps = _extends({}, lineData, {
            className: className,
            viewCommitUrl: viewCommitUrl,
            showOnlyLastNames: showOnlyLastNames
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVHdXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7MEJBRW9DLFlBQVk7O29CQUNMLE1BQU07OzRCQUNqQixnQkFBZ0I7O3NCQUU3QixVQUFVOzs7OzhCQUNGLGtCQUFrQjs7Ozt1Q0FDVCwyQkFBMkI7Ozs7bUNBQ3pDLHlCQUF5Qjs7OztzQ0FDdEIsNEJBQTRCOzs7O0FBVnJELFdBQVcsQ0FBQzs7QUFZWixJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLGVBQWUsR0FBRywrQkFBK0IsQ0FBQztBQUN4RCxJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7SUFFUixXQUFXO0FBRW5CLFdBRlEsV0FBVyxDQUVsQixNQUFNLEVBQUU7MEJBRkQsV0FBVzs7QUFHNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRzdDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0dBQzFCOzs7Ozs7O2VBaEJrQixXQUFXOztXQXNCZCw0QkFBRztBQUNqQixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUM7Ozs7Ozs7OztXQU9ZLHVCQUFDLE9BQU8sRUFBRTs7O0FBR3JCLFVBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7QUFDNUIsZUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2pDOzs7VUFHTyxNQUFNLEdBQUssSUFBSSxDQUFmLE1BQU07O0FBQ2QsVUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUQsVUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLENBQUM7T0FDakY7O0FBRUQsVUFBSSxPQUFPLEVBQUU7O0FBRVgsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNsQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDekIsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3RDOzs7Ozs7Ozs7V0FPSyxrQkFBRztVQUNDLE1BQU0sR0FBSyxJQUFJLENBQWYsTUFBTTs7QUFDZCxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELGFBQU8sTUFBTSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3hDLFlBQUksRUFBRSxTQUFTO0FBQ2YsZUFBTyxFQUFFLEtBQUs7QUFDZCxnQkFBUSxFQUFFLEdBQUc7T0FDZCxDQUFDLENBQUM7S0FDSjs7O1dBRWdCLDJCQUFDLFFBQVEsRUFBRTs7O0FBQzFCLFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN6RSxhQUFPLDBDQUF3QixRQUFRLENBQUMsQ0FDckMsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ1osWUFBTSxNQUFNLEdBQUcsd0JBQVcsSUFBSSxDQUFDLENBQUM7QUFDaEMsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUMxQyxtQkFBTyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1dBQ2xELENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBQyxJQUFpQixFQUFLO21DQUF0QixJQUFpQjs7WUFBaEIsSUFBSTtZQUFFLFNBQVM7O0FBQ3JCLFlBQU0sY0FBYyxHQUFHLGdDQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDdkUsWUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN0RCxZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUVyQixpQkFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVEsRUFBSTtjQUNwQixVQUFVLEdBQXFCLFFBQVEsQ0FBdkMsVUFBVTtjQUFFLElBQUksR0FBZSxRQUFRLENBQTNCLElBQUk7Y0FBRSxRQUFRLEdBQUssUUFBUSxDQUFyQixRQUFROztBQUNsQyxjQUFJLFFBQVEsRUFBRTtBQUNaLG1CQUFPO1dBQ1I7OztBQUdELGNBQUksUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDOUIscUJBQVMsR0FBRyxBQUFDLFNBQVMsS0FBSyxTQUFTLEdBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQztXQUM5RDtBQUNELGtCQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzs7O0FBR3pCLGNBQU0sYUFBYSxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7OztBQUcvRSxjQUFNLFNBQVMsZ0JBQ1YsUUFBUTtBQUNYLHFCQUFTLEVBQVQsU0FBUztBQUNULHlCQUFhLEVBQWIsYUFBYTtBQUNiLDZCQUFpQixFQUFqQixpQkFBaUI7WUFDbEIsQ0FBQzs7O0FBR0YsY0FBTSxTQUFTLEdBQUcsZ0JBQVUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLGNBQU0sVUFBVSxHQUFHLE1BQUssTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFMUQsY0FBTSxJQUFJLEdBQUcsTUFBSyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxjQUFNLFVBQVUsR0FBRyxNQUFLLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUU7QUFDMUQscUJBQU8sbUJBQW1CO0FBQzFCLGdCQUFJLEVBQUUsSUFBSTtXQUNYLENBQUMsQ0FBQzs7QUFFSCxnQkFBSyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUVOOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN6QyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3RCLENBQUMsQ0FBQztLQUNKOzs7V0FFa0IsNkJBQUMsU0FBUyxFQUFFO0FBQzdCLFVBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUcxQyw2QkFBUyxNQUFNLENBQ2I7O1VBQWMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDO1FBQ3pELG9FQUFlLFNBQVMsQ0FBSTtPQUNmLEVBQ2YsR0FBRyxDQUNKLENBQUM7O0FBRUYsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ2pDLGFBQUssRUFBRSxTQUFTLENBQUMsT0FBTztBQUN4QixpQkFBUyxFQUFFLE9BQU87T0FDbkIsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFCLGFBQU8sR0FBRyxDQUFDO0tBQ1o7OztXQUVZLHVCQUFDLENBQUMsRUFBRTtBQUNmLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM1QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQyxVQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFO0FBQ2IsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDMUIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7S0FDMUI7OztXQUVXLHNCQUFDLENBQUMsRUFBRTtBQUNkLFVBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUMxQyxVQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEOzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNuQyxZQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRCxZQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLGNBQWMsQ0FBQztBQUNoRCxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztPQUN0RDtBQUNELFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ3JDLFlBQU0sZ0JBQWdCLEdBQUcsMEJBQVMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNwRixZQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQ3BELGdCQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7T0FDMUQ7S0FDRjs7O1dBRWlCLDhCQUFHOzRCQUNZLElBQUksQ0FBQyxjQUFjO1VBQTFDLFNBQVMsbUJBQVQsU0FBUztVQUFFLE9BQU8sbUJBQVAsT0FBTzs7QUFDMUIsY0FBUSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ3JDLGNBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakQsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztLQUNwQzs7O1dBRWdCLDJCQUFDLFFBQVEsRUFBRTtBQUMxQixVQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztBQUN0QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNuRCxVQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsV0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEMsV0FBRyxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDekIsV0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDdEIsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2hDOztBQUVELFVBQU0sTUFBTSxzREFDOEIsU0FBUyw2QkFDdEMsUUFBUSx1QkFFcEIsQ0FBQztBQUNGLFNBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0tBQzFCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6Qjs7O1NBMU5rQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL0JsYW1lR3V0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IG1hcCwgZmluZCwgZGVib3VuY2UgfSBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCB7IFJhbmdlLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyBSZWFjdCwgUmVhY3RET00gfSBmcm9tICdyZWFjdC1mb3ItYXRvbSc7XG5cbmltcG9ydCBCbGFtZXIgZnJvbSAnLi9CbGFtZXInO1xuaW1wb3J0IFJlbW90ZVJldmlzaW9uIGZyb20gJy4vUmVtb3RlUmV2aXNpb24nO1xuaW1wb3J0IHJlcG9zaXRvcnlGb3JFZGl0b3JQYXRoIGZyb20gJy4vcmVwb3NpdG9yeUZvckVkaXRvclBhdGgnO1xuaW1wb3J0IEJsYW1lTGluZSBmcm9tICcuLi9jb21wb25lbnRzL0JsYW1lTGluZSc7XG5pbXBvcnQgR3V0dGVyUmVzaXplIGZyb20gJy4uL2NvbXBvbmVudHMvR3V0dGVyUmVzaXplJztcblxuY29uc3QgR1VUVEVSX0lEID0gJ2NvbS5hbGV4Y29ycmUuZ2l0LWJsYW1lJztcbmNvbnN0IEdVVFRFUl9TVFlMRV9JRCA9ICdjb20uYWxleGNvcnJlLmdpdC1ibGFtZS5zdHlsZSc7XG5jb25zdCBSRVNJWkVfREVCT1VOQ0VfTVMgPSA1O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbGFtZUd1dHRlciB7XG5cbiAgY29uc3RydWN0b3IoZWRpdG9yKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XG4gICAgdGhpcy5saW5lRGVjb3JhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIHJlc2l6ZVxuICAgIGNvbnN0IHdpZHRoID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuY29sdW1uV2lkdGgnKTtcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcldpZHRoKHdpZHRoKTtcblxuICAgIHRoaXMucmVzaXplU3RhcnRXaWR0aCA9IG51bGw7XG4gICAgdGhpcy5yZXNpemVTdGFydFggPSBudWxsO1xuICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb3AgbGV2ZWwgQVBJIGZvciB0b2dnbGluZyBndXR0ZXIgdmlzaWJsaXR5ICsgYmxhbWluZyB0aGUgY3VycmVudGx5XG4gICAqIG9wZW4gZmlsZSwgaWYgYW55LlxuICAgKi9cbiAgdG9nZ2xlVmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRWaXNpYmlsaXR5KCF0aGlzLmlzU2hvd24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZ3V0dGVyLiBCb290c3RyYXBzIGEgbmV3IGd1dHRlciBpZiBuZWVkIGJlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cbiAgICovXG4gIHNldFZpc2liaWxpdHkodmlzaWJsZSkge1xuICAgIC8vIGlmIHdlJ3JlIHRyeWluZyB0byBzZXQgdGhlIHZpc2libGl0eSB0byB0aGUgdmFsdWUgaXQgYWxyZWFkeSBoYXNcbiAgICAvLyBqdXN0IHJlc29sdmUgYW5kIGRvIG5vdGhpbmcuXG4gICAgaWYgKHRoaXMuaXNTaG93biA9PT0gdmlzaWJsZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2aXNpYmxlKTtcbiAgICB9XG5cbiAgICAvLyBncmFiIGZpbGVQYXRoIGZyb20gZWRpdG9yXG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuaXNFbXB0eSgpID8gbnVsbCA6IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTm8gZmlsZVBhdGggY291bGQgYmUgZGV0ZXJtaW5lZCBmb3IgZWRpdG9yLicpKTtcbiAgICB9XG5cbiAgICBpZiAodmlzaWJsZSkge1xuICAgICAgLy8gd2UgYXJlIHNob3dpbmcgdGhlIGd1dHRlclxuICAgICAgdGhpcy5ndXR0ZXIoKS5zaG93KCk7XG4gICAgICB0aGlzLnVwZGF0ZUxpbmVNYXJrZXJzKGZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVMaW5lTWFya2VycygpO1xuICAgICAgdGhpcy5ndXR0ZXIoKS5oaWRlKCk7XG4gICAgICB0aGlzLmd1dHRlcigpLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzU2hvd24gPSB2aXNpYmxlO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5pc1Nob3duKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMYXppbHkgZ2VuZXJhdGUgYSBHdXR0ZXIgaW5zdGFuY2UgZm9yIHRoZSBjdXJyZW50IGVkaXRvciwgdGhlIGZpcnN0IHRpbWVcbiAgICogd2UgbmVlZCBpdC4gQW55IG90aGVyIGFjY2Vzc2VzIHdpbGwgZ3JhYiB0aGUgc2FtZSBndXR0ZXIgcmVmZXJlbmNlIHVudGlsXG4gICAqIHRoZSBHdXR0ZXIgaXMgZXhwbGljaXRseSBkaXNwb3NlZC5cbiAgICovXG4gIGd1dHRlcigpIHtcbiAgICBjb25zdCB7IGVkaXRvciB9ID0gdGhpcztcbiAgICBjb25zdCBndXR0ZXIgPSBlZGl0b3IuZ3V0dGVyV2l0aE5hbWUoR1VUVEVSX0lEKTtcbiAgICByZXR1cm4gZ3V0dGVyID8gZ3V0dGVyIDogZWRpdG9yLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiBHVVRURVJfSUQsXG4gICAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICAgIHByaW9yaXR5OiAxMDAsXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVMaW5lTWFya2VycyhmaWxlUGF0aCkge1xuICAgIGNvbnN0IHNob3dPbmx5TGFzdE5hbWVzID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuc2hvd09ubHlMYXN0TmFtZXMnKTtcbiAgICByZXR1cm4gcmVwb3NpdG9yeUZvckVkaXRvclBhdGgoZmlsZVBhdGgpXG4gICAgICAudGhlbihyZXBvID0+IHtcbiAgICAgICAgY29uc3QgYmxhbWVyID0gbmV3IEJsYW1lcihyZXBvKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBibGFtZXIuYmxhbWUoZmlsZVBhdGgsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoW3JlcG8sIGRhdGFdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKFtyZXBvLCBibGFtZURhdGFdKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW90ZVJldmlzaW9uID0gbmV3IFJlbW90ZVJldmlzaW9uKHJlcG8uZ2V0T3JpZ2luVVJMKGZpbGVQYXRoKSk7XG4gICAgICAgIGNvbnN0IGhhc1VybFRlbXBsYXRlID0gISFyZW1vdGVSZXZpc2lvbi5nZXRUZW1wbGF0ZSgpO1xuICAgICAgICBsZXQgbGFzdEhhc2ggPSBudWxsO1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gbnVsbDtcblxuICAgICAgICBibGFtZURhdGEuZm9yRWFjaChsaW5lRGF0YSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBsaW5lTnVtYmVyLCBoYXNoLCBub0NvbW1pdCB9ID0gbGluZURhdGE7XG4gICAgICAgICAgaWYgKG5vQ29tbWl0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2V0IGFsdGVybmF0aW5nIGJhY2tncm91bmQgY2xhc3NOYW1lXG4gICAgICAgICAgaWYgKGxpbmVEYXRhLmhhc2ggIT09IGxhc3RIYXNoKSB7XG4gICAgICAgICAgICBjbGFzc05hbWUgPSAoY2xhc3NOYW1lID09PSAnbGlnaHRlcicpID8gJ2RhcmtlcicgOiAnbGlnaHRlcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxhc3RIYXNoID0gbGluZURhdGEuaGFzaDtcblxuICAgICAgICAgIC8vIGdlbmVyYXRlIGEgbGluayB0byB0aGUgY29tbWl0XG4gICAgICAgICAgY29uc3Qgdmlld0NvbW1pdFVybCA9IGhhc1VybFRlbXBsYXRlID8gcmVtb3RlUmV2aXNpb24udXJsKGxpbmVEYXRhLmhhc2gpIDogJyMnO1xuXG4gICAgICAgICAgLy8gY29uc3RydWN0IHByb3BzIGZvciBCbGFtZUxpbmUgY29tcG9uZW50XG4gICAgICAgICAgY29uc3QgbGluZVByb3BzID0ge1xuICAgICAgICAgICAgLi4ubGluZURhdGEsXG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICB2aWV3Q29tbWl0VXJsLFxuICAgICAgICAgICAgc2hvd09ubHlMYXN0TmFtZXMsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIGFkZGluZyBvbmUgbWFya2VyIHRvIHRoZSBmaXJzdCBsaW5lXG4gICAgICAgICAgY29uc3QgbGluZVJhbmdlID0gbmV3IFJhbmdlKFtsaW5lTnVtYmVyIC0gMSwgMF0sIFtsaW5lTnVtYmVyIC0gMSwgMF0pO1xuICAgICAgICAgIGNvbnN0IGxpbmVNYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobGluZVJhbmdlKTtcblxuICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdlbmVyYXRlTGluZUVsZW1lbnQobGluZVByb3BzKTtcbiAgICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gdGhpcy5ndXR0ZXIoKS5kZWNvcmF0ZU1hcmtlcihsaW5lTWFya2VyLCB7XG4gICAgICAgICAgICBjbGFzczogJ2JsYW1lLWxpbmUtbWFya2VyJyxcbiAgICAgICAgICAgIGl0ZW06IG5vZGUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5wdXNoKGRlY29yYXRpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gIH1cblxuICByZW1vdmVMaW5lTWFya2VycygpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmxpbmVEZWNvcmF0aW9ucy5mb3JFYWNoKGRlY29yYXRpb24gPT4ge1xuICAgICAgZGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfSk7XG4gIH1cblxuICBnZW5lcmF0ZUxpbmVFbGVtZW50KGxpbmVQcm9wcykge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLy8gVXNlIFJlYWN0IHRvIHJlbmRlciB0aGUgQmxhbWVMaW5lIGNvbXBvbmVudFxuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgIDxHdXR0ZXJSZXNpemUgb25SZXNpemVTdGFydD17dGhpcy5vblJlc2l6ZVN0YXJ0LmJpbmQodGhpcyl9PlxuICAgICAgICA8QmxhbWVMaW5lIHsuLi5saW5lUHJvcHN9IC8+XG4gICAgICA8L0d1dHRlclJlc2l6ZT4sXG4gICAgICBkaXZcbiAgICApO1xuXG4gICAgY29uc3QgdGlwID0gYXRvbS50b29sdGlwcy5hZGQoZGl2LCB7XG4gICAgICB0aXRsZTogbGluZVByb3BzLnN1bW1hcnksXG4gICAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgfSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGlwKTtcblxuICAgIHJldHVybiBkaXY7XG4gIH1cblxuICBvblJlc2l6ZVN0YXJ0KGUpIHtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gZS5wYWdlWDtcbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSB0aGlzLndpZHRoO1xuICAgIHRoaXMuYmluZFJlc2l6ZUV2ZW50cygpO1xuICB9XG5cbiAgb25SZXNpemVFbmQoZSkge1xuICAgIHRoaXMudW5iaW5kUmVzaXplRXZlbnRzKCk7XG4gICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZXNpemVTdGFydFggPSBudWxsO1xuICB9XG5cbiAgb25SZXNpemVNb3ZlKGUpIHtcbiAgICBjb25zdCBkZWx0YSA9IGUucGFnZVggLSB0aGlzLnJlc2l6ZVN0YXJ0WDtcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcldpZHRoKHRoaXMucmVzaXplU3RhcnRXaWR0aCArIGRlbHRhKTtcbiAgfVxuXG4gIGJpbmRSZXNpemVFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzWydtb3VzZXVwJ10pIHtcbiAgICAgIGNvbnN0IG1vdXNldXBIYW5kbGVyID0gdGhpcy5vblJlc2l6ZUVuZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVyc1snbW91c2V1cCddID0gbW91c2V1cEhhbmRsZXI7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnNbJ21vdXNlbW92ZSddKSB7XG4gICAgICBjb25zdCBtb3VzZU1vdmVIYW5kbGVyID0gZGVib3VuY2UodGhpcy5vblJlc2l6ZU1vdmUuYmluZCh0aGlzKSwgUkVTSVpFX0RFQk9VTkNFX01TKTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnNbJ21vdXNlbW92ZSddID0gbW91c2VNb3ZlSGFuZGxlcjtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHVuYmluZFJlc2l6ZUV2ZW50cygpIHtcbiAgICBjb25zdCB7IG1vdXNlbW92ZSwgbW91c2V1cCB9ID0gdGhpcy5ldmVudExpc3RlbmVycztcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2V1cDtcbiAgfVxuXG4gIHVwZGF0ZUd1dHRlcldpZHRoKG5ld1dpZHRoKSB7XG4gICAgdGhpcy53aWR0aCA9IG5ld1dpZHRoO1xuICAgIGF0b20uY29uZmlnLnNldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJywgbmV3V2lkdGgpO1xuXG4gICAgbGV0IHRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEdVVFRFUl9TVFlMRV9JRCk7XG4gICAgaWYgKCF0YWcpIHtcbiAgICAgIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICB0YWcuaWQgPSBHVVRURVJfU1RZTEVfSUQ7XG4gICAgICB0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRhZyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGVzID0gYFxuICAgICAgYXRvbS10ZXh0LWVkaXRvciAuZ3V0dGVyW2d1dHRlci1uYW1lPVwiJHtHVVRURVJfSUR9XCJdIHtcbiAgICAgICAgd2lkdGg6ICR7bmV3V2lkdGh9cHg7XG4gICAgICB9XG4gICAgYDtcbiAgICB0YWcudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZ3V0dGVyKCkuZGVzdHJveSgpO1xuICB9XG5cbn1cbiJdfQ==