var Path, assertType, ignoredEvents, ip, notifyPackager, request, sync, syncFs;

assertType = require("assertType");

request = require("request");

syncFs = require("io/sync");

sync = require("sync");

Path = require("path");

ip = require("ip");

module.exports = function(mod) {
  return mod.load(["config"]).then(function() {
    var patterns;
    patterns = [];
    patterns[0] = "*.js";
    if (mod.dest) {
      patterns[1] = mod.dest + "/**/*.js";
    }
    return mod.watch(patterns, notifyPackager);
  });
};

ignoredEvents = {
  ready: true
};

notifyPackager = function(event, file) {
  var url;
  assertType(event, String);
  if (ignoredEvents[event]) {
    return;
  }
  if (event === "unlink") {
    event = "delete";
  }
  assertType(file, lotus.File);
  url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event;
  return request(url, function(error) {
    if (!error) {
      return;
    }
    log.moat(1);
    log.red("Plugin error: ");
    log.white("lotus-react-packager");
    log.moat(0);
    log.gray.dim(error.message);
    return log.moat(1);
  });
};

//# sourceMappingURL=../../map/src/initModule.map
