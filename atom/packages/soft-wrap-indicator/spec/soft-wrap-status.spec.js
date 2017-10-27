'use babel'

import SoftWrapStatus from '../lib/soft-wrap-status'

import MockEditor from './mock-editor'

describe('SoftWrapStatus', function () {
  let atomEnv, status

  beforeEach(function () {
    atomEnv = global.buildAtomEnvironment()
  })

  afterEach(function () {
    atomEnv.destroy()
  })

  describe('when editor is null', function () {
    beforeEach(function () {
      status = new SoftWrapStatus(atomEnv, null)
    })

    it('does not render the indicator', function () {
      expect(status.shouldRenderIndicator()).to.not.be.ok
    })

    it('does not light the indicator', function () {
      expect(status.shouldBeLit()).to.not.be.ok
    })

    it('does not raise an exception when attempting to toggle soft wrap', function () {
      status.toggleSoftWrapped()
    })
  })

  describe('when editor is an editor', function () {
    describe('and softWrapped is false', function () {
      let editor

      beforeEach(function () {
        editor = new MockEditor(false)
        status = new SoftWrapStatus(atomEnv, editor)
      })

      it('renders the indicator', function () {
        expect(status.shouldRenderIndicator()).to.be.ok
      })

      it('does not light the indicator', function () {
        expect(status.shouldBeLit()).to.not.be.ok
      })

      it('toggles soft wrap', function () {
        status.toggleSoftWrapped()

        expect(editor.toggled).to.be.true
      })
    })

    describe('and softWrapped is true', function () {
      let editor

      beforeEach(function () {
        editor = new MockEditor(true)
        status = new SoftWrapStatus(atomEnv, editor)
      })

      it('renders the indicator', function () {
        expect(status.shouldRenderIndicator()).to.be.ok
      })

      it('lights the indicator', function () {
        expect(status.shouldBeLit()).to.be.ok
      })

      it('toggles soft wrap', function () {
        status.toggleSoftWrapped()

        expect(editor.toggled).to.be.true
      })
    })
  })
})
