var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');

function Particle () {
  this.root = new THREE.Group();
}

Particle.prototype = Object.create(Object.prototype);
Particle.constructor = Particle;

Particle.prototype.init = function () {
  console.log('[Particle] init');
}

Particle.prototype.open = function () {
 console.log('[Particle] open'); 
}

Particle.prototype.close = function () {
  console.log('[Particle] close');
}

Particle.prototype.dispose = function () {
  console.log('[Particle] dispose');
}

module.exports = Particle;