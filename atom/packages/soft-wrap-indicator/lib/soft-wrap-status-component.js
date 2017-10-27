'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import stateless from 'etch-stateless'

const IndicatorAnchor = stateless(etch, ({onclick, wrapped}) => {
  let classes = 'soft-wrap-indicator'
  if (wrapped) {
    classes += ' lit'
  }

  return <a className={classes} onclick={onclick} href="#">Wrap</a>
})

/**
 * Handles the UI for the status bar element.
 */
export default class SoftWrapStatusComponent {
  /**
   * Public: Initializes the component.
   *
   * @param {SoftWrapStatus} model Model that handles the logic behind the component.
   */
  constructor (model) {
    this.model = model

    etch.initialize(this)
  }

  /**
   * Public: Draws the component.
   *
   * @return {HTMLElement} HTML of the component.
   */
  render () {
    return (
      <div className="soft-wrap-status-component inline-block">
        {this.renderIndicator()}
      </div>
    )
  }

  /**
   * Public: Updates the state of the component before being redrawn.
   *
   * @return {Promise} Resolved when the component is done updating.
   */
  update () {
    return etch.update(this)
  }

  /**
   * Public: Destroys the component.
   */
  destroy () {
    etch.destroy(this)
  }

  /**
   * Private: Draws the clickable indicator, if necessary.
   *
   * @return {HTMLElement} HTML of the clickable indicator.
   */
  renderIndicator () {
    if (this.model.shouldRenderIndicator()) {
      return (
        <IndicatorAnchor onclick={this.model.toggleSoftWrapped.bind(this.model)}
                         wrapped={this.model.shouldBeLit()} />
      )
    }
  }
}
