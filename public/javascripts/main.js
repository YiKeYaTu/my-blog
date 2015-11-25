define(function (require) {
	var MATCH_INDEX = /\/index$/,
		MATCH_ARTIC = /\/artic\/.+?/,
		MATCH_OBSERVER = /\/observer$/;
	var href = window.location.href;
	var history = require('./tools/history_control');
	var main;
	if (MATCH_INDEX.test(href)) {
		main = require.async('./index/index');
	} else if (MATCH_OBSERVER.test(href)) {
		main = require.async('./observer/observer');
	} else if (MATCH_ARTIC.test(href)) {
		main = require.async('./artic/artic');
	}
});