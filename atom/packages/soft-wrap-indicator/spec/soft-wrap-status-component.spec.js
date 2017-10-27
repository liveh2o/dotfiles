'use babel'

import etch from 'etch'

import MockSoftWrapStatus from './mock-soft-wrap-status'
import SoftWrapStatusComponent from '../lib/soft-wrap-status-component'
import SynchronousScheduler from './etch-synchronous-scheduler'

describe('SoftWrapStatusComponent', function () {
  let component, model, previousScheduler

  beforeEach(function () {
    previousScheduler = etch.getScheduler()
    etch.setScheduler(new SynchronousScheduler())
  })

  afterEach(function () {
    etch.setScheduler(previousScheduler)
  })

  describe('when shouldRenderIndicator is false', function () {
    beforeEach(function () {
      model = new MockSoftWrapStatus(false, false)
      component = new SoftWrapStatusComponent(model)
      component.update()
    })

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be.true
    })

    it('does not render the indicator', function () {
      expect(component.element.querySelector('a.soft-wrap-indicator')).to.be.null
    })

    it('does not toggle the soft wrap when clicked', function () {
      component.element.click()

      expect(model.toggled).to.be.false
    })
  })

  describe('when shouldRenderIndicator is true', function () {
    beforeEach(function () {
      model = new MockSoftWrapStatus(true, false)
      component = new SoftWrapStatusComponent(model)
      component.update()
    })

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be.true
    })

    describe('the indicator', function () {
      let indicator

      beforeEach(function () {
        indicator = component.element.querySelector('a.soft-wrap-indicator')
      })

      it('is unlit', function () {
        expect(indicator).to.be.ok
        expect(indicator.classList.contains('lit')).to.be.false
      })

      it('toggles the soft wrap when clicked', function () {
        indicator.click()

        expect(model.toggled).to.be.true
      })
    })
  })

  describe('when shouldRenderIndicator and shouldBeLit are both true', function () {
    beforeEach(function () {
      model = new MockSoftWrapStatus(true, true)
      component = new SoftWrapStatusComponent(model)
      component.update()
    })

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be.true
    })

    describe('the indicator', function () {
      beforeEach(function () {
        indicator = component.element.querySelector('a.soft-wrap-indicator')
      })

      it('is lit', function () {
        expect(indicator).to.be.ok
        expect(indicator.classList.contains('lit')).to.be.true
      })

      it('toggles the soft wrap when clicked', function () {
        indicator.click()

        expect(model.toggled).to.be.true
      })
    })
  })
})
