//Check close date over open date
//
//Version: 2.01
//Last Date: 23.06.2015

$addHandler(window, 'load', function(){

  var inputs = [],
    specialPole = [],
    controledPole = null,
    button = null,
    buttonSaveUp = null,
    elClass = null,
    father = null,
    closeDate = null;

//Add a special crossbrovser function for chose elements by class name
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
    elAl.innerHTML = '<span style="height:100px;text-align:center;display:block;line-height:100px;font-size:15px;">Дата закрытия раньше даты открытия</span>';
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


var openDate = getElementsByClass('date-work-open', document),
    closeDateInput = getElementsByClass('date-work-close', document);

if(openDate[0].innerHTML){
  openDate = new Date(openDate[0].innerHTML.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
};

function checkInfoPole(){

    var status = getElementsByClass('OrderStatus', document)[0],
        statusCurent = status.parentNode.children[1].getElementsByTagName('input')[1].value,
        saveKey = false;
    
    if (statusCurent){
      switch (statusCurent) {
        case 'Отказ клиента':
          saveKey = true;
        break
        default:
          saveKey = checkDate();
        break
      }
    };
    
    if (saveKey){
      button.click();
      return true;
    } else {
      controledPole.style.color = 'red';
       showMyAllert(closeDateInput[0]);
      return false;
    };

    return false;

    function checkDate (){
      var target = closeDateInput[0].firstChild;

      if(target.value){
        if (new Date(+target.value) == 'Invalid Date'){
          closeDate = new Date(1);  
        } else {
          closeDate = new Date(+target.value);  
        }
      }

      if(closeDate <= openDate){

        return false;

      }else if(closeDate > openDate){

        return true;

      }

    };
 
  };

//Select all input
  inputs = document.getElementsByTagName('input');
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

    //Add control handler
    $addHandler(el, 'click', checkDate);

  }

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

    $addHandler(el, 'click', checkDate);
  };

});