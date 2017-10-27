(function() {
  var $, BlameLineComponent, BlameListLinesComponent, BlameListView, RP, React, Reactionary, div, renderLoading, _, _ref;

  $ = require('atom-space-pen-views').$;

  React = require('react-atom-fork');

  Reactionary = require('reactionary-atom-fork');

  div = Reactionary.div;

  RP = React.PropTypes;

  _ = require('underscore');

  _ref = require('./blame-line-view'), BlameLineComponent = _ref.BlameLineComponent, renderLoading = _ref.renderLoading;

  BlameListLinesComponent = React.createClass({
    propTypes: {
      annotations: RP.arrayOf(RP.object),
      loading: RP.bool.isRequired,
      dirty: RP.bool.isRequired,
      initialLineCount: RP.number.isRequired,
      remoteRevision: RP.object.isRequired,
      showOnlyLastNames: RP.bool.isRequired
    },
    renderLoading: function() {
      var lines, _i, _ref1, _results;
      lines = (function() {
        _results = [];
        for (var _i = 0, _ref1 = this.props.initialLineCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(renderLoading);
      return div(null, lines);
    },
    _addAlternatingBackgroundColor: function(lines) {
      var bgClass, lastHash, line, _i, _len;
      bgClass = null;
      lastHash = null;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        bgClass = line.noCommit ? '' : line.hash === lastHash ? bgClass : bgClass === 'line-bg-lighter' ? 'line-bg-darker' : 'line-bg-lighter';
        line['backgroundClass'] = bgClass;
        lastHash = line.hash;
      }
      return lines;
    },
    renderLoaded: function() {
      var l, lines, _i, _len;
      lines = _.clone(this.props.annotations);
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        l.remoteRevision = this.props.remoteRevision;
        l.showOnlyLastNames = this.props.showOnlyLastNames;
      }
      this._addAlternatingBackgroundColor(lines);
      return div(null, lines.map(BlameLineComponent));
    },
    render: function() {
      if (this.props.loading) {
        return this.renderLoading();
      } else {
        return this.renderLoaded();
      }
    },
    shouldComponentUpdate: function(_arg) {
      var dirty, finishedEdit, finishedInitialLoad, loading, showOnlyLastNames, showOnlyLastNamesChanged;
      loading = _arg.loading, dirty = _arg.dirty, showOnlyLastNames = _arg.showOnlyLastNames;
      finishedInitialLoad = this.props.loading && !loading && !this.props.dirty;
      finishedEdit = this.props.dirty && !dirty;
      showOnlyLastNamesChanged = this.props.showOnlyLastNames !== showOnlyLastNames;
      return finishedInitialLoad || finishedEdit || showOnlyLastNamesChanged;
    }
  });

  BlameListView = React.createClass({
    propTypes: {
      projectBlamer: RP.object.isRequired,
      remoteRevision: RP.object.isRequired,
      editorView: RP.object.isRequired
    },
    getInitialState: function() {
      return {
        scrollTop: this.scrollbar().scrollTop(),
        width: atom.config.get('git-blame.columnWidth'),
        loading: true,
        visible: true,
        dirty: false,
        showOnlyLastNames: atom.config.get('git-blame.showOnlyLastNames')
      };
    },
    scrollbar: function() {
      var _ref1;
      return this._scrollbar != null ? this._scrollbar : this._scrollbar = $((_ref1 = this.props.editorView.rootElement) != null ? _ref1.querySelector('.vertical-scrollbar') : void 0);
    },
    editor: function() {
      return this._editor != null ? this._editor : this._editor = this.props.editorView.getModel();
    },
    render: function() {
      var body, display;
      display = this.state.visible ? 'inline-block' : 'none';
      body = this.state.error ? div("Sorry, an error occurred.") : div({
        className: 'git-blame-scroller'
      }, div({
        className: 'blame-lines',
        style: {
          WebkitTransform: this.getTransform()
        }
      }, BlameListLinesComponent({
        annotations: this.state.annotations,
        loading: this.state.loading,
        dirty: this.state.dirty,
        initialLineCount: this.editor().getLineCount(),
        remoteRevision: this.props.remoteRevision,
        showOnlyLastNames: this.state.showOnlyLastNames
      })));
      return div({
        className: 'git-blame',
        style: {
          width: this.state.width,
          display: display
        }
      }, div({
        className: 'git-blame-resize-handle',
        onMouseDown: this.resizeStarted
      }), body);
    },
    getTransform: function() {
      var scrollTop, useHardwareAcceleration;
      scrollTop = this.state.scrollTop;
      useHardwareAcceleration = false;
      if (useHardwareAcceleration) {
        return "translate3d(0px, " + (-scrollTop) + "px, 0px)";
      } else {
        return "translate(0px, " + (-scrollTop) + "px)";
      }
    },
    componentWillMount: function() {
      this.loadBlame();
      this.editor().onDidStopChanging(this.contentsModified);
      return this.editor().onDidSave(this.saved);
    },
    loadBlame: function() {
      this.setState({
        loading: true
      });
      return this.props.projectBlamer.blame(this.editor().getPath(), (function(_this) {
        return function(err, data) {
          if (err) {
            return _this.setState({
              loading: false,
              error: true,
              dirty: false
            });
          } else {
            return _this.setState({
              loading: false,
              error: false,
              dirty: false,
              annotations: data
            });
          }
        };
      })(this));
    },
    contentsModified: function() {
      if (!this.isMounted()) {
        return;
      }
      if (!this.state.dirty) {
        return this.setState({
          dirty: true
        });
      }
    },
    saved: function() {
      if (!this.isMounted()) {
        return;
      }
      if (this.state.visible && this.state.dirty) {
        return this.loadBlame();
      }
    },
    toggle: function() {
      if (this.state.visible) {
        return this.setState({
          visible: false
        });
      } else {
        if (this.state.dirty) {
          this.loadBlame();
        }
        return this.setState({
          visible: true
        });
      }
    },
    componentDidMount: function() {
      this.scrollbar().on('scroll', this.matchScrollPosition);
      return this.showOnlyLastNamesObserver = atom.config.observe('git-blame.showOnlyLastNames', (function(_this) {
        return function(value) {
          return _this.setState({
            showOnlyLastNames: value
          });
        };
      })(this));
    },
    componentWillUnmount: function() {
      this.scrollbar().off('scroll', this.matchScrollPosition);
      this.editor().off('contents-modified', this.contentsModified);
      this.editor().buffer.off('saved', this.saved);
      return this.showOnlyLastNamesObserver.dispose();
    },
    matchScrollPosition: function() {
      return this.setState({
        scrollTop: this.scrollbar().scrollTop()
      });
    },
    resizeStarted: function(_arg) {
      var pageX;
      pageX = _arg.pageX;
      this.setState({
        dragging: true,
        initialPageX: pageX,
        initialWidth: this.state.width
      });
      $(document).on('mousemove', this.onResizeMouseMove);
      return $(document).on('mouseup', this.resizeStopped);
    },
    resizeStopped: function(e) {
      $(document).off('mousemove', this.onResizeMouseMove);
      $(document).off('mouseup', this.resizeStopped);
      this.setState({
        dragging: false
      });
      e.stopPropagation();
      return e.preventDefault();
    },
    onResizeMouseMove: function(e) {
      if (!(this.state.dragging && e.which === 1)) {
        return this.resizeStopped();
      }
      this.setState({
        width: this.state.initialWidth + e.pageX - this.state.initialPageX
      });
      e.stopPropagation();
      return e.preventDefault();
    }
  });

  module.exports = BlameListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdmlld3MvYmxhbWUtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUixDQURSLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdDLE1BQU8sWUFBUCxHQUhELENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssS0FBSyxDQUFDLFNBSlgsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxPQUFzQyxPQUFBLENBQVEsbUJBQVIsQ0FBdEMsRUFBQywwQkFBQSxrQkFBRCxFQUFxQixxQkFBQSxhQU5yQixDQUFBOztBQUFBLEVBU0EsdUJBQUEsR0FBMEIsS0FBSyxDQUFDLFdBQU4sQ0FDeEI7QUFBQSxJQUFBLFNBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLEVBQUUsQ0FBQyxPQUFILENBQVcsRUFBRSxDQUFDLE1BQWQsQ0FBYjtBQUFBLE1BQ0EsT0FBQSxFQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFEakI7QUFBQSxNQUVBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBRmY7QUFBQSxNQUdBLGdCQUFBLEVBQWtCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFINUI7QUFBQSxNQUlBLGNBQUEsRUFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUoxQjtBQUFBLE1BS0EsaUJBQUEsRUFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUwzQjtLQURGO0FB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

//# sourceURL=/Users/ah/.atom/packages/git-blame/lib/views/blame-list-view.coffee
