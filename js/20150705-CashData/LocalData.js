$(document).ready(function(){

	function LocalData (name, expires) {

		var name = name || 'LocalData',
			expires = expires || 30 * 60; //30 minutes

		this.get = function(){
			var value = false;

			if (window.localStorage){ //window.localStorage

				value = this.getLocalStorage(name) || false;

				if (value){
					try {return JSON.parse(value);} catch(e){console.log(value)};
				} else {
					return false;
				}
			} else {
				value = this.getCookie(name);

				if (value){
					try {return JSON.parse(value);} catch(e){console.log(value)};
				} else {
					return false;
				}

			}
		};

		this.save = function(value){
			var data = JSON.stringify(value);

			if (window.localStorage) { // /*window.localStorage*/
				this.setLocalStorage(name, data, expires);
				return this;
			} else {
				this.setCookie(name, data, {'expires': expires});
				return this;
			};

			return false;
		};
		
		this.getLocalStorage = function(name){
			var data = window.localStorage.getItem(name) ? decodeURIComponent(window.localStorage.getItem(name)) : undefined;
			
			if (data){
				try {data = JSON.parse(data)} catch(e){console.log(data); return false};

				var now = new Date;
				if (now < new Date(data.expires)){
					return data.value;
				}
			}

			return false;
		};

		this.setLocalStorage = function(name, value, expires){
			
			var expires = expires || 0;

			if (typeof expires == "number" && expires) {
		    	var d = new Date();
		    	d.setTime(d.getTime() + expires * 1000);
		    	expires = d;
		  	}
		  	if (expires && expires.toString) {
		    	expires = expires.toString();
		  	}

		  	var updatedLocalStorage = JSON.stringify({
		  		'value' : value,
		  		'expires' : expires
		  	});



		  	window.localStorage.setItem(name, updatedLocalStorage);

		};

		this.deleteLocalStotage = function(name){
			window.localStorage.removeItem(name);	
		};

		this.getCookie = function(name){
			var matches = document.cookie.match(
					new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)")
				);
			return matches ? decodeURIComponent(matches[1]) : undefined;
		};

		this.setCookie = function (name, value, options) {
			options = options || {};

			var expires = options.expires;

			if (typeof expires == "number" && expires) {
		    	var d = new Date();
		    	d.setTime(d.getTime() + expires * 1000);
		    	expires = options.expires = d;
		  	}
		  	if (expires && expires.toUTCString) {
		    	options.expires = expires.toUTCString();
		  	}

		  	value = encodeURIComponent(value);

		  	var updatedCookie = name + "=" + value;

		  	for (var propName in options) {
		    	updatedCookie += "; " + propName;
		    	var propValue = options[propName];
		    	if (propValue !== true) {
		      		updatedCookie += "=" + propValue;
		    	}
		  	}

		  	document.cookie = updatedCookie;
		};

		this.deleteCookie = function(name) {
  			setCookie(name, "", {expires: -1})
		};

	}; 

	var now = new Date;

	value = ['my array', 1 , 5, [],5,7,8,9,0];

	var myCash = new LocalData('myData', 10);
	// myCash.save(value);
	console.log(myCash.get());

	value = JSON.stringify(value);

	console.log(window.localStorage);
	console.log(document.cookie);

});