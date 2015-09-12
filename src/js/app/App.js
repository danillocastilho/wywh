var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var AppController           = require('./controllers/AppController');

function App () {
  this.init()
}

App.prototype = {

  html: document.getElementById('app'),
  scene: null,
  camera: null,
  renderer: null,
  stage: null,

  init : function () {
    this.setupWebGL();
    this.setupView();
  },

  setupWebGL: function () {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    this.camera.position.z = 1750;

    this.stage = new THREE.Group();
    this.scene.add( this.stage );

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.html.appendChild( this.renderer.domElement );

    window.addEventListener('resize', this.onResize.bind(this), false)

    var self = this;

    function render () {
      requestAnimationFrame(render);
      self.renderer.render( self.scene, self.camera );
    }

    render()
    this.onResize();
  },

  setupView: function () {
    var controller = new AppController;
    controller.init();
    this.stage.add( controller.root );
  },

  onResize: function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

}

module.exports = App;