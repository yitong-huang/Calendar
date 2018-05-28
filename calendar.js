var typeMap = {};
typeMap.head = "yt-calendar-cell-head";
typeMap.blank = "yt-calendar-cell-blank";
typeMap.empty = "yt-calendar-cell-empty";
typeMap.filled = "yt-calendar-cell-filled";
typeMap.today = "yt-calendar-cell-today";
typeMap.after = "yt-calendar-cell-after";

var animDura = 1000;
var x1 = 9999, y1 = 9999, x2 = -1, y2 = -1;

function buildCalendar() {
	var today = new Date();
	buildCalendarByMonth(today.getYear() + 1900, today.getMonth());
}

function buildCalendarByMonth(year, month) {
	x1 = 9999, y1 = 9999, x2 = -1, y2 = -1;
	var firstDayOfMonth = new Date(year, month, 1);
	var firstDayWeekday = firstDayOfMonth.getDay();
	var totalDayofMonth = new Date(year, month+1, 0).getDate();

	var $calendar = $("#yt-calendar");
	var calendarHeight = $calendar.height();
	var calendarWidth = $calendar.width();
	var calendarTop = $calendar.position().top;
	var calendarLeft = $calendar.position().left;
	console.log("top: " + calendarTop);
	console.log("top: " + calendarHeight);
	console.log("top: " + calendarLeft);
	console.log("top: " + calendarWidth);

	var cellLines = Math.ceil((7 + firstDayWeekday + totalDayofMonth) / 7);
	var cellColumns = 7;

	var height = Math.floor(calendarHeight / cellLines) - 4;
	var width = Math.floor(calendarWidth / cellColumns) - 4;

	removeAllChild($calendar);
	addCalendarHead ($calendar, width, height);
	addCalendarBlank($calendar, width, height, firstDayWeekday);
	addCalendarDays ($calendar, width, height, year, month, totalDayofMonth);
	addCalendarBlank($calendar, width, height, ((cellLines-1)*cellColumns - totalDayofMonth - firstDayWeekday));

	initCellsAbsPos($calendar, calendarTop, calendarLeft, calendarHeight, calendarWidth);
}

function initCellsAbsPos($calendar, top, left, height, width) {
	var $cells = $calendar.children();
	$cells.each(function(i) {
		var $b = $(this);
		$b.data({
			sn: i,
			ow: $b.width(),
			oh: $b.height(),
			ot: $b.position().top,
			ol: $b.position().left
		});
		$b.click(function() {
			var $others = $cells.not(this);
			if ($b.data("m") == "zoom") {
				$b.animate({width: $b.data("ow"), height: $b.data("oh"), top: $b.data("ot"), left: $b.data("ol")}, 
					animDura, function (){$b.data("m", "normal");
				});
				$b.children("div").fadeOut(animDura * 0.1, function () {
					$b.children("img").fadeIn(animDura * 0.9);
				});
				$others.animate({ "opacity": 1 }, animDura / 2).fadeIn(animDura / 2);
			}
			else {
				$b.animate({top: top, left: left, width: width, height: height}, animDura).data("m", "zoom");
			//$b.children("img").fadeOut(animDura * 0.9, function () {
				$b.fadeIn(animDura * 0.1);
			//});
				$others.fadeOut(animDura / 2);
			}
		})
	});

	$cells.each(function(i) {
		var $b = $(this);		
		$b.css({
			position: "absolute",
			left: $b.data("ol") + "px",
			top: $b.data("ot") + "px"
		});
	});
}

function addCalendarCell($calendar, type, width, height, word) {
	var $cell = $("<div />");
	$cell.addClass(type);
	setFloat($cell);
	setWidthHeight($cell, width, height);
	$cell.append(word);

	$calendar.append($cell);
}

function setFloat($block) {
	$block.css("float", "left");
}

function setWidthHeight($block, width, height) {
	$block.width(width);
	$block.height(height);
}

function removeAllChild($block) {
	$block.empty();
}

function addCalendarHead($calendar, width, height) {
	for (var i=0; i<7; i++) {
		addCalendarCell($calendar, typeMap.head, width, height, getWeekday(i));
	}
}

function addCalendarBlank($calendar, width, height, num) {
	for (var i=0; i<num; i++) {
		addCalendarCell($calendar, typeMap.blank, width, height, "");
	}
}

function addCalendarDays($calendar, width, height, year, month, totalDayofMonth) {
	var todayTemp = new Date();
	var today = new Date(todayTemp.getYear() + 1900, todayTemp.getMonth(), todayTemp.getDate());
	for (var i=1; i<=totalDayofMonth; i++) {
		var date = new Date(year, month, i);
		if (date < today) {
			addCalendarCell($calendar, typeMap.empty, width, height, i);
		} else if (date > today) {
			addCalendarCell($calendar, typeMap.after, width, height, i);
		} else {
			addCalendarCell($calendar, typeMap.today, width, height, i);
		}
	}
}

function getWeekday(day) {
	return "星期" + ["日", "一", "二", "三", "四", "五", "六"][day];
}

window.onload = buildCalendar;
window.onresize = buildCalendar;