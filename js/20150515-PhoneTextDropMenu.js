 // Plugin make drop down menu wich specified in object "glovar" below
 // Version 1.02
 // Date: 15.05.2015
 // Require: jquery, jquery.inputmask

 jQuery(document).ready(function() {
 	var carDeal = (function(){
 		var glovar = {
 			"handlers": [
 				{
 					"selector": ".ddPhone input",
 					"hname": "phoneList",
 					"active": true,
 					"param": {
 						"gutter": "4", //Gutter between pole and drop down menu "0" - default
 						"lineSeparator": "; ", //Separator between output result line
 						"fildSeparator": " \\ ", //Separator between output fild
 						"lines": [{
	 							"head": "Телфон",
	 							"tag": "<input>",
	 							"mask": { //Mask for fild
	 								"mask": "99-aaa",
	 								"clearIncomplete": true
	 							},
	 							"style": "background-color:white"
	 						},{
	 							"head": "Добавочный",
	 							"tag": "<input>",
	 							"mask": "99-99999",
	 							"style": "background-color:white"
	 						},{
	 							"head": "Должность",
	 							"tag": "<input>",
	 							"mask": null,
	 							"style": "background-color:white"
	 						}
 						]
 					}
 				},
				{
 					"selector": ".ddText textarea",
 					"hname": "",
 					"active": false,
 					"param": null
 				}
 			],
 			"cape" : {
 				"tagSelect": ".s4-ba",
 				"template": '<div style="position:absolute;top:0;left:0;right:0;bottom:0;background-color:black;opacity:0.5;display:none;"></div>',
 				"tag": null
 			},
			"container": '<div class="ddModal" style="position:absolute;padding:25px 20px 35px 10px;background-color:white;min-width:100px;display:none">\
					<span class="closeDDModal" style="position:absolute;top:0;right:5px;font-size:1.5rem;cursor:pointer">&otimes;</span>\
					<a href="#" class="sendDDModal"\
					style="position:absolute;left:10px;bottom:10px;font-size:0.7rem;color:black;text-decoration:none;\
					user-select:none;background:#DCDCDC;padding:3px 5px;border:1px solid black;"\
					onmouseover="this.style.backgroundColor=\'#B5B5B5\';"\
					onmouseout="this.style.backgroundColor=\'#DCDCDC\';"\
					>СОХРАНИТЬ</a><table><tbody></tbody></table></div>',
			"conTableHead": null

 		};
 		
 		function closeDDMenu(data){
 			data.data.slideUp(400, function(){
 				this.remove();
 				glovar.cape.tag.hide("fast");
 			});
 		};

 		function openDDMenu(data){
			//Show cape tag
 			glovar.cape.tag.show("fast");

			//Add modal window in DOM
 			glovar.cape.tag.after(data);
 			data.slideDown();
 		};

 		function getDataFromEl(data){
 			console.log(data);
 			var line = $(data.currentTarget).val(),
 				lines = line.split(data.data.lineSeparator),
 				resultData = [];

 			console.log(lines);

 			if (lines[0] != line) {
 				for (var i = 0, l = lines.length; i < l; i++){
 					resultData[i] = lines[i].split(data.data.fildSeparator);
 				}
 			} else {
 				resultData = line.split(data.data.fildSeparator);
 			};

 			return resultData;
 		};

 		function saveDataToEl(data){

 			var modal = $(data.currentTarget.closest(".ddModal")),
 				table = modal.find("tbody"),
 				result = "",
 				key = false;


// ЗАПРЕТИТЬ СОХРАНЯТЬ ПУСТЫЕ ПОЛЯ, ПРОВЕРКУ НА ПУСТУЮ СТРОКУ ЗДЕСЬ. ДОБАВИТЬ УСЛОВИЯ ПО ДОБАВЛЕНИЮ СТРОКИ В МОДАЛЬНОЕ ОКНО. В INPUTMASK.


 			//Get data from all fild
 			var lengthj = table.find("tr").length - 1;
 			table.find("tr").each(function(j){
 				var length = $(this).find("input").length - 1;
 				$(this).find("input").each(function(i){
 					if (i < length) {
 						result += $(this).val() + data.data.data.fildSeparator;
 					} else {
						result += $(this).val();
 					};

 				});
 			if (j < lengthj) {
				result += data.data.data.lineSeparator;				
 			};

 			});

 			//Save data in current fild and close
 			$(data.data.currentTarget).val(result);
 			closeDDMenu({"data":modal});
 		};

 		function tableLine(arr){
 			// Creare and add head in teble. Create retun object
			var lineLength = arr.length,
				line = $("<tr>"),
				head = $("<thead>").append("<tr>"),
				inpMaskArr = [];

		 	if (lineLength){
				for (var i = 0; i < lineLength ; i++){
 					var el = $("<td>"),
 						current = $(arr[i].tag);
 						//Copy all mask in mask arr;
 						inpMaskArr[i] = arr[i].mask || null;

 					head.find("tr").append("<th>" + arr[i].head + "</th>");
					line.append(el.append(current));
				};
				// Add special pole in line
				head.append("<th></th>");
				line.append('<td><span class="remDDModalLine" style="font-size:1.5rem;cursor:pointer">&times;</span></td>');
			} else {
				return false;
			};

			//Add line special hendlers
			line.find(".remDDModalLine").click(function(){$(this).parent().parent().remove()});

			// Make head line in Table
			glovar.conTableHead = head;

			return {
				//Return a copy 
				newLine: function(linearr){
					var retLine = line.clone(true),
						linearr = $.isArray(linearr) ? linearr : [];

					retLine.find("input").each(function(index){
						$(this).inputmask(inpMaskArr[index]);
						$(this).val(linearr[index]);
					});
					return retLine;
				}
			}
 		};

 		var handler = {
 			"phoneList": function(event){
 				var target = $(event.target),
 					position = target.position(),
 					height = target.outerHeight(),
 					gutter = event.data.gutter || 0,
 					container = $(glovar.container),//Set container tag
 					line = tableLine(event.data.lines),//Set template for current pole
 					lineData = getDataFromEl(event);//Get data from curent pole

	 			//Add head line position
	 			container.find("table").prepend(glovar.conTableHead);

	 			//Correct modal window position
	 			position.top = position.top + height + (+gutter);
	 			container.offset(position);

	 			//Add hendlers to close and save date
	 			container.find(".closeDDModal").click(container,closeDDMenu);
	 			container.find(".sendDDModal").click(event, saveDataToEl);

	 			//Add lines with data
	 			if ($.isArray(lineData[0])) {
	 				for (var i = 0, l = lineData.length; i < l; i++){
	 					container.find("tbody").append(line.newLine(lineData[i]));
	 				};
					container.find("tbody").append(line.newLine());
	 			} else if (lineData.length > 1){
	 				container.find("tbody").append(line.newLine(lineData));
	 				container.find("tbody").append(line.newLine());
	 			} else {
	 				container.find("tbody").append(line.newLine());
	 			};

				openDDMenu(container);
 				}
 		};

 		return {
	 		init: function(){
		 		for (var i = 0, l = glovar.handlers.length; i < l; i++) {
		 			//Add hendler in all elements in the DOM
		 			if(glovar.handlers[i].active) {
		 				$(glovar.handlers[i].selector).each( function(){
			 				$(this).bind("click", glovar.handlers[i].param, handler[glovar.handlers[i].hname]);

			 				// Append cape in DOM & save it in glovar
			 				if (!glovar.cape.tag) {
			 					var parent = $(this).closest(glovar.cape.tagSelect);
			 					try {
			 						glovar.cape.tag = $(glovar.cape.template);
			 						parent.append(glovar.cape.tag);
			 					} catch(e){console.log(e);}
			 				};
		 				});
	 				}
		 		}
		 	}
	 	}
 	})();

 	carDeal.init();
 });