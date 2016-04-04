
request = require "request"
syncFs = require "io/sync"
Path = require "path"
ip = require "ip"

module.exports = (module, options) ->

  patterns = [ "*.js" ]

  buildDir = "js/src"
  buildDir = null unless syncFs.isDir module.path + "/" + buildDir

  unless buildDir
    buildDir = "src"
    buildDir = null unless syncFs.isDir module.path + "/" + buildDir

  if buildDir
    patterns.push buildDir + "/**/*.js"

  watchOptions =
    include: sync.map patterns, (pattern) ->
      Path.join module.path, pattern

  # Watch the module for source file events.
  lotus.Module.watch watchOptions, didFileChange

  # Crawl the module for its source files.
  Q.all sync.map patterns, (pattern) ->
    module.crawl pattern

didFileChange = (file, event) ->
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
