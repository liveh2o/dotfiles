'use babel'

import {CompositeDisposable} from 'atom'

export default class MockEditor {
  constructor (softWrap) {
    this.softWrap = softWrap
    this.toggled = false
  }

  onDidChangeGrammar () {
    return new CompositeDisposable()
  }

  onDidChangeSoftWrapped () {
    return new CompositeDisposable()
  }

  onDidDestroy () {
    return new CompositeDisposable()
  }

  isSoftWrapped () {
    return this.softWrap
  }

  toggleSoftWrapped () {
    this.toggled = true
  }
}
