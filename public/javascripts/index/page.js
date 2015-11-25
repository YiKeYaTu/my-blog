define(function (require,exports,module) {
	var lc = require('../tools/lc');
	var allPage = lc('.normal-page');

	var articId;
	allPage.on('click',function (e) {
		var target = e.target;
		if (nodeIs(target,'className','page-container')) {
			articId = getArticID(target);
			changeUrl(articId);
		}
	});
	function nodeIs (target,attr,value) {
		return (typeof target === 'object') && (target[attr] === value.toLowerCase() || target.parentNode[attr] === value.toLowerCase());
	}
	function getArticID (target) {
		var t = lc(target);
		return t.attr('data-id') || t.parent.attr('data-id') || '';
	}
	function changeUrl (articId) {
		var url = window.location + ''
		history.pushState('','','artic/' + articId);
	}
	function cacheData () {

	}
	function getData () {

	}
});