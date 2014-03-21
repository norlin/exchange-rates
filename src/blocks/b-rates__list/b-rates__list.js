(function (window, $) {
	$.register('b-rates__list', {
		init: function () {
			this.selected = ['EUR', 'RUB'];
			this.render();

			this.listen('updateRates', data => {
				var pairs = data.rates.filter(rate => {
					if (this.selected.indexOf(rate.id) > -1) {
						return true;
					}

					return false;
				});

				this.render(undefined, {
					rates: pairs,
					date: (new Date(data.timestamp * 1000)).toString()
				});
			});
		}
	});
}(window, window.$));