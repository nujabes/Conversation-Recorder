// ver 0.5
// prograss bar를 canvas에 표현
// lodash 도입
// bar 그래프 ui 조정
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();



var canvas = document.getElementById('barCanvas');
canvas.width = 440;
canvas.height = 300;
canvas.bgColor = "#f5f5f5;";
var context = canvas.getContext('2d');
var sessionStart = null;

jQuery(document).ready(function($) {
	var inputbox = $('input#console');
	var $result = $('#results');
	var topics = [];
	
	function animate() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (topics.length > 0) {
			if (sessionStart === null) {
				sessionStart = new Date();
			}
			for (var i in topics) {
				topics[i].drawPrograssBar(i);
			}
		}
		requestAnimFrame(function() {
			animate();
		});
	}
	animate();



// topic Button Behavior
	$('.topicButtons').on('click', '.stopRecord', function() {
		thisTopic = $(this).data('topic');
		// if(_.contains(topics, thisTopic)) topics[i].finish(); // lodash test
		for (var i in topics) {
			if (topics[i].name == thisTopic) {
				topics[i].finish();
				break;
			}
		}
	});


// input
	$('.inputEnter').click(function(event) {
		var e = jQuery.Event("keydown");
		e.which = 13;
		inputbox.trigger(e);
	});
	inputbox.on('keydown', function(e) {
		if (e.which == 13 && inputbox.val() !== '') {
			var input = inputbox.val();
			parseInput(input);
			afterInput();
		}
	});


//parsing
	var parseInput = function(input) {
		var openTag = input.match(/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-?!]*)$/);
		var closeTag = input.match(/^[\/]([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);
		if (openTag !== null) {
			for (var i in topics) {
				if (topics[i].name == openTag[1]) {
					return false;
				}
			}
			var topic = new Topic(openTag[1], new Date());
			topics.push(topic);
		} 
		else if (closeTag !== null) {
			var name = closeTag[1];
			for (var l in topics) {
				if (topics[l].name == name) {
					topics[l].finish();
					break;
				}
			}
		}
	};

	var afterInput = function(argument) {
		$result.scrollTop(9999);
		inputbox.val('');
	};

	var Topic = function(title, created) {
		var index,
			name,
			startTime,
			closeTime,
			duration,
			onProcess,
			topPosition;
		this.name = title;
		this.startTime = created;
		this.duration = 0;
		this.onProcess = true;
		this.printResult();
		this.drawButton();
		this.topPosition = 0;
	};


	Topic.prototype = {
		printResult: function(finish) {
			var html = '';
			if (finish === undefined) {
				html += '<p><span class="title">' + this.name + '</span>';
				html += '<span class="startTime">' + formatTime(this.startTime) + '</span>';
			} else {
				html += '<p><span class="title">/' + this.name + '</span>';
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
			var idx = val,
				spacing = 5,
				// speed = 10,
				speed = 0.3,
				durationMill = this.getDuration() ,
				title = this.name,
				barWidth = durationMill / 1200 / speed,
				barHeight = 14,
				xlocation = Math.max((this.startTime - sessionStart) / 1200 / speed, 0),
				ylocation = ( barHeight + spacing ) * idx,
				onProcess = this.onProcess,
				titleXLoc = xlocation + barWidth + 10; 
				
		// min = durationMill.getMinutes(),
		// sec = durationMill.getSeconds();

			dtime = formatMinute(durationMill);

			context.fillStyle = (onProcess !== false) ? '#337ab7' : '#d44950' ;
			context.fillRect(xlocation, ylocation, barWidth, barHeight);
			context.fillStyle = '#777777';
			context.font = "10px Verdana";
			context.fillText(title, titleXLoc, ylocation + 13);
			if(onProcess !== true){
				context.fillStyle = '#d44950';
				context.font = "10px Verdana";
				context.fillText(dtime, titleXLoc + title.length * 10 + 10, ylocation + 13);
			}
		},
		finish: function() {
			// console.log('finish');
			this.closeTime = new Date();
			var btn = $('.topicButtons').find("[data-topic='" + this.name + "']");
			btn.removeClass('btn-danger').attr("disabled", true).find('span').attr("disabled", true).removeClass('glyphicon-stop').addClass('glyphicon-ok');
			this.printResult(true);
			this.onProcess = false;
			afterInput();
		},
		getDuration: function() {
			if (this.onProcess === false) {
				this.duration = this.closeTime - this.startTime; // finished
			} else { 
				this.duration = new Date() - this.startTime; // growing
			}
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