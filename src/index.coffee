
module.exports = (commands, injectPlugin) ->

  @injectPlugin "lotus-react-packager"

  initModule: -> require "./initModule"
