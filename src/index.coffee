
exports.globalDependencies = [
  "lotus-watch"
]

exports.initModuleType = ->
  return (type) ->
    type.didBuild (Module) ->
      Module._plugins.push "lotus-react-packager"

exports.initModule = ->
  require "./initModule"
