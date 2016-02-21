
lotus = require "lotus-require"

{ relative, join } = require "path"
{ sync } = require "io"

ip = require "ip"
log = require "lotus-log"
request = require "request"
inArray = require "in-array"

module.exports = ->

  onFileEvent = (file, event) ->
    event = "delete" if event is "unlink"
    url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event
    request url, (error) ->
      return unless error?
      log
        .moat 1
        .red "Error: "
        .white error.message
        .moat 1

  Module._plugins["reactPackager"] = (module, options) ->

    patterns = [
      "*.js"
      "js/src/**/*.js"
    ]

    sync.each patterns, (pattern) ->
      module.watch pattern

    include = sync.map patterns, (pattern) ->
      join module.path, pattern

    Module.watch { include }, onFileEvent
