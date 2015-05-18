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
 						"mustFill": [0,1,2], //Number of mandatory Fild in lines array; "false" - for non strict mode; "true" - for strict mode
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
	 							"mask": {
	 								"mask": "99-99999"
	 							},
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
 		
 		function extend(obj1, obj2){
 			if (obj1){
				for (key in obj2){
 					obj1[key] = obj2[key];
 				}
 				return obj1; 				
 			} else {
 				return false;
 			}
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

// ДОБАВИТЬ УСЛОВИЯ ПО ДОБАВЛЕНИЮ СТРОКИ В МОДАЛЬНОЕ ОКНО. В INPUTMASK.
// ЕСТЬ ВЕРЯТНОСТЬ ДОБАВЛЕНИЯ ПУСТОЙ СТРОИ ПРИ УДАЛЕНИИ СТРОКИ ИЗ СЕРЕДИНЫ.
// Добавление лини сделать общедоступной функцией, для того что бы корректро реагировать на правильную маску.

 			//Get data from all fild
 			var lengthj = table.find("tr").length - 1;
 			table.find("tr").each(function(j){
 				var length = $(this).find("input").length - 1,
 					partOfData = "";
 				key = false;
 				$(this).find("input").each(function(i){
 					if (i < length) {
 						partOfData += $(this).val() + data.data.data.fildSeparator;
 					} else {
						partOfData += $(this).val();
 					};
 					if ($(this).val() != "") {
 						key = true;
 					};
 				});

 				//Check on empty fild and last element
	 			if (key){
	 				result += partOfData;
		 			if (j < lengthj) {
						result += data.data.data.lineSeparator;				
		 			};
	 			}
 			});

 			//Save data in current fild and close
 			$(data.data.currentTarget).val(result);
 			closeDDMenu({"data":modal});
 		};

 		function tableLine(obj){
 			// Creare and add head in teble. Create retun object
			var arr = obj.lines,
				lineLength = arr.length,
				line = $("<tr>"),
				head = $("<thead>").append("<tr>"),
				inpMaskArr = [],
				givenMask = obj.mustFill;
				compliteMask = [];

		 	if (lineLength){
				for (var i = 0; i < lineLength ; i++){
 					var el = $("<td>"),
 						current = $(arr[i].tag).data("index", i);
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
			//
			//Remove line or clear last input date
			line.find(".remDDModalLine").click(function(){
				var temp = $(this).closest("tbody").find("tr");
				if(temp.length == 1){
					temp.find("input").each(function(){
						$(this).val("");
					});
				} else {
					$(this).parent().parent().remove();
				}
			});

			// Make head line in Table
			glovar.conTableHead = head;

			return {
				//Return a copy 
				newLine: function(linearr){
					var retLine = line.clone(true),
						linearr = $.isArray(linearr) ? linearr : [];

					retLine.find("input").each(function(index){
						var copyindex = index;
						var obj = extend(inpMaskArr[index], { "oncomplete": function(el){ lineCheck($(el.currentTarget).data('index')); } });
						if (obj) {
							$(this).inputmask(obj);							
						} else {
							$(this).bind('focus', function(el){ lineCheck($(el.currentTarget).data('index')); });
						}

						$(this).val(linearr[index]);
					});

					function lineCheck(event){
						compliteMask[event] = true;
						var check = true;
						for (var i = 0, l = givenMask.length; i < l; i++){
							if(!compliteMask[givenMask[i]]){
								check = false;
							}
						}
						if(check){
							$(retLine).trigger("complite");
						}
					}
					return retLine;
				}
			}
 		};

 		function newLine(line, container, data){
 			return container.find("tbody").append(line.newLine()).one("complite", function(){newLine(arguments[0], arguments[1], arguments[2])});
 		}

 		var handler = {
 			"phoneList": function(event){

 				var target = $(event.target),
 					position = target.position(),
 					height = target.outerHeight(),
 					gutter = event.data.gutter || 0,
 					container = $(glovar.container),//Set container tag
 					line = tableLine(event.data),//Set template for current pole
 					lineData = getDataFromEl(event);//Get data from curent pole

	 			//Add head line position
	 			container.find("table").prepend(glovar.conTableHead);

	 			//Correct modal window position
	 			position.top = position.top + height + (+gutter);
	 			container.offset(position);

	 			//Add hendlers to close and save date
	 			container.find(".closeDDModal").click(container,closeDDMenu);
	 			container.find(".sendDDModal").click(event, saveDataToEl);

	 			//Add first lines with data from page
	 			if ($.isArray(lineData[0])) {
	 				for (var i = 0, l = lineData.length; i < l; i++){
	 					container.find("tbody").append(line.newLine(lineData[i]));
	 				};
					container.find("tbody").append(line.newLine());
	 			} else if (lineData.length > 1){
	 				container.find("tbody").append(line.newLine(lineData));
	 				container.find("tbody").append(line.newLine());
	 			} else {
	 				newLine(line, container);
	 				// container.find("tbody").append(line.newLine()).one("complite", function(){container.find("tbody").append(line.newLine())});
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