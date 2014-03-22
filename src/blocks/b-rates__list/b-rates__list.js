(function (window, $) {
	$.register('b-rates__list', {
		init: function () {
			this.selected = [];
			this.render();

			this.listen('updateRates', data => {
				this.data = data;

				this.update();
			});

			this.listen('addCurrency', currency => {
				if (this.selected.indexOf(currency) === -1) {
					this.selected.push(currency);

					this.update();
				}
			});

			this.listen('removeCurrency', currency => {
				var currencyIndex = this.selected.indexOf(currency);
				if (currencyIndex > -1) {
					this.selected.splice(currencyIndex, 1);

					this.update();
				}
			});
		},
		update: function () {
			var pairs = this.data.rates.filter(rate => {
				if (this.selected.indexOf(rate.id) > -1) {
					return true;
				}

				return false;
			});

			this.render(undefined, {
				rates: pairs,
				date: (new Date(this.data.timestamp * 1000)).toString()
			});
		}
	});
}(window, window.$));