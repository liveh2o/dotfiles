# etch-stateless

etch-stateless is a library to facilitate creating Etch components from functions that take props and children and return JSX.

### API

`stateless(etch, renderFn)`

* `etch` - an instance of the Etch library
* `renderFn(props, children)` - a function that takes properties and children and returns Etch-based virtual DOM nodes

### Overview

If your Etch component doesn't manage any internal state, it can be useful to describe the component in terms of a function that takes some input and returns JSX:

```javascript
import etch from 'etch'
import stateless from 'etch-stateless'

const MyComponent = stateless(etch, function(props, children) {
  return <div prop={props.myProp}>{children}</div>
})
```

The component will automatically re-render using the supplied function any time a parent calls the component's `update` hook (which happens whenever new props or children are passed to the component).

### Under the Hood

etch-stateless is simply sugar for a plain Etch component. For example,

```javascript
const MyComponent = stateless(etch, function(props, children) {
  return <div prop={props.myProp}>{children}</div>
})
```

is the same as:

```javascript
class MyComponent {
  constructor (props, children) {
    this.props = props
    this.children = children
    etch.initialize(this)
  }

  update (props, children) {
    this.props = props
    this.children = children
    etch.update(this)
  }

  render () {
    return <div prop={this.props.myProp}>{this.children}</div>
  }
}
```
