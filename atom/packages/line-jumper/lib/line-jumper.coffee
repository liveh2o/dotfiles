getEditor = ->
  atom.workspace.getActiveTextEditor()

getLinesToJump = ->
  atom.config.get('line-jumper.numberOfLines')

module.exports =
  config:
    numberOfLines:
      type: 'integer'
      default: 10
      minimum: 1

  activate: ->
    atom.commands.add 'atom-workspace', 'line-jumper:move-up', ->
      getEditor()?.moveUp(getLinesToJump())

    atom.commands.add 'atom-workspace', 'line-jumper:move-down', ->
      getEditor()?.moveDown(getLinesToJump())

    atom.commands.add 'atom-workspace', 'line-jumper:select-up', ->
      getEditor()?.selectUp(getLinesToJump())

    atom.commands.add 'atom-workspace', 'line-jumper:select-down', ->
      getEditor()?.selectDown(getLinesToJump())
