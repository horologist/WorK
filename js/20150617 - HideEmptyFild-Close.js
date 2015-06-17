//Fix wich hide an ampty fild in table and styled "Close" button
//
//Version: 1.01
//Last Date: 17.06.2015

$addHandler(window, 'load', function(){
	var
	  tables = [],
	  buttons = [];

	//Manual add class
	function addClass(o, c){
	    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
	    if (re.test(o.className)) return
	    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
	};

	//Manual function Select by Class
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
	        };
	    	return result;
    	}
	};

	//Select all row
	tables = getElementsByClass('simple-little-table');

	//Hide empty table row
	for( var i = 0, l = tables.length; i < l; i++ ){
	  var trArr = tables[i].getElementsByTagName('tr');

      if (trArr.length > 0){
      	for( var n = 0, ln = trArr.length; n < ln; n++){
      		var data = trArr[n].lastChild.innerHTML;
      		if((data == '&nbsp;') || (data == '') ){
      			trArr[n].style.display ='none';
      		}
      	}
      }
    };

	//Select all input
	buttons = document.getElementsByTagName('input');

	//Add a special class for input with value "Закрыть"
	for( var i = 0, l = buttons.length; i < l; i++){
		if(buttons[i].value == 'Закрыть'){
			addClass( buttons[i], 'closeActive' );
		};
	}
});