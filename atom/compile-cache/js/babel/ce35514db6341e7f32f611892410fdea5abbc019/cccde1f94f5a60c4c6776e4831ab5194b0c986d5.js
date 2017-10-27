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
   * @param  {AtomEnvironment} atomEnv Current Atom environment.
   * @param  {TextEditor} editor Editor to display the status of.
   */

  function SoftWrapStatus() {
    var atomEnv = arguments.length <= 0 || arguments[0] === undefined ? global.atom : arguments[0];
    var editor = arguments.length <= 1 || arguments[1] === undefined ? atomEnv.workspace.getActiveTextEditor() : arguments[1];
    return (function () {
      var _this = this;

      _classCallCheck(this, SoftWrapStatus);

      this.atomEnv = atomEnv;
      this.view = new _softWrapStatusComponent2['default'](this);
      this.setActiveEditor(editor);

      this.workspaceSubscription = atomEnv.workspace.onDidChangeActivePaneItem(function () {
        _this.setActiveEditor(atomEnv.workspace.getActiveTextEditor());
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

        this.editorSubscriptions.add(editor.onDidDestroy(function () {
          _this2.unsubscribe();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL2xpYi9zb2Z0LXdyYXAtc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7dUNBQ0osOEJBQThCOzs7Ozs7O0FBSGxFLFdBQVcsQ0FBQTs7SUFRVSxjQUFjOzs7Ozs7OztBQU9yQixXQVBPLGNBQWM7UUFPcEIsT0FBTyx5REFBRyxNQUFNLENBQUMsSUFBSTtRQUFFLE1BQU0seURBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRTt3QkFBRTs7OzRCQVBuRSxjQUFjOztBQVEvQixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixVQUFJLENBQUMsSUFBSSxHQUFHLHlDQUE0QixJQUFJLENBQUMsQ0FBQTtBQUM3QyxVQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUU1QixVQUFJLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxZQUFNO0FBQzdFLGNBQUssZUFBZSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO09BQzlELENBQUMsQ0FBQTtLQUNIO0dBQUE7Ozs7OztlQWZrQixjQUFjOztXQW9CekIsbUJBQUc7QUFDVCxVQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDcEMsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDcEI7Ozs7Ozs7OztXQU9xQixpQ0FBRztBQUN2QixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FDbkI7Ozs7Ozs7Ozs7OztXQVVXLHVCQUFHO0FBQ2IsYUFBTyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7S0FDbEQ7Ozs7Ozs7V0FLaUIsNkJBQUc7QUFDbkIsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO09BQ2hDO0tBQ0Y7Ozs7Ozs7Ozs7V0FRZSx5QkFBQyxNQUFNLEVBQUU7QUFDdkIsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDM0IsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ2xCOzs7Ozs7Ozs7V0FPUyxtQkFBQyxNQUFNLEVBQUU7OztBQUNqQixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7O0FBRWxCLFVBQUksTUFBTSxFQUFFO0FBQ1YsWUFBSSxDQUFDLG1CQUFtQixHQUFHLCtCQUF1QixDQUFBOztBQUVsRCxZQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFNO0FBQzNELGlCQUFLLFVBQVUsRUFBRSxDQUFBO1NBQ2xCLENBQUMsQ0FBQyxDQUFBOztBQUVILFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFlBQU07QUFDL0QsaUJBQUssVUFBVSxFQUFFLENBQUE7U0FDbEIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsWUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDckQsaUJBQUssV0FBVyxFQUFFLENBQUE7U0FDbkIsQ0FBQyxDQUFDLENBQUE7T0FDSjtLQUNGOzs7Ozs7O1dBS1csdUJBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUM1QixZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbEMsWUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQTtPQUNoQztLQUNGOzs7Ozs7OzZCQUtnQixhQUFHO0FBQ2xCLFlBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTs7QUFFeEIsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQ3JCOzs7Ozs7O1dBS2EseUJBQUc7QUFDZixVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDaEMsWUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQTtPQUM5Qjs7QUFFRCxVQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO0FBQ2hDLFlBQU0sV0FBVyxzQkFBbUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUEsQUFBRSxDQUFBOztBQUVqRixZQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUNqQixFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUE7T0FDM0Y7S0FDRjs7O1NBL0hrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvc29mdC13cmFwLWluZGljYXRvci9saWIvc29mdC13cmFwLXN0YXR1cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBTb2Z0V3JhcFN0YXR1c0NvbXBvbmVudCBmcm9tICcuL3NvZnQtd3JhcC1zdGF0dXMtY29tcG9uZW50J1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBzdGF0ZSBvZiB0aGUgYWN0aXZlIGVkaXRvcidzIHNvZnQgd3JhcCBtb2RlIGluIHRoZSBzdGF0dXMgYmFyLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2Z0V3JhcFN0YXR1cyB7XG4gIC8qKlxuICAgKiBQdWJsaWM6IFN0YXJ0cyB0cmFja2luZyB0aGUgQXRvbSBlbnZpcm9ubWVudCBhbmQgYnVpbGRzIHRoZSBzdGF0dXMgYmFyIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSAge0F0b21FbnZpcm9ubWVudH0gYXRvbUVudiBDdXJyZW50IEF0b20gZW52aXJvbm1lbnQuXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IGVkaXRvciBFZGl0b3IgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGF0b21FbnYgPSBnbG9iYWwuYXRvbSwgZWRpdG9yID0gYXRvbUVudi53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XG4gICAgdGhpcy5hdG9tRW52ID0gYXRvbUVudlxuICAgIHRoaXMudmlldyA9IG5ldyBTb2Z0V3JhcFN0YXR1c0NvbXBvbmVudCh0aGlzKVxuICAgIHRoaXMuc2V0QWN0aXZlRWRpdG9yKGVkaXRvcilcblxuICAgIHRoaXMud29ya3NwYWNlU3Vic2NyaXB0aW9uID0gYXRvbUVudi53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICB0aGlzLnNldEFjdGl2ZUVkaXRvcihhdG9tRW52LndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWM6IENsZWFucyB1cCB0aGUgaW5kaWNhdG9yLlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgdGhpcy53b3Jrc3BhY2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgdGhpcy51bnN1YnNjcmliZSgpXG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYzogSW5kaWNhdGVzIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgaW5kaWNhdG9yLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnV0aHkgaWYgdGhlIHNvZnQgd3JhcCBpbmRpY2F0b3Igc2hvdWxkIGJlIGRpc3BsYXllZCwgZmFsc3kgb3RoZXJ3aXNlLlxuICAgKi9cbiAgc2hvdWxkUmVuZGVySW5kaWNhdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWM6IEluZGljYXRlcyB3aGV0aGVyIHRoZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGxpdC5cbiAgICpcbiAgICogV2hlbiB0aGUgaW5kaWNhdG9yIGlzIGxpdCwgaXQgc2lnbmlmaWVzIHRoYXQgdGhlIGN1cnJlbnRseSBhY3RpdmUgdGV4dCBlZGl0b3IgaGFzIHNvZnQgd3JhcFxuICAgKiBlbmFibGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnV0aHkgaWYgdGhlIGluZGljYXRvciBzaG91bGQgYmUgbGl0LCBmYWxzeSBvdGhlcndpc2UuXG4gICAqL1xuICBzaG91bGRCZUxpdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yICYmIHRoaXMuZWRpdG9yLmlzU29mdFdyYXBwZWQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYzogVG9nZ2xlcyB0aGUgc29mdCB3cmFwIHN0YXRlIG9mIHRoZSBjdXJyZW50bHkgdHJhY2tlZCBlZGl0b3IuXG4gICAqL1xuICB0b2dnbGVTb2Z0V3JhcHBlZCAoKSB7XG4gICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICB0aGlzLmVkaXRvci50b2dnbGVTb2Z0V3JhcHBlZCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFNldHMgdGhlIGVkaXRvciB3aG9zZSBzdGF0ZSB0aGUgbW9kZWwgaXMgdHJhY2tpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yIEVkaXRvciB0byBkaXNwbGF5IHRoZSBzb2Z0IHdyYXAgc3RhdHVzIGZvciBvciBgbnVsbGAgaWYgdGhlIGFjdGl2ZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lIGl0ZW0gaXMgbm90IGFuIGVkaXRvci5cbiAgICovXG4gIHNldEFjdGl2ZUVkaXRvciAoZWRpdG9yKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLnN1YnNjcmliZSh0aGlzLmVkaXRvcilcbiAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFN1YnNjcmliZXMgdG8gdGhlIHN0YXRlIG9mIGEgbmV3IGVkaXRvci5cbiAgICpcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gZWRpdG9yIEVkaXRvciB0byB3aG9zZSBldmVudHMgdGhlIG1vZGVsIHNob3VsZCBzdWJzY3JpYmUsIGlmIGFueS5cbiAgICovXG4gIHN1YnNjcmliZSAoZWRpdG9yKSB7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpXG5cbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICB0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgICB0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkQ2hhbmdlU29mdFdyYXBwZWQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKVxuICAgICAgfSkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGU6IFVuc3Vic2NyaWJlcyBmcm9tIHRoZSBvbGQgZWRpdG9yJ3MgZXZlbnRzLlxuICAgKi9cbiAgdW5zdWJzY3JpYmUgKCkge1xuICAgIGlmICh0aGlzLmVkaXRvclN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIHRoaXMuZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZTogVXBkYXRlcyB0aGUgdmlldyBhbmQgdHJpZ2dlcnMgdGhlIHVwZGF0ZSBvZiB0aGUgdG9vbHRpcC5cbiAgICovXG4gIGFzeW5jIHVwZGF0ZVZpZXcgKCkge1xuICAgIGF3YWl0IHRoaXMudmlldy51cGRhdGUoKVxuXG4gICAgdGhpcy51cGRhdGVUb29sdGlwKClcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlOiBVcGRhdGVzIHRoZSB0b29sdGlwIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICAqL1xuICB1cGRhdGVUb29sdGlwICgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwRGlzcG9zYWJsZSkge1xuICAgICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBudWxsXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkUmVuZGVySW5kaWNhdG9yKCkpIHtcbiAgICAgIGNvbnN0IHRvb2x0aXBUZXh0ID0gYFNvZnQgd3JhcCBpcyAke3RoaXMuc2hvdWxkQmVMaXQoKSA/ICdlbmFibGVkJyA6ICdkaXNhYmxlZCd9YFxuXG4gICAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlID0gdGhpcy5hdG9tRW52LnRvb2x0aXBzLmFkZCh0aGlzLnZpZXcuZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aXRsZTogdG9vbHRpcFRleHQsIHRyaWdnZXI6ICdob3Zlcid9KVxuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-status.js
