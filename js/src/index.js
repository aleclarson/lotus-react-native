var Path, inArray, ip, request;

inArray = require("in-array");

request = require("request");

Path = require("path");

ip = require("ip");

exports.initCommands = function() {
  return lotus.Module._plugins["lotus-react-packager"] = exports;
};

exports.initModule = function(module, options) {
  var include, patterns;
  patterns = options.patterns || ["*.js", "js/src/**/*.js"];
  include = sync.map(patterns, function(pattern) {
    return Path.join(module.path, pattern);
  });
  lotus.Module.watch({
    include: include
  }, this.didFileChange);
  return Q.all(sync.map(patterns, function(pattern) {
    return module.watch(pattern);
  }));
};

exports.didFileChange = function(file, event) {
  var url;
  if (event === "unlink") {
    event = "delete";
  }
  url = "http://" + ip.address() + ":8081/watcher" + file.path + "?force=true&event=" + event;
  return request(url, function(error) {
    if (error == null) {
      return;
    }
    log.moat(1);
    log.red("Plugin Error: ");
    log.gray.dim("{ plugin: ");
    log.yellow("lotus-react-packager");
    log.gray.dim(" }");
    log.moat(0);
    log.white(error.message);
    return log.moat(1);
  });
};

//# sourceMappingURL=../../map/src/index.map
