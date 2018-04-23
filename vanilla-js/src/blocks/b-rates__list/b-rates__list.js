(function (window, $) {
	$.register('b-rates__list', {
		init: function () {
			this.firstUpdate = true;

			this.selected = $.restoreData('selected') || [];
			this.render();

			this.listen('updateRates', data => {
				this.data = data;

				this.update();
			});

			this.listen('addCurrency', currency => {
				if (this.selected.indexOf(currency) === -1) {
					this.selected.push(currency);

					this.emit('updateSelected', this.selected);
					this.update();
				}
			});

			this.listen('removeCurrency', currency => {
				var currencyIndex = this.selected.indexOf(currency);

				if (currencyIndex > -1) {
					this.selected.splice(currencyIndex, 1);

					this.emit('updateSelected', this.selected);
					this.update();
				}
			});
		},
		update: function () {
			var block = this,
				pairs = this.data.rates.filter(function (rate) {
					if (block.selected.indexOf(rate.id) > -1) {
						return true;
					}

					return false;
				}),
				date = (new Date(block.data.timestamp * 1000));

			if (this.firstUpdate) {
				this.emit('updateSelected', this.selected);
				this.firstUpdate = false;
			}

			$.saveData('selected', this.selected);

			this.render({
				rates: pairs,
				date: $.parseTime(date),
				requestTime: $.parseTime(block.data.requestTime)
			});

			$.bind($.find('.js-remove-button', this.node), 'click', function () {
				block.emit('removeCurrency', this.value);
			});
		}
	});
}(window, window.$));