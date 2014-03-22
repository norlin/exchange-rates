(function (window, $) {
	$.register('b-rates__symbols', {
		init: function () {
			var favorites = [
					'EUR',
					'RUB'
				];

			this.listen('updateRates', (data) => {
				var results = {favorites:[]};

				// после первого получения данных
				// отключаем обновление списка валют
				this.stopListening('updateRates');

				results.all = data.rates.filter(function (rate) {
					if (favorites.indexOf(rate.id) > -1) {
						results.favorites.push(rate);
						return false;
					}

					return true;
				});

				this.render(undefined, results);
			});
		}
	});
}(window, window.$));