var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var View                    = require('./abstract/View');
var ViewEvent               = require('../events/ViewEvent');

var CubeParticle            = require('./commons/particles/CubeParticle');
var MemberParticle          = require('./commons/particles/MemberParticle');
var Particle                = require('./commons/particles/Particle');
var Foot                    = require('./commons/particles/Foot');

function ClipView () {
  View.call(this);
}

ClipView.prototype = Object.create(View.prototype);
ClipView.constructor = ClipView;

ClipView.prototype.init = function () {
  View.prototype.init.call(this);

  this.cubePartciles = new CubeParticle();
  this.cubePartciles.init();

  // this.particle = new Particle();
  // this.particle.init();
}

ClipView.prototype.open = function () {
  View.prototype.open.call(this);

  this.leg = new THREE.Group();
  /*
  this.topLeg = new MemberParticle({
    width: 70,
    height: 200,
    depth: 70,
    particleCount: 30,
    helper: true,
  });
  this.topLeg.init();
  this.topLeg.open();
  this.leg.add(this.topLeg.root);

  this.bottomLeg = new MemberParticle({
    width: 50,
    height: 200,
    depth: 50,
    particleCount: 30,
    helper: true,
  });
  this.bottomLeg.init();
  this.bottomLeg.open();
  this.bottomLeg.root.position.y = this.topLeg.root.position.y + (-180);
  this.bottomLeg.root.position.x = this.topLeg.root.position.x;
  this.leg.add(this.bottomLeg.root);

  this.feet = new MemberParticle({
    width: 100,
    height: 50,
    depth: 50,
    particleCount: 10,
    helper: true,
  });
  this.feet.init();
  this.feet.open();
  this.feet.root.position.y = this.bottomLeg.root.position.y + (-100);
  this.feet.root.position.x = this.bottomLeg.root.position.x + 25;
  this.leg.add(this.feet.root);
  */

  // this.foot = new Foot();
  // this.foot.init();
  // this.foot.open();
  // this.leg.add( this.foot.root );

  // this.root.add(this.leg);

  this.cubePartciles.open();
  this.root.add(this.cubePartciles.root);

  // this.particle.open();
  // this.root.add(this.particle.root);

  this.onResize();
  this.onOpen();
}

ClipView.prototype.close = function () {
  View.prototype.close.call(this);
  this.onClose();
}

ClipView.prototype.dispose = function () {
  View.prototype.dispose.call(this);
}

ClipView.prototype.onOpen = function () {
  View.prototype.onOpen.call(this);
  this.dispatchEvent(ViewEvent.OPEN);
}

ClipView.prototype.onClose = function () {
  this.dispatchEvent(ViewEvent.CLOSE);
}

ClipView.prototype.onResize = function (event) {
  
}

ClipView.prototype.onRender = function (event) {
  if( this.leg ){
    // this.leg.rotation.z += 0.02;
  }
}

module.exports = ClipView;