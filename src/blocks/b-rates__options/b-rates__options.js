(function (window, $) {
	$.register('b-rates__options', {
		init: function () {
			var timeoutSelect,
				langData = this.getLangData();

			this.render(undefined, {
				values: [
					{
						value: 1000,
						text: '1 ' + $.wordEnd(langData.seconds, 1)
					},
					{
						value: 10000,
						text: '10 ' + $.wordEnd(langData.seconds, 10),
						active: true
					},
					{
						value: 30000,
						text: '30 ' + $.wordEnd(langData.seconds, 30)
					},
					{
						value: 60000,
						text: '1 ' + $.wordEnd(langData.minutes, 1)
					}
				]
			});

			timeoutSelect = $.find('select', this.node)[0];

			$.bind(timeoutSelect, 'change', () => {
				var value = timeoutSelect.options[timeoutSelect.selectedIndex].value;

				this.emit('timeout', value);
			}, false);
		}
	});
}(window, window.$));