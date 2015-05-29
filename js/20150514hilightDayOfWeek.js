 // Plugin with mark current day of week
 // Version 1.01
 // Date: 28.05.2015

jQuery(document).ready(function(){
	var dayOfWeek = new Date(),
		variables = {
			"selector": "table.table td.table",
			"week": ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
			"weekFool":["понедельник","вторник","среда","четверг","пятница","суббота","воскресенье"],
			"bgcolor": "#EECBAD"
		};

	dayOfWeek = dayOfWeek.getDay();
	var dayName = variables.week[dayOfWeek-1];
	var foolDayName = variables.weekFool[dayOfWeek-1];
		$(variables.selector).each(function(){
			var name = $(this).html();
			if((name.slice(0,2) == dayName) || (name == foolDayName)){
				$(this).css("background-color", variables.bgcolor);	
			}
	});
});