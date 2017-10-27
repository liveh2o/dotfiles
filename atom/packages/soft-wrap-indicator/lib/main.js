'use babel'

let model = null
let tile = null

export function consumeStatusBar (statusBar) {
  const SoftWrapStatus = require('./soft-wrap-status')
  model = new SoftWrapStatus()
  tile = statusBar.addLeftTile({item: model.view.element, priority: 150})
}

export function deactivate () {
  if (model) {
    model.destroy()
    model = null
  }

  if (tile) {
    tile.destroy()
    tile = null
  }
}
