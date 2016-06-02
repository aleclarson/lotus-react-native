
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

ignoredEvents = { ready: yes }

notifyPackager = (event, file) ->

  assertType event, String
  return if ignoredEvents[event]
  event = "delete" if event is "unlink"

  assertType file, lotus.File
  fetch "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event
