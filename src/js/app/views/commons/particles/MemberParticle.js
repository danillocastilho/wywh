var $                       = require('jquery');
var gsap                    = require('gsap');
var THREE                   = require('three');
var View                    = require('../../abstract/View');
var ViewEvent               = require('../../../events/ViewEvent');

function MemberParticle (data) {
  this.data = (data) ? data : {};
  View.call(this);
}

MemberParticle.prototype = Object.create(View.prototype);
MemberParticle.constructor = MemberParticle;

MemberParticle.prototype.init = function () {
  View.prototype.init.call(this);

  this.particlesData = [];
  this.maxParticleCount = 1000;
  this.particleCount = (this.data.particleCount) ? this.data.particleCount : 30;
  this.width = (this.data.width) ? this.data.width : 100;
  this.height = (this.data.height) ? this.data.height : 100;
  this.depth = (this.data.depth) ? this.data.depth : 100;

  this.positions;
  this.colors;

  this.effectController = {
    showDots: true,
    showLines: true,
    minDistance: (this.data.minDistance) ? this.data.minDistance : 50,
    limitConnections: false,
    maxConnections: (this.data.maxConnections) ? this.data.maxConnections : 150
  }

  if(this.data.helper){
    this.helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( this.width, this.height, this.depth ) ) );
    //0x080808
    this.helper.material.color.setHex( 0x080808 );
    this.helper.material.blending = THREE.AdditiveBlending;
    this.helper.material.transparent = true;
    this.root.add( this.helper );
  }

  this.segments = this.maxParticleCount * this.maxParticleCount;

  this.positions = new Float32Array( this.segments * 3 );
  this.colors = new Float32Array( this.segments * 3 );

  this.pMaterial = new THREE.PointCloudMaterial( {
    color: 0xFFFFFF,
    size: 2,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false
  } );

  this.particles = new THREE.BufferGeometry();
  this.particlePositions = new Float32Array( this.maxParticleCount * 3 );

  for ( var i = 0; i < this.maxParticleCount; i++ ) {

    var x = Math.random() * this.width - this.width / 2;
    var y = Math.random() * this.height - this.height / 2;
    var z = Math.random() * this.depth - this.depth / 2;

    this.particlePositions[ i * 3     ] = x;
    this.particlePositions[ i * 3 + 1 ] = y;
    this.particlePositions[ i * 3 + 2 ] = z;

    this.particlesData.push( {
      velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
      numConnections: 0
    } );

  }

  this.particles.drawcalls.push( {
    start: 0,
    count: this.particleCount,
    index: 0
  } );

  this.particles.addAttribute( 'position', new THREE.DynamicBufferAttribute( this.particlePositions, 3 ) );

  // create the particle system
  this.pointCloud = new THREE.PointCloud( this.particles, this.pMaterial );
  this.root.add( this.pointCloud );

  this.geometry = new THREE.BufferGeometry();

  this.geometry.addAttribute( 'position', new THREE.DynamicBufferAttribute( this.positions, 3 ) );
  this.geometry.addAttribute( 'color', new THREE.DynamicBufferAttribute( this.colors, 3 ) );

  
  this.geometry.computeBoundingSphere();

  this.geometry.drawcalls.push( {
    start: 0,
    count: 0,
    index: 0
  } );

  this.material = new THREE.LineBasicMaterial( {
    vertexColors: THREE.VertexColors,
    blending: THREE.AdditiveBlending,
    transparent: true
  } );

  this.linesMesh = new THREE.Line( this.geometry, this.material, THREE.LinePieces );
  this.root.add( this.linesMesh );
}

MemberParticle.prototype.open = function () {
  View.prototype.open.call(this);
  this.onResize();
  this.onOpen();
}

MemberParticle.prototype.close = function () {
  View.prototype.close.call(this);
  this.onClose();
}

MemberParticle.prototype.dispose = function () {
  View.prototype.dispose.call(this);
}

MemberParticle.prototype.onOpen = function () {
  View.prototype.onOpen.call(this);
  this.dispatchEvent(ViewEvent.OPEN);
}

MemberParticle.prototype.onClose = function () {
  this.dispatchEvent(ViewEvent.CLOSE);
}

MemberParticle.prototype.onResize = function (event) {
  
}

MemberParticle.prototype.onRender = function (event) {
  // if(this.count < 1){
    
  var vertexpos = 0;
  var colorpos = 0;
  var numConnected = 0;

  for ( var i = 0; i < this.particleCount; i++ ){
    this.particlesData[ i ].numConnections = 0;

    for ( var i = 0; i < this.particleCount; i++ ) {
      var particleData = this.particlesData[i];

      this.particlePositions[ i * 3     ] += particleData.velocity.x;
      this.particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
      this.particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

      if ( this.particlePositions[ i * 3 + 1 ] < -(this.height / 2) || this.particlePositions[ i * 3 + 1 ] > (this.height / 2) )
        particleData.velocity.y = -particleData.velocity.y;

      if ( this.particlePositions[ i * 3 ] < -(this.width / 2) || this.particlePositions[ i * 3 ] > (this.width / 2) )
        particleData.velocity.x = -particleData.velocity.x;

      if ( this.particlePositions[ i * 3 + 2 ] < -(this.depth / 2) || this.particlePositions[ i * 3 + 2 ] > (this.depth / 2) )
        particleData.velocity.z = -particleData.velocity.z;

      if ( this.effectController.limitConnections && particleData.numConnections >= this.effectController.maxConnections )
        continue;

      for ( var j = i + 1; j < this.particleCount; j++ ) {
        
        var particleDataB = this.particlesData[ j ];
        if ( this.effectController.limitConnections && particleDataB.numConnections >= this.effectController.maxConnections )
          continue;

        var dx = this.particlePositions[ i * 3     ] - this.particlePositions[ j * 3     ];
        var dy = this.particlePositions[ i * 3 + 1 ] - this.particlePositions[ j * 3 + 1 ];
        var dz = this.particlePositions[ i * 3 + 2 ] - this.particlePositions[ j * 3 + 2 ];
        var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

        if ( dist < this.effectController.minDistance ) {
          
          particleData.numConnections++;
          particleDataB.numConnections++;

          var alpha = 1.0 - dist / this.effectController.minDistance;
          
          this.positions[ vertexpos++ ] = this.particlePositions[ i * 3     ];
          this.positions[ vertexpos++ ] = this.particlePositions[ i * 3 + 1 ];
          this.positions[ vertexpos++ ] = this.particlePositions[ i * 3 + 2 ];

          this.positions[ vertexpos++ ] = this.particlePositions[ j * 3     ];
          this.positions[ vertexpos++ ] = this.particlePositions[ j * 3 + 1 ];
          this.positions[ vertexpos++ ] = this.particlePositions[ j * 3 + 2 ];

          this.colors[ colorpos++ ] = alpha;
          this.colors[ colorpos++ ] = alpha;
          this.colors[ colorpos++ ] = alpha;

          this.colors[ colorpos++ ] = alpha;
          this.colors[ colorpos++ ] = alpha;
          this.colors[ colorpos++ ] = alpha;

          numConnected++;
        }
        
      }
    }
  }

  this.linesMesh.geometry.drawcalls[ 0 ].count = numConnected * 2;
  this.linesMesh.geometry.attributes.position.needsUpdate = true;
  this.linesMesh.geometry.attributes.color.needsUpdate = true;

  this.pointCloud.geometry.attributes.position.needsUpdate = true;

  // this.root.rotation.x += 0.001;
  // this.root.rotation.y += 0.002;
}

module.exports = MemberParticle;