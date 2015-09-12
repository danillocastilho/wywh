var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');

function Controller () {
  
}

Controller.prototype = {

  tag: 'div',
  root: null,

  init: function () {
    this.root = new THREE.Group();
  },

  open: function () {
    
  },

  close: function () {
    
  },

  dispose: function () {
    this.root = null;
    delete this.root;
  },

  onOpen: function () {
    
  },

  onClose: function () {

  },

  onResize: function () {
    
  },

  addEventListener: function(evt, callback) {
    if (!this.hasOwnProperty(evt)){ this[evt] = Array() }
    this[evt].push(callback);
    return this;
  },

  removeEventListener: function(evt, callback) {
    this[evt] = [];
  },

  dispatchEvent: function(evt, params) {
    if (evt in this) {
        callbacks = this[evt];
        for (var x in callbacks){ callbacks[x](params)}
    }
    return this;
  }
}

module.exports = Controller


