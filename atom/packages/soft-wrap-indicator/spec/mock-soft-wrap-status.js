'use babel'

export default class MockSoftWrapStatus {
  constructor (shouldRenderIndicator, shouldBeLit) {
    this.render = shouldRenderIndicator
    this.light = shouldBeLit
    this.toggled = false
  }

  shouldBeLit () {
    return this.light
  }

  shouldRenderIndicator () {
    return this.render
  }

  toggleSoftWrapped () {
    this.toggled = true
  }
}
