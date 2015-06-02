 // Plugin make drop down menu wich specified in object "glovar" below
 // Version 3.01
 // Date: 01.06.2015
 // Require: jquery, jquery.inputmask

var carDeal = (function(){
	var glovar = {
		"handlers": [
		// {
		// 	"selector": ".ddPhone input",
		// 	"active": true,
		// 	"param": {
		// 		"gutter": "4", //Gutter between pole and drop down menu "4" px - default
		// 		"lineSeparator": "; ", //Separator between output result line
		// 		"fildSeparator": " \\ ", //Separator between output fild
		// 		"mustFill": [true, true], //Wich fild mast be entered for add next line. Mask mast be for correct work othervise input cheked like true.
		// 		"lines": [{
	 // 					"head": "Телфон",
	 // 					"tag": "<input>", // Mast be input, but can by a style data inside
	 //						"placeholder":""
	 // 					"mask": { //Mask for fild
	 // 						"mask": "99-aaa",
	 // 						"clearIncomplete": true
	 // 					}
	 // 				},{
	 // 					"head": "Добавочный",
	 // 					"tag": "<input>",
	 // 					"mask": {
	 // 						"mask": "99-99999"
	 // 					}
	 // 				},{
	 // 					"head": "Должность",
	 // 					"tag": "<input>",
	 // 					"mask": null
	 // 				},{
	 // 					"head": "Добавочный1",
	 // 					"tag": "<input>",
	 // 					"mask": {
	 // 						"mask": "9999999"
	 // 					}
	 // 				},{
	 // 					"head": "Добавочный2",
	 // 					"tag": "<input>",
	 // 						"mask": {
	 // 							"mask": "999"
	 // 						}
	 // 				}
	 // 			]
		// 	}
		// }
		// ,{
		// 	"selector": ".ddText textarea",
		// 	"active": true,
		// 	"param": {
		// 		"gutter": "4", //Gutter between pole and drop down menu "0" - default
		// 		"lineSeparator": "\n", //Separator between output result line
		// 		"fildSeparator": " \\ ", //Separator between output fild
		// 		"mustFill": [true,true,false], //Wich fild mast be entered for add next line. Mask mast be for correct work othervise input cheked like true.
		// 		"lines": [{
		// 				"head": "Телфон",
		// 				"tag": "<input>", // Mast be input, but can by a style data inside
		// 				"mask": { //Mask for fild
		// 					"mask": "99-aaa",
		// 					"clearIncomplete": true
		// 				}
		// 			},{
		// 				"head": "Добавочный",
		// 				"tag": "<input>",
		// 				"mask": {
		// 					"mask": "99-99999"
		// 				}
		// 			},{
		// 				"head": "Должность",
		// 				"tag": "<input>",
		// 				"mask": null,
		// 			}
		// 		]
		// 	}
		// }
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
		var line = $(data.currentTarget).val(),
			lines = line.split(data.data.lineSeparator),
			resultData = [];

			lines.length -= 1;

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
			param = data.data.data, //The special parametrs wich comes with in data object
			table = modal.find("tbody"),
			result = "",
			key = false;

		//Get data from all fild
		table.find("tr").each(function(j){
			var length = $(this).find("input").length - 1,
				partOfData = "",
				controlMask = false;

			key = true,
			//for check when no mask set
			reversFillKey = false;

			$(this).find("input").each(function(i){
				if (i < length) {
					partOfData += $(this).val() + param.fildSeparator;
				} else {
				partOfData += $(this).val();
				};

				controlMask = ( ('mustFill' in param) && (i in param.mustFill) ) ? param.mustFill[i] : false;

				if (!$(this).inputmask("isComplete") && controlMask) {
					key = false;
				}else if($(this).val() != ""){
					reversFillKey = true;
				};
			});

			//Check on empty fild and last element
			if (key && reversFillKey){
				result += partOfData + param.lineSeparator;
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
			givenMask = obj.mustFill || [];

	 	if (lineLength){
			for (var i = 0; i < lineLength ; i++){
					var el = $("<td>"),
						current = $(arr[i].tag || '<input>').data("index", i);
						if ('placeholder' in arr[i]){
							current.attr('placeholder', arr[i].placeholder);
						}
						//Copy all mask in mask arr;
						inpMaskArr[i] = arr[i].mask || null;

					//Colored head menu to point requider fild
					if( (('mustFill' in obj) && (i in obj.mustFill)) && obj.mustFill[i]){
 					head.find("tr").append('<th style="color:#FF6347">' + (arr[i].head || "") + "</th>");
					} else {
 					head.find("tr").append("<th>" + (arr[i].head || "") + "</th>");
					}

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
			if(temp.length < 2){
				temp.find("input").each(function(){
					$(this).val("");
				});
				var trigLine = $(this).closest("tr");
				trigLine.unbind("lineOk");
				//Used not standart handler for list line add action
				trigLine.one("lineOk", function(){ $(this).parent().trigger("complite"); });
			} else {
				$(this).closest("tr").fadeOut("fast", function(){ $(this).remove(); });
				// $(this).closest("tr").remove();
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
					var obj = extend(inpMaskArr[index], { "oncomplete": function(){ lineCheck(this); } });
					if (obj) {
						$(this).inputmask(obj);							
					} else {
						$(this).bind('focus', function(){ lineCheck(this); });
					}

					$(this).val(linearr[index]);
				});

				//Control all input in line with givenMask
				//!!!! Пересекается с переменной retLine из внешнего окружения...
				function lineCheck(el){
					var check = true;

					$(el).closest("tr").find("input").each(function(id, el){
						if ( (id in givenMask) && (givenMask[id]) ){
							check = $(el).inputmask("isComplete") && check;
						}
					});

					if(check){
						$(retLine).trigger("lineOk");
					}
				};

				return retLine;
			}
		}
	};

	function addHandlerOnComplite(el){
		var lastLine = el.find("tr").last();
		lastLine.one("lineOk", function(){ el.trigger("complite"); });
	};

	var handler = {
		"phoneList": function(event){

			var target = $(event.target),
				data = event.data, //Additional information from main config object
				position = target.position(),
				height = target.outerHeight(),
				gutter = event.data.gutter || 4,
				container = $(glovar.container),
				tbody = container.find("tbody"),//Set container tag
				line = tableLine(event.data),//Set template for current pole
				lineData = getDataFromEl(event);//Get data from curent pole

			target.blur();

			//Add head line position
			container.find("table").prepend(glovar.conTableHead);

			//Correct modal window position
			position.top = position.top + height + (+gutter);
			container.offset(position);

			//Add hendlers 
			//
			//close
			container.find(".closeDDModal").click(container,closeDDMenu);
			//save
			container.find(".sendDDModal").click(event, saveDataToEl);
			//complite line
			tbody.bind("complite", function(){
				tbody.append(line.newLine());
				addHandlerOnComplite(tbody);
			});	 			
			//

			//Add first lines with data from page
			if ($.isArray(lineData[0])) {
				for (var i = 0, l = lineData.length; i < l; i++){
					tbody.append(line.newLine(lineData[i]));
				};
			} else if (lineData.length > 1){
				tbody.append(line.newLine(lineData));
			};
			//Add new line
			tbody.append(line.newLine());

			//Add hendler to last line
			addHandlerOnComplite(tbody);

		openDDMenu(container);
			}
	};

	return {
		init: function(param){
			if($.isArray(param)) {
				for (var i = 0, length = param.length; i < length; i++){

 					var config = {'active':true,param:{}};

					if('gutter' in param[i]){config.param.gutter = param[i]['gutter']};
					if('lineSeparator' in param[i]){config.param.lineSeparator = param[i]['lineSeparator']}else(config.param.lineSeparator = '; ');
					if('fildSeparator' in param[i]){config.param.fildSeparator = param[i]['fildSeparator']}else(config.param.fildSeparator = ' \\ ');
					if('mustFill' in param[i]){config.param.mustFill = param[i]['mustFill']};
					if('lines' in param[i]){config.param.lines = param[i]['lines']} else {config.active = false};
					if('selector' in param[i]){config.selector = param[i]['selector']} else {config.active = false};
				};
				if(config.active){
					glovar.handlers.push(config);
				};
			};

	 		for (var i = 0, l = glovar.handlers.length; i < l; i++) {

	 			//Add hendler in all elements in the DOM
	 			if(glovar.handlers[i].active) {
	 				$(glovar.handlers[i].selector).each( function(){
		 				$(this).bind("click", glovar.handlers[i].param, handler.phoneList);

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