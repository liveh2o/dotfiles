'use babel'

import {CompositeDisposable} from 'atom'
import SoftWrapStatusComponent from './soft-wrap-status-component'

/**
 * Displays the state of the active editor's soft wrap mode in the status bar.
 */
export default class SoftWrapStatus {
  /**
   * Public: Starts tracking the Atom environment and builds the status bar view.
   *
   * @param {AtomEnvironment} atomEnv Current Atom environment.
   * @param {TextEditor} editor Editor to display the status of.
   */
  constructor (atomEnv = global.atom, editor = atomEnv.workspace.getActiveTextEditor()) {
    this.atomEnv = atomEnv
    this.view = new SoftWrapStatusComponent(this)

    this.workspaceSubscription = atomEnv.workspace.observeActiveTextEditor((editor) => {
      this.setActiveEditor(editor)
    })
  }

  /**
   * Public: Cleans up the indicator.
   */
  destroy () {
    this.workspaceSubscription.dispose()
    this.unsubscribe()
    this.view.destroy()
  }

  /**
   * Public: Indicates whether to display the indicator.
   *
   * @return {Boolean} truthy if the soft wrap indicator should be displayed, falsy otherwise.
   */
  shouldRenderIndicator () {
    return this.editor
  }

  /**
   * Public: Indicates whether the indicator should be lit.
   *
   * When the indicator is lit, it signifies that the currently active text editor has soft wrap
   * enabled.
   *
   * @return {Boolean} truthy if the indicator should be lit, falsy otherwise.
   */
  shouldBeLit () {
    return this.editor && this.editor.isSoftWrapped()
  }

  /**
   * Public: Toggles the soft wrap state of the currently tracked editor.
   */
  toggleSoftWrapped () {
    if (this.editor) {
      this.editor.toggleSoftWrapped()
    }
  }

  /**
   * Private: Sets the editor whose state the model is tracking.
   *
   * @param {TextEditor} editor Editor to display the soft wrap status for or `null` if the active
   *                            pane item is not an editor.
   */
  setActiveEditor (editor) {
    this.editor = editor
    this.subscribe(this.editor)
    this.updateView()
  }

  /**
   * Private: Subscribes to the state of a new editor.
   *
   * @param  {TextEditor} editor Editor to whose events the model should subscribe, if any.
   */
  subscribe (editor) {
    this.unsubscribe()

    if (editor) {
      this.editorSubscriptions = new CompositeDisposable

      this.editorSubscriptions.add(editor.onDidChangeGrammar(() => {
        this.updateView()
      }))

      this.editorSubscriptions.add(editor.onDidChangeSoftWrapped(() => {
        this.updateView()
      }))
    }
  }

  /**
   * Private: Unsubscribes from the old editor's events.
   */
  unsubscribe () {
    if (this.editorSubscriptions) {
      this.editorSubscriptions.dispose()
      this.editorSubscriptions = null
    }
  }

  /**
   * Private: Updates the view and triggers the update of the tooltip.
   */
  async updateView () {
    await this.view.update()

    this.updateTooltip()
  }

  /**
   * Private: Updates the tooltip to reflect the current state.
   */
  updateTooltip () {
    if (this.tooltipDisposable) {
      this.tooltipDisposable.dispose()
      this.tooltipDisposable = null
    }

    if (this.shouldRenderIndicator()) {
      const tooltipText = `Soft wrap is ${this.shouldBeLit() ? 'enabled' : 'disabled'}`

      this.tooltipDisposable = this.atomEnv.tooltips.add(this.view.element,
                                                         {title: tooltipText, trigger: 'hover'})
    }
  }
}
