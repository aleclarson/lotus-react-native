var assertType, fetch, ignoredEvents, ip, log, notifyPackager;

fetch = require("fetch").fetch;

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
  "ready": "ready"
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
  url = "http://" + ip.address() + ":8081/watcher";
  url += file.path;
  url += "?force=true&event=" + event;
  return fetch(url).fail(function(error) {
    if (/Network request failed/.test(error.message)) {
      return;
    }
    log.moat(1);
    log.gray("lotus-react-packager");
    log.moat(0);
    log.red("Error: ");
    log.white(error.message);
    return log.moat(1);
  });
};

//# sourceMappingURL=map/initModule.map
