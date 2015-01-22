// v0.1
// input과 history 구현
// hisory 5개만 유지 구현

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
		// input = input.replace('<', '%3C');
		// input = input.replace('>', '%3E');
		history.append('<p>' + input + '</p>');

		var match1 = input.match(/^<([^<^\/]*)>$/);
		var match2 = input.match(/^<\/([^<]*)>$/);

		if (match1 !== null) {
			var object = [];
			object.name = match1[1];
			object.startTime = new Date();
			topics.push(object);
		} else if (match2 !== null) {
			var name = match2[1];

			for (var i in topics) {
				if (topics[i].name == name) {
					topics[i].closeTime = new Date();
					break;
				}
			}
		}

		// console.log(topics);
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
					html += '<span class="duration">' + formatMinute( topic.closeTime - topic.startTime ) + '</span>';
				}
				html += '</ul>';
			}
			// html = '<ul>' + html + '</ul>';
			// console.log(html);
			$result.html(html);
		}

		cleanHistory();
		inputbox.val('');
	};

	var formatTime = function(time){
		var hour = time.getHours(),
		min = time.getMinutes(),
		sec = time.getSeconds();
		return hour+'am '+':'+ min +':'+ sec;
	};
	
	var formatMinute = function(time){
		// var hour = time.getHours(),
		// min = time.getMinutes(),
		time = Math.floor(time / 1000);
		console.log(time);
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;

		// sec = time.getMilliseconds();
		return minutes + 'min' + seconds + 's';
	};

});
