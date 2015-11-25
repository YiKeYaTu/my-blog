define(function (require,exports,module) {
	var lc = require('../tools/lc');
	var page = require('./page');
	(function () {
		var timer,
			body;
		function moveTimeScroll (body) {
			lc('.time-scroll').css({
				'top': (window.innerHeight - parseFloat(lc('.time-scroll').css('height'))) / 2 + 'px',
				'left': body.offsetWidth * 0.075 - 50 + 'px'
			})
		}
		lc(window)
			.on('load',function () {
				body = document.body;
				moveTimeScroll(body);
			})
			.on('resize',function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					moveTimeScroll(body);
				},10);
			});
	})();

	(function () {
		function goTop (speed) {
		
		}
		function Rotate () {
			lc(window)
				.on('scroll',function () {
					if (lc(document.body)[0].scrollTop > 200) {
						lc('.go-top')
							.css('transform','rotate(0deg)');
					} else {
						lc('.go-top')
							.css('transform','rotate(180deg)');
					}
				});
			lc('.go-top-content').on('click',function () {

			});
		}
		Rotate();
	})();

	(function (win) {
		function timerFocus () {
			var point = lc('.timer-move-point');

			var _animationScroll = function (newPos,speed) {
				var timeScal = 1000/60,
					count = speed/timeScal,
					oldPos = win.scrollY;
				var i = 0,
					callback = [],
					timer;
				timer = setInterval(function () {
					if (i++ >= count) {
						clearInterval(timer);
						callback.forEach(function (item) {
							item();
						});
						return 'done';
					}
					win.scrollTo(0,lc().cubicBezier(
						{x:0,y:oldPos},
						{x:0,y:newPos * 1.15},
						{x:0,y:newPos * 1.1},
						{x:0,y:newPos},
						i/count).y
					);
				},timeScal);
				return {
					then:function (fn) {
						callback.push(fn);
					}
				}
			};
			var _action = function (el) {
				el.css({
					'transform':'scale(1.5,1.5)',
					'background':'#FFB400'
				});
				return true;
			};
			var _normal = function (el) {
				el.css({
					'transform':'scale(1,1)',
					'background':'#f3f3f3'
				});
				return false;
			}
			var scrollToPage = function () {
				var pageNumber,
					lastAction,
					endPos;
				var flag = true;
				lc('.timer-day-content').on('click',function () {
					if (flag) {
						flag = !flag;
						pageNumber = parseInt(lc(this).attr('len')) - 1;
						endPos = lc('.page').eq(pageNumber).offset().top;
						_animationScroll(endPos,800)
							.then(function () {
								flag = !flag;
							});
					}
				});
			};
			var scrollPointAction = function () {
				var docBody = document.body,
					lastAction,
					num;
				lc(win).on('scroll',function () {
					winTop = docBody.scrollTop;
					lc('.page').each(function (item) {
						item = lc(item);
						if (winTop >= item.offset().top && winTop <= item.offset().top + parseFloat(item.css('height'))) {			
							lastAction && _normal(lc('.timer-day-content').eq(num));
							num = lastAction = item.attr('num');
							_action(lc('.timer-day-content').eq(num));				
						}
					});
				});
			};
			return {
				scrollToPage : scrollToPage,
				scrollPointAction : scrollPointAction
			}
		}
		var controlFocus = timerFocus();
		controlFocus.scrollToPage();
		controlFocus.scrollPointAction();
	})(window);
})
	