//Check Money

var money = getElementsByClass('CheckMoney', document);

if(money.length > 0){
  for (var i = 0, l = money.length; i < l; i++){
    var curInput = money[i].parentNode.children[1].getElementsByTagName('input')[0];
    if (curInput){
      $addHandler(curInput, 'keypress', function(event){
        event= event || window.event;
        if (event.charCode && ( event.charCode < 48 || event.charCode > 57 )){
          if (!(event.charCode == 44) && !(event.charCode == 46)){
            event.preventDefault ? event.preventDefault() : (event.returnValue=false);              
          }
        };
      });
    }
  };
}