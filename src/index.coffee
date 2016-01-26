
{ relative, join } = require "path"
{ sync, async } = require "io"

lotus = require "lotus-require"
log = require "lotus-log"
request = require "request"
inArray = require "in-array"

# # Check for a fork in $LOTUS_PATH
# Module = module.optional lotus.path + "/lotus/module"
#
# # Check for a global install
# Module ?= module.optional "lotus/module"

module.exports = ->

  renameEvent = (event) ->
    switch event
      when "added" then "add"
      when "changed" then "change"
      when "deleted" then "delete"

  onFileEvent = (file, event) ->
    event = renameEvent event
    url = "http://192.168.0.2:8081/watcher" + file.path + "?event=" + event
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

    include = sync.map patterns, (pattern) ->
      join module.path, pattern

    Module.watch { include }, onFileEvent

    async.each patterns, (pattern) ->
      module.watch pattern

    # TODO All this should probably happen elsewhere.
    # .then ->
    #   log
    #     .moat 1
    #     .yellow module.name
    #     .white " has "
    #     .cyan Object.keys(module.files).length
    #     .white " files!"
    #     .moat 1
    #   module.initialize().then ->
    #     async.all sync.reduce module.files, [], (promises, file) ->
    #       promises.push file.initialize()
    #       promises
    #   .then ->
    #     for name in Object.keys module._reportedMissing
    #       log
    #         .moat 1
    #         .yellow module.name
    #         .white " must install "
    #         .red name
    #         .moat 1
