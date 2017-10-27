Rails = require './rails'

module.exports =
  config:
    specSearchPaths:
      type: 'array'
      default: ['spec', 'fast_spec']
    specDefaultPath:
      type: 'string'
      default: 'spec'

  activate: (state) ->
    atom.commands.add 'atom-text-editor',
      'rails-rspec:toggle-spec-file': (event) => @toggleSpecFile()

  toggleSpecFile: ->
    editor = atom.workspace.getActiveTextEditor()
    specPaths = atom.config.get 'rails-rspec.specSearchPaths'
    specDefault = atom.config.get 'rails-rspec.specDefaultPath'
    root = atom.project.getPaths()[0]
    file = new Rails(root, specPaths, specDefault).toggleSpecFile(editor.getPath())
    atom.workspace.open(file) if file?
