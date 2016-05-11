
request = require "request"
syncFs = require "io/sync"
sync = require "sync"
Path = require "path"
ip = require "ip"

module.exports = (mod) ->

  mod.load [ "config" ]

  .then ->

    patterns = []
    patterns[0] = "*.js"
    patterns[1] = mod.dest + "/**/*.js" if mod.dest

    mod.watch patterns, notifyPackager

ignoredEvents = { ready: yes }

notifyPackager = (event, file) ->

  assertType event, String
  return if ignoredEvents[event]
  event = "delete" if event is "unlink"

  assertType file, lotus.File

  url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event

  request url, (error) ->
    return unless error
    log.moat 1
    log.red "Plugin error: "
    log.white "lotus-react-packager"
    log.moat 0
    log.gray.dim error.message
    log.moat 1
