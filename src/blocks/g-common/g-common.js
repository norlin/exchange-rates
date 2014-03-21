(function (window) {
	window.$ = function (selector) {
		return window.document.querySelector(selector);
	};
}(window));