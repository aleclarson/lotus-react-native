var assertType, emptyFunction, fetch, ignoredEvents, ip, log, notifyPackager;

fetch = require("fetch").fetch;

emptyFunction = require("emptyFunction");

assertType = require("assertType");

log = require("log");

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
  assertType(event, String);
  if (ignoredEvents[event]) {
    return;
  }
  if (event === "unlink") {
    event = "delete";
  }
  assertType(file, lotus.File);
  return fetch("http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event).fail(emptyFunction);
};

//# sourceMappingURL=../../map/src/initModule.map
