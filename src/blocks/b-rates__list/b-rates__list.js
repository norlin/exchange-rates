(function (window, $) {
	$.register('b-rates__list', {
		init: function () {
			this.render();

			this.listen('updateRates', data => {
				this.render(undefined, data);
			});
		}
	});
}(window, window.$));