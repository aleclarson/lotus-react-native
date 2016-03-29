
inArray = require "in-array"
request = require "request"
Path = require "path"
ip = require "ip"

exports.initCommands = ->
  lotus.Module._plugins["lotus-react-packager"] = exports

exports.initModule = (module, options) ->

  patterns = options.patterns or [
    "*.js"
    "js/src/**/*.js"
  ]

  include = sync.map patterns, (pattern) ->
    Path.join module.path, pattern

  lotus.Module.watch { include }, @didFileChange

  Q.all sync.map patterns, (pattern) ->
    module.watch pattern

exports.didFileChange = (file, event) ->
  event = "delete" if event is "unlink"
  url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event
  request url, (error) ->
    return unless error?
    log.moat 1
    log.red "Plugin Error: "
    log.gray.dim "{ plugin: "
    log.yellow "lotus-react-packager"
    log.gray.dim " }"
    log.moat 0
    log.white error.message
    log.moat 1
