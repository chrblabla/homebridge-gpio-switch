"use strict";

var Service, Characteristic;
var gpio = require("gpio");

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-gpio-switch", "GPIOSwitch", GPIOSwitch);
}

function GPIOSwitch(log, config) {
  this.log = log;
  this.name = config.name;
  this.service = new Service.Switch(this.name);

  this.pin = gpio.export(config.pin);

  this.service.getCharacteristic(Characteristic.On)
    .on('set', this.setOn.bind(this));

  // set default to off if pin is not already active
  var defaultValue = this.pin.value || false;
  this.service.setCharacteristic(Characteristic.On, defaultValue);
}

GPIOSwitch.prototype.getServices = function() {
  return [this.service];
}

GPIOSwitch.prototype.getStatus = function() {
  var state = this.pin.value;
  callback(null, state);
}

GPIOSwitch.prototype.setOn = function(state, callback) {
  this.log("Setting switch to " + state);
  this.pin.set(state);
  callback(null);
}
