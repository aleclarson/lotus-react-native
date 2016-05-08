exports.globalDependencies = ["lotus-watch"];

exports.initModuleType = function() {
  return function(type) {
    return type.didBuild(function(Module) {
      return Module._plugins.push("lotus-react-packager");
    });
  };
};

exports.initModule = function() {
  return require("./initModule");
};

//# sourceMappingURL=../../map/src/index.map
