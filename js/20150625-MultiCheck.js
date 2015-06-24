//Check multi parameters
//
//Version: 1.00
//Last Date: 24.06.2015

$addHandler(window, 'load', function(){
	var inputs = [],
		specialPole = [],
		controledPole = null,
		button = null,
		elClass = null,
		father = null,
		allert = new AllertBlock({message: "Моё сообщение"});

	//!!!!!!!! Create my own getElemets by class name function/
	if(document.getElementsByClassName) {
	    getElementsByClass = function(classList, node) {   
	        return (node || document).getElementsByClassName(classList)
	    }
	} else {
	    getElementsByClass = function(classList, node) {           
	        var node = node || document,
	        list = node.getElementsByTagName('*'),
	        length = list.length, 
	        classArray = classList.split(/\s+/),
	        classes = classArray.length,
	        result = [], i,j
	        for(i = 0; i < length; i++) {
	            for(j = 0; j < classes; j++)  {
	                if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) {
	                    result.push(list[i])
	                    break
	                }
	            }
	        }
	        return result
	    }
	};

	//!!!!!!!! Function for create block of elements by Иван Курманов
	function blockCreate( name, attributes ) {
		var el = document.createElement( name );
		if ( typeof attributes == 'object' ) {
			for ( var i in attributes ) {
				el.setAttribute( i, attributes[i] );

				if ( i.toLowerCase() == 'class' ) {
					el.className = attributes[i]; // for IE compatibility
				} else if ( i.toLowerCase() == 'style' ) {
					el.style.cssText = attributes[i]; // for IE compatibility
				}
			}
		}
		for ( var i = 2;i < arguments.length; i++ ) {
			var val = arguments[i];
			if ( typeof val == 'string' ) { val = document.createTextNode( val ) };
			el.appendChild( val );
		}
		return el;
	};

	//!!!!!!!! 
	function findUpContainer(el, id){
		if(el.getAttribute('id') != id ){
			return findUpContainer(el.parentNode, id);
		} else {
			return el;
		};	
	};

	//!!!!!!!! 
	function extendObj(obj1, obj2){
		if ((typeof(obj1) != 'object') && (typeof(obj2) != 'object')) return obj1;
		for (prop in obj2){
			if (obj2.hasOwnProperty(prop)){
				obj1[prop] = obj2[prop];
			}
		}
		return obj1;
	};

	function AllertBlock(config){
		var arg = {
			'container': document.getElementsByTagName('body')[0],
			'message': 'Заполните поля выделенные красным цветом'
		};

		extendObj(arg, config);

		this.setContainer = function(el){
			arg.container = el || arg.container;
		};

		this.getContainer = function(){
			return arg.container;
		};

		this.template = function(message){
			var message = message || this.getMessage();
			return blockCreate('div', {'style': 'width:400px;height:100px;position:absolute;bottom:300px;left:50%;margin-left:-200px;color:red;background-color:#fff;border-radius:5px'},
				blockCreate('span', {'style': 'height:100px;text-align:center;display:block;line-height:100px;font-size:15px;'}, message),
				blockCreate('a', {'style': 'width:15px;height:15px;position:absolute;top:15px;right:15px;color:red;border: 1px solid black;text-align:center;border-radius:15px', 'href':'#'}, 'x')
			);
		};

		this.overlay = function(){
			return blockCreate('div', {'style':'position:absolute;top:0;left:0;right:0;bottom:0;background-color:black;opacity:0.5'}, '');
		};

		this.getMessage = function(){
			return arg.message;
		};

		this.show = function(message){
			var that = this,
				message = message || this.getMessage(),
				container = this.getContainer(),
				overlay = this.overlay(),
				allert = this.template(message),
				close = allert.getElementsByTagName('a');

			$addHandler(close[0], 'click', function(event){

				event = event || window.event;
				if (event.preventDefault) { // если метод существует
			    	event.preventDefault(); // то вызвать его
				} else { // иначе вариант IE8-:
					event.returnValue = false;
				};

				that.hide(overlay, allert);
			});

			container.appendChild(overlay);
			container.appendChild(allert);
		};

		this.hide = function(){
			for (var i = 0, l = arguments.length; i < l; i++){
				arguments[i].parentNode.removeChild(arguments[i]);
			}
		};

		return this;
	};

	//Control function for check exception
	function checkAttachment(){

		specialPole = getElementsByClass('DiagControl', document);
		var temp = specialPole[0];
		if(temp){
			controledPole = temp;
			var current = temp.parentNode.children[1].getElementsByTagName('input');
			if (current[0].value){
				button.click();
				return true;
			} else {
				controledPole.style.color = 'red';
				allert.show();
				return false;
			};
		}
	};

	function subButton(config){
		var arg = {
			'id': null, //Main Param - work salfish
			'tag': null, // Second main param, but if set other param return current of that value
			'className': null, // Last main param - work with lowest additional params
			'index': null, //Additional param - can`t use lonely
			'value': null //Additional param - can`t use lonely
		},
		mainButton = null,
		myButton = null;

		extendObj(arg, config);

		this.getButton = function(){
			if(arg.id){
				return document.getElementById(arg.id);
			} else if(arg.tag){
				var temp = document.getElementsByTagName(arg.tag);

				if(temp.length > 0 && arg.className){
					for(var i = 0, l = temp.length; i < l; i++){
						if(temp[i].className != arg.className){
							temp[i].splice(i, 1); 
						};
					};
					if(arg.index){
						return temp[arg.index];
					} else if (arg.value){
						for(var i = 0, l = temp.length; i < l; i++){
							if(temp[i].value == arg.value){
								return temp[i]; 
							}
						};
					} else {
						return temp[0];
					};
				} else if(temp.length > 0 && arg.index){
					return temp[arg.index];
				} else if(temp.length > 0 && arg.value){
					for(var i = 0, l = temp.length; i < l; i++){
						if(temp[i].value == arg.value){
							return temp[i]; 
						}
					};
					return false;
				} else if (temp.length > 0){
					return temp[0];
				} else {
					return flase;
				};
			} else if (arg.className){
				var temp = etElementsByClass(arg.className);
				if(temp.length > 0 && arg.index){
					return temp[arg.index];
				} else if (temp.length > 0 && arg.value){
					for(var i = 0, l = temp.length; i < l; i++){
						if(temp[i].value == arg.value){
							return temp[i]; 
						}
					};
					return false;
				} else if (temp.length > 0){
					return temp[0];
				} else {
					return false;
				}
			} else {
				return false
			};

		};

		return this;
	}

	//  ||    Upper object for replast SubCode.
	//  ||
	//  ||
	// \  /
	//  \/

	//Select all input
	inputs = document.getElementsByTagName('input');

	//Copy paametrs from needed input
	for( var i = 0, l = inputs.length; i < l; i++){
		if(inputs[i].value == 'Сохранить'){
			button = inputs[i];
			elClass = inputs[i].getAttribute('class'),
			father = inputs[i].parentNode;
		};
	};

	//Add my button & special hendlers for it
	if (button){
		var el = document.createElement('input');
				
		el.className = elClass;
		el.value = button.value;
		el.setAttribute('type', 'button');

		father.insertBefore(el, button);

		button.style.display = 'none';

		$addHandler(el, 'click', checkAttachment);
	};


});