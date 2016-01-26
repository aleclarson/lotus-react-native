var async, inArray, join, log, lotus, ref, ref1, relative, request, sync;

ref = require("path"), relative = ref.relative, join = ref.join;

ref1 = require("io"), sync = ref1.sync, async = ref1.async;

lotus = require("lotus-require");

log = require("lotus-log");

request = require("request");

inArray = require("in-array");

module.exports = function() {
  var onFileEvent, renameEvent;
  renameEvent = function(event) {
    switch (event) {
      case "added":
        return "add";
      case "changed":
        return "change";
      case "deleted":
        return "delete";
    }
  };
  onFileEvent = function(file, event) {
    var url;
    event = renameEvent(event);
    url = "http://192.168.0.2:8081/watcher" + file.path + "?event=" + event;
    return request(url, function(error) {
      if (error == null) {
        return;
      }
      return log.moat(1).red("Error: ").white(error.message).moat(1);
    });
  };
  return Module._plugins["reactPackager"] = function(module, options) {
    var include, patterns;
    patterns = ["*.js", "js/src/**/*.js"];
    include = sync.map(patterns, function(pattern) {
      return join(module.path, pattern);
    });
    Module.watch({
      include: include
    }, onFileEvent);
    return async.each(patterns, function(pattern) {
      return module.watch(pattern);
    });
  };
};

//# sourceMappingURL=../../map/src/index.map
