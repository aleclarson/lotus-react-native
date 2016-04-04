var Path, didFileChange, ip, request, syncFs;

request = require("request");

syncFs = require("io/sync");

Path = require("path");

ip = require("ip");

module.exports = function(module, options) {
  var buildDir, patterns, watchOptions;
  patterns = ["*.js"];
  buildDir = "js/src";
  if (!syncFs.isDir(module.path + "/" + buildDir)) {
    buildDir = null;
  }
  if (!buildDir) {
    buildDir = "src";
    if (!syncFs.isDir(module.path + "/" + buildDir)) {
      buildDir = null;
    }
  }
  if (buildDir) {
    patterns.push(buildDir + "/**/*.js");
  }
  watchOptions = {
    include: sync.map(patterns, function(pattern) {
      return Path.join(module.path, pattern);
    })
  };
  lotus.Module.watch(watchOptions, didFileChange);
  return Q.all(sync.map(patterns, function(pattern) {
    return module.crawl(pattern);
  }));
};

didFileChange = function(file, event) {
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

//# sourceMappingURL=../../map/src/initModule.map
