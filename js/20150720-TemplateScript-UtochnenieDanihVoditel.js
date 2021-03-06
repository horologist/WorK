 
//TemplateScript for Utochnenie dannih voditelya
//
//Version: 1.00
//Last Date: 20.07.2015

$addHandler(window, 'load', function(){
	var inputs = [],
		specialPole = [],
		controledPole = null,
		button = null, //Нижняя кнопка сохранить
		buttonSaveUp = null, //Верхняя кнопка сохранить.
		elClass = null,
		father = null,
		filds = {
			'id':{

			},
			'tagClass':{
				'selectBar': 'OrderStatus',
				'PTSs': 'PTSFilds'
			}
		};

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

	function checkInfoPole(){
	        var status = getElementsByClass(filds.tagClass.selectBar, document)[0],
		    statusCurent = status.parentNode.children[1].getElementsByTagName('input')[1].value,
		    saveKey = false;
		
		if (statusCurent){
			switch (statusCurent) {
			  case 'Получены':
			  	showPTS(true);
			  break;
			  case 'Завершена работа по заявке':
			    saveKey = checkDiagMap();
			  break;
			  default:
			    saveKey = true;
			  break;
			}
		};
		
		if (saveKey){
		  button.click();
		  return true;
		} else {
		  controledPole.style.color = 'red';
		  showMyAllert(controledPole);
		  return false;
		};

		return false;

		function checkPTS(){
		  var temp = getElementsByClass('ScanPTS', document)[0];
		  if(temp){
		    controledPole = temp;
		    var current = temp.parentNode.children[1].getElementsByTagName('input');
		    if (current[0].value){
			return true;
		    } else {
			return false;
		    };
		  };
		  return false;
		};

		function checkDiagMap(){
		  var temp = getElementsByClass('DiagControl', document)[0];
		  if(temp){
		    controledPole = temp;
		    var current = temp.parentNode.children[1].getElementsByTagName('input');
			console.log(current[0].value);
		    if (current[0].value){
			return true;
		    } else {
			return false;
		    };
		  };
		  return false;
		};

		//Отображает поля с заданным классом filds.tagClass.PTSs
		function showPTS(option){
			console.log('my day');
			var filds = getElementsByClass(filds.tagClass.PTSs, document),
				option = option ? '' : 'none';
			if (filds.length > 0){
				for (var i = 0, l = filds.length; i < l; i++){
					filds[i].style.display = option;
				};
			};
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
			el = document.createElement('div'),
			elAl = document.createElement('div'),
			elClose = document.createElement('a');

		elClose.setAttribute('style', 'width:15px;height:15px;position:absolute;top:15px;right:15px;color:red;border: 1px solid black;text-align:center;border-radius:15px');
		elClose.setAttribute('href', '#');
		elClose.innerHTML = 'x';
		elAl.setAttribute('style', 'width:400px;height:100px;position:absolute;bottom:300px;left:50%;margin-left:-200px;color:red;background-color:#fff;border-radius:5px');
		elAl.innerHTML = '<span style="height:100px;text-align:center;display:block;line-height:100px;font-size:15px;">Заполните поля выделенные красным цветом</span>';
		el.setAttribute('style', 'position:absolute;top:0;left:0;right:0;bottom:0;background-color:black;opacity:0.5');
		elAl.appendChild(elClose);

		container.appendChild(el);
		container.appendChild(elAl);

		$addHandler(elClose, 'click', function(event){

			event = event || window.event;

			  if (event.preventDefault) { // если метод существует
			    event.preventDefault(); // то вызвать его
			  } else { // иначе вариант IE8-:
			    event.returnValue = false;
			  }

			el.parentNode.removeChild(el);
			elAl.parentNode.removeChild(elAl);
		});

	};

	  //Ищем верхнюю кнопку сохранить
	  //Select all input
	  buttonSaveUp = document.getElementById('Ribbon.ListForm.Edit.Commit.Publish-Large');

	  //Copy parametrs from needed, hide it, and make own
	  if (buttonSaveUp){

	    var el = document.createElement('a'),
	        elContainer = buttonSaveUp.parentNode;

	    el.className = buttonSaveUp.className;
	    el.setAttribute('href',buttonSaveUp.getAttribute('href'));
	    el.setAttribute('role', 'button');
	    el.setAttribute('unselectable', 'on');
	    el.innerHTML = buttonSaveUp.innerHTML;

	    //Show My button
	    elContainer.insertBefore(el, buttonSaveUp);

	    //Hide main button
	    buttonSaveUp.style.display = 'none';

	    //Функция запускаемая при нажатии на верхнюю кнопку сохранить
	    //Add control handler
	    $addHandler(el, 'click', checkInfoPole);

	  }


	//Ищем нижнюю кнопку сохранить
	//Copy paametrs from needed input
	inputs = document.getElementsByTagName('input');
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

		//Функция запускаемая при нажатии на нижнюю кнопку сохранить
		$addHandler(el, 'click', checkInfoPole);
	};

	//Навешиваем обработчик события на именение статуса
	var status = getElementsByClass(filds.tagClass.selectBar, document)[0],
		statusBar = status.parentNode.children[1].getElementsByTagName('input')[1];

	if (statusBar){
		console.log(statusBar);
		$addHandler(statusBar, 'change', checkInfoPole);		
	}

});