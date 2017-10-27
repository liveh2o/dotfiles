LineJumper = require '../lib/line-jumper'

describe "LineJumper", ->
  [editor, workspaceElement] = []
  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    waitsForPromise ->
      Promise.all [
        atom.packages.activatePackage("line-jumper")
        atom.workspace.open('sample.js').then (e) ->
          editor = e
      ]

  describe "moving and selecting down", ->
    it "moves down", ->
      atom.commands.dispatch(workspaceElement, 'line-jumper:move-down')
      pos = editor.getCursorBufferPosition()
      expect(pos).toEqual [10,0]

    it "selects down", ->
      atom.commands.dispatch(workspaceElement, 'line-jumper:select-down')
      bufferRange = editor.getSelectedBufferRange()
      expect(bufferRange).toEqual [[0,0],[10,0]]

  describe "moving and selecting up", ->
    beforeEach ->
      pos = editor.setCursorBufferPosition([12,0])

    it "moves up", ->
      atom.commands.dispatch(workspaceElement, 'line-jumper:move-up')
      pos = editor.getCursorBufferPosition()
      expect(pos).toEqual [2,0]

    it "selects down", ->
      atom.commands.dispatch(workspaceElement, 'line-jumper:select-up')
      bufferRange = editor.getSelectedBufferRange()
      expect(bufferRange).toEqual [[2,0],[12,0]]

  describe "when the line-jumper.numberOfLines config is set", ->
    it "jumps by the configured number of lines", ->
      atom.config.set('line-jumper.numberOfLines', 5)
      atom.commands.dispatch(workspaceElement, 'line-jumper:move-down')
      expect(editor.getCursorBufferPosition()).toEqual [5,0]

      atom.config.set('line-jumper.numberOfLines', 2)
      atom.commands.dispatch(workspaceElement, 'line-jumper:move-down')
      expect(editor.getCursorBufferPosition()).toEqual [7,0]

      atom.config.set('line-jumper.numberOfLines', -1)
      atom.commands.dispatch(workspaceElement, 'line-jumper:move-down')
      expect(editor.getCursorBufferPosition()).toEqual [8,0]
