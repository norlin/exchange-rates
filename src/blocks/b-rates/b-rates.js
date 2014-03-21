(function (window, $) {
	$.register('b-rates', {
		init: function () {
			this.render();

			this.timeout = 10000; // дефолтное значение

			this.listen('timeout', timeout => {
				this.timeout = timeout;

				console.log(timeout);
			});

			this.fetchData();
		},
		fetchData: function () {
			var from = 'USD',
				to = 'EUR',
				pairs = [
					'"USDEUR"',
					'"USDJPY"',
					'"USDBGN"',
					'"USDCZK"',
					'"USDDKK"',
					'"USDGBP"',
					'"USDHUF"',
					'"USDLTL"',
					'"USDLVL"',
					'"USDPLN"',
					'"USDRON"',
					'"USDSEK"',
					'"USDCHF"',
					'"USDNOK"',
					'"USDHRK"',
					'"USDRUB"',
					'"USDTRY"',
					'"USDAUD"',
					'"USDBRL"',
					'"USDCAD"',
					'"USDCNY"',
					'"USDHKD"',
					'"USDIDR"',
					'"USDILS"',
					'"USDINR"',
					'"USDKRW"',
					'"USDMXN"',
					'"USDMYR"',
					'"USDNZD"',
					'"USDPHP"',
					'"USDSGD"',
					'"USDTHB"',
					'"USDZAR"',
					'"USDISK"',
					'"EURUSD"'
				],
				url = [
					"http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28",
					pairs.join(','),
					"%29&env=store://datatables.org/alltableswithkeys"
				].join('');

			$.getJSONP(url, 'parseExchangeRate', data => {
				this.emit('updateRates', data.query);

				window.setTimeout(() => {
					this.fetchData();
				}, this.timeout);
			});
		}
	});
}(window, window.$));