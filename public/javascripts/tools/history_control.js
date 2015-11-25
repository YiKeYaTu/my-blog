define(function (require,exports,module) {
	var lc = require('../tools/lc');
	lc(window).on('popstate',function (e) {
		console.log(e);
	});
})
	