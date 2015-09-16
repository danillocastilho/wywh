var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var View                    = require('../../abstract/View');
var ViewEvent               = require('../../../events/ViewEvent');
var MemberParticle          = require('./MemberParticle');

function Foot () {
  View.call(this);
}

Foot.prototype = Object.create(View.prototype);
Foot.constructor = Foot;

Foot.prototype.init = function () {
  View.prototype.init.call(this);
}

Foot.prototype.open = function () {
  View.prototype.open.call(this);
  console.log('foot open');

  this.container = new THREE.Group();
  this.root.add(this.container);

  for ( var i = 0; i < 6; i++ ) {
    var index = i;

    var difW = ( index <= 1 ) ? (0 * 15) : (index * 15);
    var difY = (index * 7);
    var difX = ( index <= 1 ) ? -(0 * 8) : -(index * 8);

    this.member = new MemberParticle({
      width: 100 - difW,
      height: 10,
      depth: 50,
      particleCount: 8,
      helper: false,
    });
    this.member.init();
    this.member.open();
    this.member.root.position.y = difY;
    this.member.root.position.x = difX;

    this.container.add(this.member.root);
  }

  this.onResize();
  this.onOpen();
}

Foot.prototype.close = function () {
  View.prototype.close.call(this);
  this.onClose();
}

Foot.prototype.dispose = function () {
  View.prototype.dispose.call(this);
}

Foot.prototype.onOpen = function () {
  View.prototype.onOpen.call(this);
  this.dispatchEvent(ViewEvent.OPEN);
}

Foot.prototype.onClose = function () {
  this.dispatchEvent(ViewEvent.CLOSE);
}

Foot.prototype.onResize = function (event) {
  
}

Foot.prototype.onRender = function (event) {

}

module.exports = Foot;