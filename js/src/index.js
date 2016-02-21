var async, inArray, ip, join, log, lotus, ref, ref1, relative, request, sync;

lotus = require("lotus-require");

ref = require("path"), relative = ref.relative, join = ref.join;

ref1 = require("io"), sync = ref1.sync, async = ref1.async;

ip = require("ip");

log = require("lotus-log");

request = require("request");

inArray = require("in-array");

module.exports = function() {
  var onFileEvent;
  onFileEvent = function(file, event) {
    var url;
    if (event === "unlink") {
      event = "delete";
    }
    url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event;
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
