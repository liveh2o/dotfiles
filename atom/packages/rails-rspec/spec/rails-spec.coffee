Path = require 'path'
Rails = require '../lib/rails'

describe 'Rails', ->
  rootPath = Path.join __dirname, 'fixtures'
  rails = new Rails(rootPath, ['spec', 'fast_spec'], 'spec')

  describe 'toggleSpecFile', ->
    libA = Path.join rootPath, 'lib/a.rb'
    libASpec = Path.join rootPath, 'spec/lib/a_spec.rb'
    modelA = Path.join rootPath, 'app/models/a.rb'
    modelASpec = Path.join rootPath, 'spec/models/a_spec.rb'
    libB = Path.join rootPath, 'lib/b.rb'
    libBSpec = Path.join rootPath, 'fast_spec/lib/b_spec.rb'
    modelB = Path.join rootPath, 'app/models/b.rb'
    modelBSpec = Path.join rootPath, 'fast_spec/models/b_spec.rb'
    viewA = Path.join rootPath, 'app/views/a.html.erb'
    viewASpec = Path.join rootPath, 'spec/views/a.html.erb_spec.rb'
    viewHamlA = Path.join rootPath, 'app/views/a.html.haml'
    viewHamlASpec = Path.join rootPath, 'spec/views/a.html.haml_spec.rb'

    it 'returns spec file for tested file', ->
      expect(rails.toggleSpecFile(libA)).toBe libASpec
      expect(rails.toggleSpecFile(modelA)).toBe modelASpec
      expect(rails.toggleSpecFile(viewA)).toBe viewASpec
      expect(rails.toggleSpecFile(viewHamlA)).toBe viewHamlASpec

    it 'returns tested file for spec file', ->
      expect(rails.toggleSpecFile(libASpec)).toBe libA
      expect(rails.toggleSpecFile(modelASpec)).toBe modelA
      expect(rails.toggleSpecFile(viewASpec)).toBe viewA
      expect(rails.toggleSpecFile(viewHamlASpec)).toBe viewHamlA

    it 'returns null for not ruby file', ->
      expect(rails.toggleSpecFile('/f/rails/app/test.json')).toBeNull()

    it 'returns null for ruby file not in app or lib or spec folder', ->
      expect(rails.toggleSpecFile('/f/rails/config/application.rb')).toBeNull()

    it 'returns fast_spec file for tested file', ->
      expect(rails.toggleSpecFile(libB)).toBe libBSpec
      expect(rails.toggleSpecFile(modelB)).toBe modelBSpec

    it 'returns tested file for fast_spec file', ->
      expect(rails.toggleSpecFile(libBSpec)).toBe libB
      expect(rails.toggleSpecFile(modelBSpec)).toBe modelB
