{CompositeDisposable} = require 'atom'

module.exports =
class WrapGuideElement
  constructor: (@editor, @editorElement) ->
    @element = document.createElement('div')
    @element.setAttribute('is', 'wrap-guide')
    @element.classList.add('wrap-guide')
    @attachToLines()
    @handleEvents()
    @updateGuide()

    @element.updateGuide = @updateGuide.bind(this)
    @element.getDefaultColumn = @getDefaultColumn.bind(this)

  attachToLines: ->
    scrollView = @editorElement.querySelector('.scroll-view')
    scrollView?.appendChild(@element)

  handleEvents: ->
    updateGuideCallback = => @updateGuide()

    subscriptions = new CompositeDisposable
    configSubscriptions = @handleConfigEvents()
    subscriptions.add atom.config.onDidChange('wrap-guide.columns', updateGuideCallback)
    subscriptions.add atom.config.onDidChange 'editor.fontSize', ->
      # setTimeout because we need to wait for the editor measurement to happen
      setTimeout(updateGuideCallback, 0)

    subscriptions.add @editorElement.onDidChangeScrollLeft(updateGuideCallback)
    subscriptions.add @editor.onDidChangePath(updateGuideCallback)
    subscriptions.add @editor.onDidChangeGrammar =>
      configSubscriptions.dispose()
      configSubscriptions = @handleConfigEvents()
      updateGuideCallback()

    subscriptions.add @editor.onDidDestroy ->
      subscriptions.dispose()
      configSubscriptions.dispose()

    subscriptions.add @editorElement.onDidAttach =>
      @attachToLines()
      updateGuideCallback()

  handleConfigEvents: ->
    updateGuideCallback = => @updateGuide()
    subscriptions = new CompositeDisposable
    subscriptions.add atom.config.onDidChange(
      'editor.preferredLineLength',
      scope: @editor.getRootScopeDescriptor(),
      updateGuideCallback
    )
    subscriptions.add atom.config.onDidChange(
      'wrap-guide.enabled',
      scope: @editor.getRootScopeDescriptor(),
      updateGuideCallback
    )
    subscriptions

  getDefaultColumn: ->
    atom.config.get('editor.preferredLineLength', scope: @editor.getRootScopeDescriptor())

  getGuideColumn: (path, scopeName) ->
    customColumns = atom.config.get('wrap-guide.columns')
    return @getDefaultColumn() unless Array.isArray(customColumns)

    for customColumn in customColumns when typeof customColumn is 'object'
      {pattern, scope, column} = customColumn
      if pattern
        try
          regex = new RegExp(pattern)
        catch
          continue
        return parseInt(column) if regex.test(path)
      else if scope
        return parseInt(column) if scope is scopeName
    @getDefaultColumn()

  isEnabled: ->
    atom.config.get('wrap-guide.enabled', scope: @editor.getRootScopeDescriptor()) ? true

  updateGuide: ->
    column = @getGuideColumn(@editor.getPath(), @editor.getGrammar().scopeName)
    if column > 0 and @isEnabled()
      columnWidth = @editorElement.getDefaultCharacterWidth() * column
      columnWidth -= @editorElement.getScrollLeft()
      @element.style.left = "#{Math.round(columnWidth)}px"
      @element.style.display = 'block'
    else
      @element.style.display = 'none'
