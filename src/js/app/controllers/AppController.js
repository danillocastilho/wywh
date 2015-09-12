var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var Controller              = require('./abstract/Controller');
var State                   = require('../core/State');
var StateModel              = require('../models/StateModel');
var ClipController          = require('../controllers/ClipController');

function AppController () {
  Controller.call(this)
}

AppController.prototype = Object.create(Controller.prototype)
AppController.constructor = AppController

AppController.prototype.init = function () {
  Controller.prototype.init.call(this);

  // var geometry = new THREE.BoxGeometry( 200, 200, 200 );
  // var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  // var mesh = new THREE.Mesh( geometry, material );
  // this.root.add( mesh );
  
  this.state = new State;
  
  this.view                   = new StateModel();
  this.view.controller        = new ClipController();
  this.view.address           = '';
  this.view.className         = 'page view';

  var views = [this.view];

  this.state.init( this.root );
  this.state.add( views, "" );
  this.state.navigateTo('/');
  
}

AppController.prototype.show = function () {
  
}

AppController.prototype.onShow = function () {
  
}

AppController.prototype.hide = function () {
  
}

AppController.prototype.onHide = function () {
  
}

AppController.prototype.dispose = function () {
  
}

module.exports = AppController