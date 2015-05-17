 // Plugin with made MASK "__:__ - __:__ " for time fild
 // Version 1.01
 // Date: 14.05.2015

 jQuery(document).ready(function(){
 	$.extend($.inputmask.defaults.definitions, {
 		"h":{
 			"validator": "2[0-3]|[0-1][0-9]",
 			"cardinality": 2,
 			"prevalidator": [
 				{
	 				"validator" : "[0-2]",
	 				"cardinality": 1
 				}
 			]
 		},
 		"5":{
 			"validator": "[0-5]",
 			"cardinality": 1,
 			"definitionSymbol": "*"

 		}
 	});

 	var variables = {
 		"selector":"input.ms-long.ms-spellcheck-true",
 		"mask":"h:59 - h:59",
 		"params":{
 			"clearIncomplete": true
 		}
 	};

	$(variables.selector).each(function(){
		if($(this).attr('title').slice(0,12) == "Режим работы"){
			$(this).inputmask(variables.mask,variables.params);
		}
	});
 });