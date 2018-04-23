(function (window, $) {
	$.register('b-rates__symbols', {
		init: function () {
			this.selected = [];
			this.data = [];

			this.listen('updateRates', (data) => {
				// после первого получения данных
				// отключаем обновление списка валют
				this.stopListening('updateRates');
				this.data = data;

				this.update();
			});

			this.listen('updateSelected', selected => {
				this.selected = selected;

				this.update();
			});
		},
		initButtons: function () {
			var block = this;

			$.bind($.find('.js-add-button', this.node), 'click', function () {
				var currency = this.value;

				if (currency) {
					block.emit('addCurrency', currency);
				}
			});

			$.bind($.find('.js-remove-button', this.node), 'click', function () {
				var currency = this.value;

				if (currency) {
					block.emit('removeCurrency', currency);
				}
			});

			$.bind($.find('.js-custom-add-button', this.node), 'click', () => {
				var currency = $.find('.js-custom-currency', this.node)[0],
					currencyId;

				currencyId = currency.options[currency.selectedIndex].value;

				this.emit('addCurrency', currencyId);
			});
		},
		update: function () {
			var favorites = [
					'EUR',
					'RUB'
				],
				results = {favorites:[]};

			results.all = this.data.rates.filter(rate => {
				var isSelected = this.selected.indexOf(rate.id) > -1;

				if (favorites.indexOf(rate.id) > -1) {
					results.favorites.push({
						id: rate.id,
						selected: isSelected
					});
					return false;
				}

				if (isSelected) {
					return false;
				}

				return true;
			});

			this.render(results);
			this.initButtons();
		}
	});
}(window, window.$));