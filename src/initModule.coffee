
{ fetch } = require "fetch"

assertType = require "assertType"
log = require "log"
ip = require "ip"

module.exports = (mod) ->

  mod.load [ "config" ]

  .then ->

    patterns = []
    patterns[0] = "*.js"
    patterns[1] = mod.dest + "/**/*.js" if mod.dest

    mod.watch patterns, notifyPackager

ignoredEvents = { "ready" }

# TODO: Provide an endpoint for the ReactPackager to
#       listen for changes on its own (without a plugin).
notifyPackager = (event, file) ->

  assertType event, String

  return if ignoredEvents[event]

  if event is "unlink"
    event = "delete"

  assertType file, lotus.File

  url = "http://" + ip.address() + ":8081/watcher"
  url += file.path # TODO: normalize `file.path` to use '/'
  url += "?force=true&event=" + event

  fetch url

  .fail (error) ->

    if /Network request failed/.test error.message
      return

    log.moat 1
    log.gray "lotus-react-packager"
    log.moat 0
    log.red "Error: "
    log.white error.message
    log.moat 1
