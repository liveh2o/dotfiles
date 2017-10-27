(function() {
  var GlobalVimState;

  module.exports = GlobalVimState = (function() {
    function GlobalVimState() {}

    GlobalVimState.prototype.registers = {};

    GlobalVimState.prototype.searchHistory = [];

    GlobalVimState.prototype.currentSearch = {};

    GlobalVimState.prototype.currentFind = null;

    return GlobalVimState;

  })();

}).call(this);
