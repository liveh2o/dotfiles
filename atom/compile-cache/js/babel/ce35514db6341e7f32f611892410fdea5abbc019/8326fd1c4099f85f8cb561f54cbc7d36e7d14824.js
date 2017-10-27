Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _softWrapStatusComponent = require('./soft-wrap-status-component');

var _softWrapStatusComponent2 = _interopRequireDefault(_softWrapStatusComponent);

/**
 * Displays the state of the active editor's soft wrap mode in the status bar.
 */
'use babel';

var SoftWrapStatus = (function () {
  /**
   * Public: Starts tracking the Atom environment and builds the status bar view.
   *
   * @param {AtomEnvironment} atomEnv Current Atom environment.
   * @param {TextEditor} editor Editor to display the status of.
   */

  function SoftWrapStatus() {
    var atomEnv = arguments.length <= 0 || arguments[0] === undefined ? global.atom : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? atomEnv.workspace.getActiveTextEditor() : arguments[1];
    return (function () {
      var _this = this;

      _classCallCheck(this, SoftWrapStatus);

      this.atomEnv = atomEnv;
      this.view = new _softWrapStatusComponent2['default'](this);

      this.workspaceSubscription = atomEnv.workspace.observeActiveTextEditor(function (editor) {
        _this.setActiveEditor(editor);
      });
    }).apply(this, arguments);
  }

  /**
   * Public: Cleans up the indicator.
   */

  _createClass(SoftWrapStatus, [{
    key: 'destroy',
    value: function destroy() {
      this.workspaceSubscription.dispose();
      this.unsubscribe();
      this.view.destroy();
    }

    /**
     * Public: Indicates whether to display the indicator.
     *
     * @return {Boolean} truthy if the soft wrap indicator should be displayed, falsy otherwise.
     */
  }, {
    key: 'shouldRenderIndicator',
    value: function shouldRenderIndicator() {
      return this.editor;
    }

    /**
     * Public: Indicates whether the indicator should be lit.
     *
     * When the indicator is lit, it signifies that the currently active text editor has soft wrap
     * enabled.
     *
     * @return {Boolean} truthy if the indicator should be lit, falsy otherwise.
     */
  }, {
    key: 'shouldBeLit',
    value: function shouldBeLit() {
      return this.editor && this.editor.isSoftWrapped();
    }

    /**
     * Public: Toggles the soft wrap state of the currently tracked editor.
     */
  }, {
    key: 'toggleSoftWrapped',
    value: function toggleSoftWrapped() {
      if (this.editor) {
        this.editor.toggleSoftWrapped();
      }
    }

    /**
     * Private: Sets the editor whose state the model is tracking.
     *
     * @param {TextEditor} editor Editor to display the soft wrap status for or `null` if the active
     *                            pane item is not an editor.
     */
  }, {
    key: 'setActiveEditor',
    value: function setActiveEditor(editor) {
      this.editor = editor;
      this.subscribe(this.editor);
      this.updateView();
    }

    /**
     * Private: Subscribes to the state of a new editor.
     *
     * @param  {TextEditor} editor Editor to whose events the model should subscribe, if any.
     */
  }, {
    key: 'subscribe',
    value: function subscribe(editor) {
      var _this2 = this;

      this.unsubscribe();

      if (editor) {
        this.editorSubscriptions = new _atom.CompositeDisposable();

        this.editorSubscriptions.add(editor.onDidChangeGrammar(function () {
          _this2.updateView();
        }));

        this.editorSubscriptions.add(editor.onDidChangeSoftWrapped(function () {
          _this2.updateView();
        }));
      }
    }

    /**
     * Private: Unsubscribes from the old editor's events.
     */
  }, {
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this.editorSubscriptions) {
        this.editorSubscriptions.dispose();
        this.editorSubscriptions = null;
      }
    }

    /**
     * Private: Updates the view and triggers the update of the tooltip.
     */
  }, {
    key: 'updateView',
    value: _asyncToGenerator(function* () {
      yield this.view.update();

      this.updateTooltip();
    })

    /**
     * Private: Updates the tooltip to reflect the current state.
     */
  }, {
    key: 'updateTooltip',
    value: function updateTooltip() {
      if (this.tooltipDisposable) {
        this.tooltipDisposable.dispose();
        this.tooltipDisposable = null;
      }

      if (this.shouldRenderIndicator()) {
        var tooltipText = 'Soft wrap is ' + (this.shouldBeLit() ? 'enabled' : 'disabled');

        this.tooltipDisposable = this.atomEnv.tooltips.add(this.view.element, { title: tooltipText, trigger: 'hover' });
      }
    }
  }]);

  return SoftWrapStatus;
})();

exports['default'] = SoftWrapStatus;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL2xpYi9zb2Z0LXdyYXAtc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7dUNBQ0osOEJBQThCOzs7Ozs7O0FBSGxFLFdBQVcsQ0FBQTs7SUFRVSxjQUFjOzs7Ozs7OztBQU9yQixXQVBPLGNBQWM7UUFPcEIsT0FBTyx5REFBRyxNQUFNLENBQUMsSUFBSTtRQUFFLE1BQU0seURBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRTt3QkFBRTs7OzRCQVBuRSxjQUFjOztBQVEvQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixVQUFJLENBQUMsSUFBSSxHQUFHLHlDQUE0QixJQUFJLENBQUMsQ0FBQTs7QUFFN0MsVUFBSSxDQUFDLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDakYsY0FBSyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDN0IsQ0FBQyxDQUFBO0tBQ0g7R0FBQTs7Ozs7O2VBZGtCLGNBQWM7O1dBbUJ6QixtQkFBRztBQUNULFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNwQyxVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNwQjs7Ozs7Ozs7O1dBT3FCLGlDQUFHO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7Ozs7Ozs7Ozs7O1dBVVcsdUJBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNsRDs7Ozs7OztXQUtpQiw2QkFBRztBQUNuQixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUE7T0FDaEM7S0FDRjs7Ozs7Ozs7OztXQVFlLHlCQUFDLE1BQU0sRUFBRTtBQUN2QixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMzQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDbEI7Ozs7Ozs7OztXQU9TLG1CQUFDLE1BQU0sRUFBRTs7O0FBQ2pCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTs7QUFFbEIsVUFBSSxNQUFNLEVBQUU7QUFDVixZQUFJLENBQUMsbUJBQW1CLEdBQUcsK0JBQXVCLENBQUE7O0FBRWxELFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQU07QUFDM0QsaUJBQUssVUFBVSxFQUFFLENBQUE7U0FDbEIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsWUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsWUFBTTtBQUMvRCxpQkFBSyxVQUFVLEVBQUUsQ0FBQTtTQUNsQixDQUFDLENBQUMsQ0FBQTtPQUNKO0tBQ0Y7Ozs7Ozs7V0FLVyx1QkFBRztBQUNiLFVBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQzVCLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQyxZQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFBO09BQ2hDO0tBQ0Y7Ozs7Ozs7NkJBS2dCLGFBQUc7QUFDbEIsWUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBOztBQUV4QixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7S0FDckI7Ozs7Ozs7V0FLYSx5QkFBRztBQUNmLFVBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO0FBQzFCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNoQyxZQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFBO09BQzlCOztBQUVELFVBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUU7QUFDaEMsWUFBTSxXQUFXLHNCQUFtQixJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQSxBQUFFLENBQUE7O0FBRWpGLFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ2pCLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtPQUMzRjtLQUNGOzs7U0ExSGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL2xpYi9zb2Z0LXdyYXAtc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFNvZnRXcmFwU3RhdHVzQ29tcG9uZW50IGZyb20gJy4vc29mdC13cmFwLXN0YXR1cy1jb21wb25lbnQnXG5cbi8qKlxuICogRGlzcGxheXMgdGhlIHN0YXRlIG9mIHRoZSBhY3RpdmUgZWRpdG9yJ3Mgc29mdCB3cmFwIG1vZGUgaW4gdGhlIHN0YXR1cyBiYXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvZnRXcmFwU3RhdHVzIHtcbiAgLyoqXG4gICAqIFB1YmxpYzogU3RhcnRzIHRyYWNraW5nIHRoZSBBdG9tIGVudmlyb25tZW50IGFuZCBidWlsZHMgdGhlIHN0YXR1cyBiYXIgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHtBdG9tRW52aXJvbm1lbnR9IGF0b21FbnYgQ3VycmVudCBBdG9tIGVudmlyb25tZW50LlxuICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvciBFZGl0b3IgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGF0b21FbnYgPSBnbG9iYWwuYXRvbSwgZWRpdG9yID0gYXRvbUVudi53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XG4gICAgdGhpcy5hdG9tRW52ID0gYXRvbUVudlxuICAgIHRoaXMudmlldyA9IG5ldyBTb2Z0V3JhcFN0YXR1c0NvbXBvbmVudCh0aGlzKVxuXG4gICAgdGhpcy53b3Jrc3BhY2VTdWJzY3JpcHRpb24gPSBhdG9tRW52LndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvcigoZWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLnNldEFjdGl2ZUVkaXRvcihlZGl0b3IpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWM6IENsZWFucyB1cCB0aGUgaW5kaWNhdG9yLlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy53b3Jrc3BhY2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgdGhpcy51bnN1YnNjcmliZSgpXG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYzogSW5kaWNhdGVzIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgaW5kaWNhdG9yLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnV0aHkgaWYgdGhlIHNvZnQgd3JhcCBpbmRpY2F0b3Igc2hvdWxkIGJlIGRpc3BsYXllZCwgZmFsc3kgb3RoZXJ3aXNlLlxuICAgKi9cbiAgc2hvdWxkUmVuZGVySW5kaWNhdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWM6IEluZGljYXRlcyB3aGV0aGVyIHRoZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGxpdC5cbiAgICpcbiAgICogV2hlbiB0aGUgaW5kaWNhdG9yIGlzIGxpdCwgaXQgc2lnbmlmaWVzIHRoYXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgdGV4dCBlZGl0b3IgaGFzIHNvZnQgd3JhcFxuICAgKiBlbmFibGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnV0aHkgaWYgdGhlIGluZGljYXRvciBzaG91bGQgYmUgbGl0LCBmYWxzeSBvdGhlcndpc2UuXG4gICAqL1xuICBzaG91bGRCZUxpdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yICYmIHRoaXMuZWRpdG9yLmlzU29mdFdyYXBwZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYzogVG9nZ2xlcyB0aGUgc29mdCB3cmFwIHN0YXRlIG9mIHRoZSBjdXJyZW50bHkgdHJhY2tlZCBlZGl0b3IuXG4gICAqL1xuICB0b2dnbGVTb2Z0V3JhcHBlZCAoKSB7XG4gICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICB0aGlzLmVkaXRvci50b2dnbGVTb2Z0V3JhcHBlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFNldHMgdGhlIGVkaXRvciB3aG9zZSBzdGF0ZSB0aGUgbW9kZWwgaXMgdHJhY2tpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yIEVkaXRvciB0byBkaXNwbGF5IHRoZSBzb2Z0IHdyYXAgc3RhdHVzIGZvciBvciBgbnVsbGAgaWYgdGhlIGFjdGl2ZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lIGl0ZW0gaXMgbm90IGFuIGVkaXRvci5cbiAgICovXG4gIHNldEFjdGl2ZUVkaXRvciAoZWRpdG9yKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLnN1YnNjcmliZSh0aGlzLmVkaXRvcilcbiAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFN1YnNjcmliZXMgdG8gdGhlIHN0YXRlIG9mIGEgbmV3IGVkaXRvci5cbiAgICpcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIEVkaXRvciB0byB3aG9zZSBldmVudHMgdGhlIG1vZGVsIHNob3VsZCBzdWJzY3JpYmUsIGlmIGFueS5cbiAgICovXG4gIHN1YnNjcmliZSAoZWRpdG9yKSB7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpXG5cbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICB0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICB0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlU29mdFdyYXBwZWQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgfSkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFVuc3Vic2NyaWJlcyBmcm9tIHRoZSBvbGQgZWRpdG9yJ3MgZXZlbnRzLlxuICAgKi9cbiAgdW5zdWJzY3JpYmUgKCkge1xuICAgIGlmICh0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZTogVXBkYXRlcyB0aGUgdmlldyBhbmQgdHJpZ2dlcnMgdGhlIHVwZGF0ZSBvZiB0aGUgdG9vbHRpcC5cbiAgICovXG4gIGFzeW5jIHVwZGF0ZVZpZXcgKCkge1xuICAgIGF3YWl0IHRoaXMudmlldy51cGRhdGUoKVxuXG4gICAgdGhpcy51cGRhdGVUb29sdGlwKClcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlOiBVcGRhdGVzIHRoZSB0b29sdGlwIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAqL1xuICB1cGRhdGVUb29sdGlwICgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwRGlzcG9zYWJsZSkge1xuICAgICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkUmVuZGVySW5kaWNhdG9yKCkpIHtcbiAgICAgIGNvbnN0IHRvb2x0aXBUZXh0ID0gYFNvZnQgd3JhcCBpcyAke3RoaXMuc2hvdWxkQmVMaXQoKSA/ICdlbmFibGVkJyA6ICdkaXNhYmxlZCd9YFxuXG4gICAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlID0gdGhpcy5hdG9tRW52LnRvb2x0aXBzLmFkZCh0aGlzLnZpZXcuZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogdG9vbHRpcFRleHQsIHRyaWdnZXI6ICdob3Zlcid9KVxuICAgIH1cbiAgfVxufVxuIl19