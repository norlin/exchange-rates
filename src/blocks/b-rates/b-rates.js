(function (window, $) {
	$.register('b-rates', {
		init: function () {
			this.render();

			this.listen('timeout', timeout => {
				this.timeout = timeout;

				this.fetchData();
			});

			this.listen('start', () => {
				this.start();
			});

			this.listen('stop', () => {
				this.stop();
			});

			this.getDefaultTimeout();
			this.start();
		},
		getDefaultTimeout: function () {
			var refreshTimeout;

			refreshTimeout = $.find('#refreshTimeout')[0];
			this.timeout = refreshTimeout.options[refreshTimeout.selectedIndex].value;
		},
		start: function () {
			this.working = true;

			this.fetchData();
		},
		stop: function () {
			this.working = false;

			this.breakRequest();
		},
		breakRequest: function () {
			if (this.request) {
				this.request.abort();
			}

			if (this.requestTimeout) {
				window.clearTimeout(this.requestTimeout);
				this.requestTimeout = undefined;
			}
		},
		fetchData: function () {
			var apiKey = '9776f7e82f374e90b683221149c42e9e',
				url = 'http://openexchangerates.org/api/latest.json?app_id=' + apiKey;

			if (!this.working) {
				return;
			}

			this.request = $.getJSON(url, data => {
				var rateId,
					rates = [];

				for (rateId in data.rates) {
					if (data.rates.hasOwnProperty(rateId)) {
						rates.push({
							id: rateId,
							value: data.rates[rateId]
						});
					}
				}

				data.rates = rates;

				this.emit('updateRates', data);

				this.requestTimeout = window.setTimeout(() => {
					this.fetchData();
				}, this.timeout);
			});
		}
	});
}(window, window.$));