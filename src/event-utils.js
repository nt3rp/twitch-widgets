var _ = require('lodash');
var utils = require('./utils');

var EventManager = function(config) {
  var options = config || {};
  this._filter = undefined;
  this._events = [];
  this._defaults = options.defaults || {
    file: 'data/events.json',
    topics: ['party']
  };
  this._websocket = options.websocket;
};

EventManager.prototype.load = function(path) {
  var newEvents = utils.readJsonFile(path || this._defaults.file);
  this._events = newEvents;
};

// TODO: timestamp revisions
EventManager.prototype.save = function() {
  utils.writeJsonFile(args.filepath || defaults.file, this._party);
}

EventManager.prototype.log = function(args) {
  var event = this.find(args.id);
  if (!event) {
    event = {
      id: utils.slugify(args.name),
      name: args.name || '',
      description: args.name || '',
      tags: (args.tags || '').split(' ') || []
    }
    this._events.push(newEvent);
  }

  event.triggered = event.triggered || [];
  event.triggered.push(new Date());
  this.emit({data: event});
}

EventManager.prototype.find = function (id) {
  return _.find(this._events, {id: id});
}

EventManager.prototype.autocomplete = function() {
  return _.map(this._events, 'id');
}

EventManager.prototype.filter = function(tag) {
  this._filter = tag;
  this.emit({data: this.history(), topics: ['history']);
};

EventManager.prototype.tags = function() {
  return _(this._events).flatMap('tags').compact().concat('*').uniq().value()
};

EventManager.prototype.history = function() {
  var that = this;
  return _(this._events)
    .filter('triggered')
    .filter(function(e) { return !that._filter || e.tags.includes(that._filter)})
    .sortBy(function(e){ return e.triggered.slice(-1)[0] })
    .value()
}

EventManager.prototype.emit = function(event) {
  var mergedEvent = Object.assign({
    type: 'event',
    topics: this._defaults.topics,
  }, event);
  var wsEvent = JSON.stringify(mergedEvent);
  return this._websocket.send(wsEvent);
}

module.exports = EventManager;
