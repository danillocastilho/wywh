var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');

function View () {
  // this.init()
}

/*
  Properties
*/
Object.defineProperties(View.prototype, {

})

View.prototype.init = function () {
  this.listeners = Object();
  this.root = new THREE.Group();
}

View.prototype.open = function () {

  if (this.onResize){
    this._onResize = this.onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
  }
  if (this.onRender){
    this._onRender = this.onRender.bind(this);
    var self = this;

    function render () {
      requestAnimationFrame(render);
      self._onRender();
    }

    render();
  }

}

View.prototype.close = function () {
  
}

View.prototype.dispose = function () {
  
}

View.prototype.onOpen = function () {
  
}

View.prototype.onClose = function () {

}

View.prototype.onResize = function (event) {
  
}

View.prototype.addEventListener = function(evt, callback) {
  if (!this.hasOwnProperty(evt)){ this[evt] = Array() }
  this[evt].push(callback);
  return this;
}

View.prototype.removeEventListener = function(evt, callback) {
  this[evt] = [];
}

View.prototype.dispatchEvent = function(evt, params) {
  if (evt in this) {
      callbacks = this[evt];
      for (var x in callbacks){ callbacks[x](params)}
  }
  return this;
}

module.exports = View