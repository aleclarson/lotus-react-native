module.exports = function(commands, injectPlugin) {
  this.injectPlugin("lotus-react-packager");
  return {
    initModule: function() {
      return require("./initModule");
    }
  };
};

//# sourceMappingURL=../../map/src/index.map
