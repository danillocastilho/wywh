function State () {
  
}

State.prototype = {
		controllers: {},
		container: null,
		curStateAddress: '',
		navStateAddress: '',
		history: [],
		route: [],
		onTransition: false,

		init: function ( container ) {
			this.container = container;
		},

		add: function ( controllers, address ) {
			for ( var i = 0; i < controllers.length; i++ ){
				var vo = controllers[i];
				vo.state = this;
				var controllerAddress = address+"/"+vo.address;

				if( this.controllers[controllerAddress] ){

				}

				this.controllers[controllerAddress] = vo;

				vo.uid = controllerAddress;
				vo.controller.vo = vo;
				vo.controller.name = vo.address;
				vo.controller.className = vo.className;
				vo.controller.init();
				this.container.add( vo.controller.root );

				if( vo.controllers.length > 0 ){ this.add(vo.controllers, controllerAddress); }
			}
		},

		navigateTo: function ( address ) {
			if( this.controllers[address] ){
				if( address != this.curStateAddress ){
					if(!this.onTransition){
						this.onTransition = true;
						this.navStateAddress = address;
						this.route = this.getAddressRoute();
						this.executeAddressRoute();
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		getAddressRoute: function () {
			var address = this.navStateAddress.split("/");
			var route = [];
			var vo;
			var i = 0;

			var controllerAddress = "";

			var curAddress = this.curStateAddress.split("/");
			for ( i = 1; i < curAddress.length; i++ ) {

				if( curAddress[i] != String(address[i]) ){
					vo = {};
					vo.address = controllerAddress += "/" + curAddress[i];
					vo.type = 'CLOSE';
					route.unshift(vo);
				} else {
					controllerAddress += "/"+address[i];
				}
			}

			controllerAddress = "";

			for ( i = 1; i < address.length; i++ ) {
				if( curAddress[i] != String(address[i]) ){
					vo = {};
					vo.address = controllerAddress += "/" + address[i];
					vo.type = 'OPEN';
					route[route.length] = vo;
				} else {
					controllerAddress += "/"+address[i];
				}
			}

			return route;
		},

		executeAddressRoute: function () {
			if(this.route.length > 0){
				var vo = this.route[0];
				var controllerVo = this.controllers[vo.address];
				var controller = controllerVo.controller;

				if(vo.type == 'OPEN'){
					// controller.init();
					controller.addEventListener('CONTROLLER.OPEN', this.controller_OPEN.bind(controllerVo));
					controller.show();
					// console.log('controller',controller.name);
					if(window.backgroundView){
						window.backgroundView.navigateTo(controller.name);
					}
				} else if ( vo.type == 'CLOSE' ) {
					controller.addEventListener('CONTROLLER.CLOSE', this.controller_CLOSE.bind(controllerVo));
					controller.hide();
				}
			}
		},

		controller_OPEN: function () {
			this.controller.removeEventListener('CONTROLLER.OPEN', this.controller_OPEN);
			this.state.route.shift();
			this.state.transitionComplete();
		},

		controller_CLOSE: function () {
			this.controller.removeEventListener('CONTROLLER.CLOSE', this.controller_CLOSE);
			this.controller.dispose()
			this.state.route.shift();
			this.state.transitionComplete();
		},

		transitionComplete: function () {
			if( this.route.length > 0 ){
				this.executeAddressRoute();
			} else {
				this.onTransition = false;
				this.curStateAddress = this.navStateAddress;
			}
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

module.exports = State