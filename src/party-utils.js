var _ = require('lodash');
var utils = require('./utils');

var Player = function(config) {
  Object.assign(this, config);
  this.playtimes = (this.playtimes || []).map(function(time) {
    return new Date(time);
  });
};

Player.prototype.change = function(config, now) {
  if (config.resetPlaytime) {
    this.playtimes = [now]
  }

  if ((config.active === false && this.active) ||
      (config.active && !this.active)) {
    this.playtimes.push(now);
  }

  Object.assign(this, config);
};

Player.prototype.playtime = function() {
  var playtime = _(this.playtimes).chunk(2).map(function(pair) {
    var end = _.nth(pair, 1) || new Date();
    var start = _.first(pair);
    return end - start;
  }).sum()
  return playtime;
};

Player.prototype.repr = function() {
  return Object.assign({}, this, {playtime: this.playtime()});
};

var Party = function(config) {
  var options = config || {};
  this._party = [];
  this._defaults = options.defaults || {
    file: 'data/party.json',
    topics: ['party']
  };
  this._websocket = options.websocket;
}

Party.prototype.load = function(path) {
  var newParty = utils.readJsonFile(path || this._defaults.file);
  this._party = newParty.map(function(p) {
    return new Player(p);
  });
  this.emit();
};

Party.prototype.save = function(path) {
  utils.writeJsonFile(args.filepath || defaults.file, this._party);
};

Party.prototype.editPlayer = function(id, config) {
  var players = this.findPlayers(id);
  var now = new Date();
  players.forEach(function(player) { player.change(config, now); });
  this.emit();
};

Party.prototype.findPlayers = function(id) {
  return _.filter(this._party, id && {id: id});
};

Party.prototype.autocomplete = function() { return _.map(this._party, 'id')};

Party.prototype.repr = function() {
  return _.sortBy(this._party, function(player) { return !player.active })
          .map(function (player) { return player.repr(); });
};

// TODO: Add timestamp
Party.prototype.emit = function() {
  return this._websocket.send(JSON.stringify({
    type: 'config',
    topics: this._defaults.topics,
    data: this.repr()
  }));
};

module.exports = Party;
