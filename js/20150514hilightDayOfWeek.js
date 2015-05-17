 // Plugin with mark current day of week
 // Version 1.00
 // Date: 14.05.2015

jQuery(document).ready(function(){
	var dayOfWeek = new Date(),
		variables = {
			"selector": "table.table td.table",
			"week": ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
			"bgcolor": "#EECBAD"
		};

	dayOfWeek = dayOfWeek.getDay();
	var dayName = variables.week[dayOfWeek-1];
		$(variables.selector).each(function(){
			if($(this).html().slice(0,2) == dayName){
				$(this).css("background-color", variables.bgcolor);	
			}
	});
});