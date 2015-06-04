if( typeof window.eventHandler !== 'function' ) {

   function eventHandler() {
      'use strict';
   
      var util = {
            addListener : null,
            removeListener : null,
            fireEvent  : null
          },
          doc = document;
 
      // Нормальные браузеры:
      if (typeof doc.addEventListener === "function") {
          util.addListener = function (type, elt, callback, capture) {        
              elt.addEventListener(type, callback, capture);
          };
          util.removeListener = function (type, elt, callback, capture) {        
              elt.removeEventListener(type, callback, capture);
          };
      // IE:
      } else if (typeof doc.attachEvent === "function") {
          util.addListener = function (type, elt, callback) {        
              elt.attachEvent("on" + type, callback);
          };
          util.removeListener = function (type, elt, callback) {        
              elt.detachEvent("on" + type, callback);
          };
      // Устаревшие браузеры:    
      } else {
          util.addListener = function (type, elt, callback) {        
              elt["on" + type] = callback;
          };
          util.removeListener = function (type, elt, callback) {        
              elt["on" + type] = null;
          };        
      }    
      // Искуственный вызов события:
      if(doc.createEvent) {
          // element : HtmlElement - элемент для которого требуется вызвать событие;
          // eventName: String - имя события без приставки "on" например "mousedown";
          // eventType: String - тип события например "MouseEvent"
          util.fireEvent = function (element, eventName, eventType) {
            var mUp = doc.createEvent(eventType);
            mUp.initEvent(eventName,  true, false);   
            element.dispatchEvent(mUp);
          }
      } else {
          util.fireEvent = function (element, eventName, eventType) {
            var mUp = doc.createEventObject(eventType);   
            element.fireEvent("on" + eventName, mUp);
          }
      }
      return util;
  }

}

var myEvent = eventHandler();

	var iFrame = document.getElementsByTagName('iframe');

	console.log(iFrame);
	iFrame[0].onload = function(){


		var openDate = document.querySelector('.date-work-open');
		openDate = new Date(openDate.innerHTML);
		var closeDateInput = document.querySelector('.date-work-close > input');
		var target = closeDateInput;
		myEvent.addListener('change',closeDateInput,function(){
			var closeDate = new Date( target.value );
			if(closeDate != 'Invalid Date'){
				if(closeDate < openDate){
					target.value = '';
					target.setAttribute( 'placeholder', 'Нельзя закрыть этой датой');
					setTimeout(function(){target.setAttribute( 'placeholder', ''); target.value = 'N';},1000);
				}
			}	
		});

	};