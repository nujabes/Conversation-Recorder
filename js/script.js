// v0.2
// result 분리
// 입력값을 array로 만들어 입력된 시간을 갖음.
// closeTag로 끝나는 시간 입력
// 정규식으로 한글, 영문만 입력받음

jQuery(document).ready(function($) {
	var inputbox = $('body #console');
	var history = $('#history').append('<p></p><p></p><p></p><p></p><p></p>');
	var $result = $('#results');
	var topics = [];

	// var topic;

	inputbox.on('keydown', function(e) {
		if (e.which == 13) {
			var input = inputbox.val();
			processInput(input);
			afterInput();
		}
	});


	var cleanHistory = function(argument) {
		if (history.find('p').length > 5) {
			history.find('p:first').remove();
		}
	};

	var processInput = function(input) {
		history.append('<p>' + input + '</p>');

		var openTag = input.match(/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);
		var closeTag = input.match(/^[\/]([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);

		if (openTag !== null) {
			topics.push(new Topic(openTag[1], new Date()));
		} else if (closeTag !== null) {
			var name = closeTag[1];
			for (var i in topics) {
				if (topics[i].name == name) {
					topics[i].finish(new Date());
					break;
				}
			}
		}

		console.log(topics);
	};



	var afterInput = function(argument) {
		if(topics.length > 0){
			var html = '';
			// console.log(topics);
			for(var i in topics){
				var topic = topics[i];
				// console.log(topic);
				html += '<ul>';
				html += '<li><span class="title">' + topic.name + '</span>';
				html += '<span class="startTime">' + formatTime(topic.startTime) + '</span>';
				if(topic.closeTime !== undefined){
					html += '<span class="closeTime">' + formatTime(topic.closeTime) + '</span>';
					html += '<span class="duration">' + formatMinute( topic.duration ) + '</span>';
				}
				html += '</ul>';
			}
			// html = '<ul>' + html + '</ul>';
			// console.log(html);
			$result.html(html);
		}
		console.log(topics);
		cleanHistory();
		inputbox.val('');
	};


	var Topic = function(name, created) {
		var name,
			startTime,
			closeTime,
			duration,
			going;
		this.name = name;
		this.startTime = created;
	};

	Topic.prototype = {
		finish : function(time){
			this.closeTime = time;
			this.duration = this.closeTime - this.startTime;
		}
	};

});

var formatTime = function(time) {
	var hour = time.getHours(),
		min = time.getMinutes(),
		sec = time.getSeconds();
	return hour + 'am ' + ':' + min + ':' + sec;
};

var formatMinute = function(time) {
	// var hour = time.getHours(),
	// min = time.getMinutes(),
	time = Math.floor(time / 1000);
	console.log(time);
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;

	// sec = time.getMilliseconds();
	return minutes + 'min' + seconds + 's';
};

