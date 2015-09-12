var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var Controller              = require('./abstract/Controller');
var ViewEvent               = require('../events/ViewEvent');
var ControllerEvent         = require('../events/ControllerEvent');
var ClipView                = require('../views/ClipView');

function ClipController () {
  Controller.call(this)
}

ClipController.prototype = Object.create(Controller.prototype)
ClipController.constructor = ClipController

ClipController.prototype.init = function () {
  Controller.prototype.init.call(this);
  this.view = new ClipView;
  // console.log('[ClipController] init');
}

ClipController.prototype.show = function () {
  this.view.addEventListener(ViewEvent.OPEN, this.onShow.bind(this));
  this.view.addEventListener(ViewEvent.CLOSE, this.onHide.bind(this));
  this.view.init();

  this.root.add(this.view.root);
  this.view.open();
  // console.log('[ClipController] show');
}

ClipController.prototype.onShow = function () {
  this.dispatchEvent(ControllerEvent.OPEN);
  // console.log('[ClipController] onShow');
}

ClipController.prototype.hide = function () {
  this.view.close();
  //console.log('[ClipController] hide');
}

ClipController.prototype.onHide = function () {
  this.dispatchEvent(ControllerEvent.CLOSE);
  //console.log('[ClipController] onHide');
}

ClipController.prototype.dispose = function () {
  this.view.removeEventListener(ViewEvent.OPEN, this.onShow.bind(this));
  this.view.removeEventListener(ViewEvent.CLOSE, this.onHide.bind(this));
  this.root.remove(this.view.root);
  this.view.dispose();
  //console.log('[ClipController] dispose');
}

module.exports = ClipController