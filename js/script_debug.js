// ver 0.5
// prograss bar를 canvas에 표현
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();
var canvas = document.getElementById('barCanvas');
canvas.width = 440;
canvas.height = 400;
canvas.bgColor = "#f5f5f5;";

var context = canvas.getContext('2d');
var sessionStart = null;
// var started = false;

jQuery(document).ready(function($) {
	var inputbox = $('input#console');
	var $result = $('#results');
	var topics = [];


	function animate() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		if (topics.length > 0){

			if(sessionStart === null){
				sessionStart = new Date();
			}
			
			// console.log('a');
			// console.log(topics.length);
			// for (var i = 0; i < topics.length ; i ++) {
			for (var i in topics) {
				 // console.log(i);
				topics[i].drawPrograssBar(i);
				// console.log(topics);
				// break;
			}
		}
		requestAnimFrame(function() {
			animate();
		});

	}
	animate();



	$('.topicButtons').on('click', '.stopRecord', function() {
		thisTopic = $(this).data('topic');
		for (var i in topics) {
			if (topics[i].name == thisTopic) {
				topics[i].finish();
				break;
			}
		}
	});

	$('.inputEnter').click(function(event) {
		var e = jQuery.Event("keydown");
		e.which = 13;
		inputbox.trigger(e);
	});


	inputbox.on('keydown', function(e) {
		if (e.which == 13 && inputbox.val() !== '') { // enter key
			var input = inputbox.val();
			parseInput(input);
			afterInput();
		}
	});

	// inputbox.on('keypress', function(e) {
	// 	if (e.which == 47) { // '/' type character
	// 		var availableTags = [
	// 			"/ActionScript",
	// 			"/AppleScript",
	// 			"/Asp",
	// 			"/BASIC",
	// 		];
	// 		inputbox.autocomplete({
	// 			source: availableTags
	// 		});
	// 		console.log('a');
	// 		var input = inputbox.val();
	// 		parseInput(input);
	// 		afterInput();
	// 	}
	// });

var parseInput = function(input) {
	var openTag = input.match(/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);
	var closeTag = input.match(/^[\/]([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);
	if (openTag !== null) {
		var topic = new Topic(openTag[1], new Date());
		topics.push(topic);
	} else if (closeTag !== null) {
		var name = closeTag[1];
		for (var i in topics) {
			if (topics[i].name == name) {
				topics[i].finish();
				break;
			}
		}
	}
};



var afterInput = function(argument) {
	if (topics.length > 0) {
		var li = $result.find('li:first');

		if ($result.find('p').length > 5) {
			$('#results p:first').remove();
		}
	}
	inputbox.val('');
};

function drawBar(x, y, title, width) {
	context.fillStyle = '#337ab7';
	context.fillRect(x, y, width, 20);
	context.fillStyle = '#ffffff';
	context.font = "10px Verdana";
	context.fillText(title, x+10, y+13);	
}

var Topic = function(title, created) {
	var index,
	name,
	startTime,
	closeTime,
	duration,
	going,
	topPosition;
	this.name = title;
	this.startTime = created;
	this.duration = 0;
	this.printResult();
	this.drawButton();
	// this.drawPrograssBar();
	this.topPosition = 0;
	// console.log(topics.length);
	// ;
};

Topic.prototype = {
	printResult: function(finish) {
		var html = '';
		if (finish === undefined) {
			html += '<p><span class="title">' + this.name + '</span> begin';
			html += '<span class="startTime">' + formatTime(this.startTime) + '</span>';
		} else {
			html += '<p><span class="title">' + this.name + '</span> end';
			html += '<span class="closeTime">' + formatTime(this.closeTime) + '</span>';
			html += '<span class="duration">' + formatMinute(this.duration) + '</span>';
		}
		html += '</p>';
		return $result.append(html);
	},
	drawButton: function() {
		var btnhtml = '<div class="btn-group"><button type="button" class="btn btn-default btn-xs" disabled>' + this.name + '</button><button type="button" class="btn btn-default btn-xs stopRecord" aria-expanded="false" data-topic="' + this.name + '"><span class="glyphicon glyphicon-stop"></span></button></div>';
		$('.topicButtons').prepend(btnhtml);
	},
	drawPrograssBar: function(val) {
			this.idx = val;
			// console.log(this);
			// console.log(percentage);
			var percentage = this.getDuration() / 1200 / 100;
			// console.log(this.duration);
			// if(this.duration !== undefined) percentage = this.duration / 1200 / 100;
			xlocation = Math.max((this.startTime - sessionStart) / 1200 / 100, 0);
			// console.log(xlocation);
			// var prograssBarHtml = '<div class="progress"><div class="progress-bar" role="progressbar" data-topic="' + this.name +'" aria-valuenow="'+ percentage +'" aria-valuemin="0" aria-valuemax="100" style="min-width:30px; width: '+ percentage +'%;">' + this.name + '</div></div>';
			// $('.barGroup').prepend(prograssBarHtml);
			// console.log(this.idx);
			// console.log(sessionStart + '//' + this.startTime + '//' + xlocation);
			drawBar(xlocation * 10, 36 * this.idx, this.name, percentage * 10);
			// this.topPosition += 15;
		},
		// updatePrograssBar: function() {
		// 	var percentage = this.duration / 1200 * 1000;
		// 	var prograssBarHtml = '<div class="progress"><div class="progress-bar" role="progressbar" data-topic="' + this.name +'" aria-valuenow="'+ percentage +'" aria-valuemin="0" aria-valuemax="100" style="min-width:30px; width: '+ percentage +'%;">' + this.name + '</div></div>';
		// 	$('.barGroup').prepend(prograssBarHtml);
		// },
		finish: function() {
			console.log('finish');
			this.closeTime = new Date();
			// this.duration = this.closeTime - this.startTime;
			// for (var i in topics) {
			// 	if (topics[i].name == thisTopic) {
			// 		topics[i].finish();
			// 		break;
			// 	}
			// }
			var btn = $('.topicButtons')
			.find("[data-topic='" + this.name + "']");
			btn
			.removeClass('btn-danger')
			.attr("disabled", true)
			// .addClass('btn-success')
			.find('span')
			.attr("disabled", true)
			.removeClass('glyphicon-stop')
			.addClass('glyphicon-ok');
			// console.log(topics);
			// console.log(this);

			this.printResult(true);
			afterInput();
		},
		getDuration: function() {
			// var obj = [];
			// obj.
			// obj.dueration = new Date() - this.startTime;
			if(this.closeTime !== undefined) this.duration = this.closeTime - this.startTime;
			else this.duration = new Date() - this.startTime;
			return this.duration;
		}
	};

});

var formatTime = function(time) {
	var hour = time.getHours(),
	min = time.getMinutes(),
	sec = time.getSeconds();
	return hour + ':' + min + ':' + sec;
};

var formatMinute = function(time) {
	time = Math.floor(time / 1000);
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	return minutes + 'min ' + seconds + 's';
};