Path = require 'path'
{Workspace} = require 'atom'
RailsRspec = require '../lib/rails-rspec'

describe 'RailsRspec', ->
  activationPromise = null
  currentPath = ->
    atom.workspace.getActiveTextEditor().getPath()

  toggleFile = (file) ->
    atom.workspace.openSync file
    editor = atom.workspace.getActiveTextEditor()
    atom.commands.dispatch atom.views.getView(editor), 'rails-rspec:toggle-spec-file'
    waitsForPromise ->
      activationPromise

  beforeEach ->
    atom.commands.dispatch atom.views.getView(atom.workspace), 'rails-rspec:toggle-spec-file'
    activationPromise = atom.packages.activatePackage('rails-rspec')

  describe 'when the rails-rspec:toggle-spec-file event is triggered', ->
    it 'swtiches to spec file', ->
      toggleFile 'app/models/user.rb'

      runs ->
        expect(currentPath()).toBe Path.join(__dirname, 'fixtures/spec/models/user_spec.rb')
