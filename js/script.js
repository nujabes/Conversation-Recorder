// v0.3
// bootstrap ui 도입
// button UI 도입
// history 제거, 버튼 추가
// button을 눌러 topic을 닫을수 있음

jQuery(document).ready(function($) {
	var inputbox = $('input#console');
	var history = $('#history').append('<p></p><p></p><p></p><p></p><p></p>');
	var $result = $('#results');
	var topics = [];

	// var topic;
		// $('.topicButtons').delicate('.stopRecord','click', function() {
		// 	// this.finish();
		// 	console.log(event);
		// });
		$('.topicButtons').on('click','.stopRecord', function() {
			thisTopic = $(this).data('topic');
			// console.log(thisTopic);
			// topics['thisTopic'].finish();
			for (var i in topics) {
				if (topics[i].name == thisTopic) {
					topics[i].finish();
					break;
				}
			}
		});

	// $('.btn-default').on('click', function(){console.log('a')});
		$('.inputEnter').click(function(event){
			var e = jQuery.Event("keydown");
			e.which = 13;
			inputbox.trigger(e);
		});
	

	inputbox.on('keydown', function(e) {
		if (e.which == 13 && inputbox.val() !== '') { // enter key
			var input = inputbox.val();
			processInput(input);
			afterInput();
		}
	});

	inputbox.on('keypress', function(e) {
		if (e.which == 47) { // '/' type character
			// var availableTags = [
			// 	"/ActionScript",
			// 	"/AppleScript",
			// 	"/Asp",
			// 	"/BASIC",
			// 	"/C",
			// 	"/C++",
			// 	"/Clojure",
			// 	"/COBOL",
			// 	"/ColdFusion",
			// 	"/Erlang",
			// 	"/Fortran",
			// 	"/Groovy",
			// 	"/Haskell",
			// 	"/Java",
			// 	"/JavaScript",
			// 	"/Lisp",
			// 	"/Perl",
			// 	"/PHP",
			// 	"/Python",
			// 	"/Ruby",
			// 	"/Scala",
			// 	"/Scheme"
			// ];
			// inputbox.autocomplete({
			// 	source: availableTags
			// });
			// console.log('a');
			// var input = inputbox.val();
			// processInput(input);
			// afterInput();
		}
	});


	var cleanResult = function(argument) {
		if ($result.find('li').length > 5) {
			// console.log('remove');
			// console.log($result.find('li').eq(0));
			$result.find('li').eq(0).remove();
		}
	};

	var processInput = function(input) {
		// result.append('<p>' + input + '</p>');

		var openTag = input.match(/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);
		var closeTag = input.match(/^[\/]([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s|\-]*)$/);

		if (openTag !== null) {
			topics.push(new Topic(openTag[1], new Date()));
			// topics[topics.length - 1].addBtn();
		} else if (closeTag !== null) {
			var name = closeTag[1];
			for (var i in topics) {
				if (topics[i].name == name) {
					topics[i].finish();
					break;
				}
			}
		}

		// console.log(topics);
	};



	var afterInput = function(argument) {
		if (topics.length > 0) {
			var html = '';
			for (var i in topics) {
				html += topics[i].printLog();
			}
			$result.html(html);
			cleanResult();
		}
		inputbox.val('');
	};



	// $('.topicButtons').find('.stopRecord').each(function(index, el) {
	// 	$(this).click(function(event) {
	// 		// this.finish();
	// 		console.log(event);
	// 	});
	// });




	var Topic = function(title, created) {
		var name,
			startTime,
			closeTime,
			duration,
			going;
		this.name = title;
		this.startTime = created;
		this.addBtn();
	};

	Topic.prototype = {
		printLog : function() {
			var html = '';
			html += '<li><span class="title">' + this.name + '</span>';
			html += '<span class="startTime">' + formatTime(this.startTime) + '</span>';
			if (this.closeTime !== undefined) {
				html += '<span class="closeTime">' + formatTime(this.closeTime) + '</span>';
				html += '<span class="duration">' + formatMinute(this.duration) + '</span>';
			}
			html += '</li>';
			return html;
			// $result.append(html);
		},
		addBtn : function(){
			var btnhtml = '<div class="btn-group"><button type="button" class="btn btn-default btn-xs" disabled>'+this.name+'</button><button type="button" class="btn btn-default btn-xs stopRecord" aria-expanded="false" data-topic="'+this.name+'"><span class="glyphicon glyphicon-stop"></span></button></div>';
			$('.topicButtons').prepend(btnhtml);
		},
		finish : function() {
			this.closeTime = new Date();
			this.duration = this.closeTime - this.startTime;
			// for (var i in topics) {
			// 	if (topics[i].name == thisTopic) {
			// 		topics[i].finish();
			// 		break;
			// 	}
			// }
			var btn = $('.topicButtons')
			.find("[data-topic='"+this.name+"']");
			btn
			.removeClass('btn-danger')
			.attr("disabled",true)
			// .addClass('btn-success')
			.find('span')
			.attr("disabled",true)
			.removeClass('glyphicon-stop')
			.addClass('glyphicon-ok');
			// console.log(topics);
			afterInput();
		}
	};

});

var formatTime = function(time) {
	var hour = time.getHours(),
		min = time.getMinutes(),
		sec = time.getSeconds();
	return hour + 'am' + ':' + min + ':' + sec;
};

var formatMinute = function(time) {
	// var hour = time.getHours(),
	// min = time.getMinutes(),
	time = Math.floor(time / 1000);
	// console.log(time);
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;

	// sec = time.getMilliseconds();
	return minutes + 'min ' + seconds + 's';
};