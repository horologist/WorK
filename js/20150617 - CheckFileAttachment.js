//Check file attachment in special fild
//
//Version: 1.00
//Last Date: 18.06.2015

$addHandler(window, 'load', function(){
	var inputs = [],
		specialPole = [],
		controledPole = null,
		button = null,
		elClass = null,
		father = null;

	function checkAttachment(){

		specialPole = document.getElementsByTagName('tr');

		for( var n = 0, ln = specialPole.length; n < ln; n++){
			var temp = specialPole[n].children[0];
			if(temp && (temp.innerHTML.replace(/(^\s+|\s+$)/g,'') == 'Диагностическая карта:')){
				controledPole = temp;
				var current = specialPole[n].children[1].getElementsByTagName('input');
				if (current[0].value){
					console.log('ok');
					button.click();
					return true;
				} else {
					controledPole.style.color = 'red';
					showMyAllert(controledPole);
					console.log('bad');
					return false;
				};
			}
		};
	};

	function findUpContainer(el, id){
		if(el.getAttribute('id') != id ){
			return findUpContainer(el.parentNode, id);
		} else {
			return el;
		};	
	};

	function showMyAllert(el){
		var container = findUpContainer(el,'MSO_ContentTable'),
			el = document.createElement('div');

			el.setAttribute('style', 'position:absolute;top:0;left:0;right:0;bottom:0;background-color:black;opacity:0.5;');

			container.appendChild(el);

	};

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