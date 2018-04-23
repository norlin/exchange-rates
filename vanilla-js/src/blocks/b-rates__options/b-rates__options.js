(function (window, $) {
	$.register('b-rates__options', {
		init: function () {
			var timeoutSelect,
				langData = this.getLangData(),
				defaultValue = $.restoreData('timeout') || 10000,
				values = [
					{
						value: 1000,
						text: '1 ' + $.wordEnd(langData.seconds, 1)
					},
					{
						value: 10000,
						text: '10 ' + $.wordEnd(langData.seconds, 10),
					},
					{
						value: 30000,
						text: '30 ' + $.wordEnd(langData.seconds, 30)
					},
					{
						value: 60000,
						text: '1 ' + $.wordEnd(langData.minutes, 1)
					}
				];

			values = values.map(function (value) {
				if (value.value == defaultValue) {
					value.active = true;
				}

				return value;
			});

			this.render(undefined, {
				values: values
			});

			timeoutSelect = $.find('select', this.node)[0];

			$.bind(timeoutSelect, 'change', () => {
				var value = timeoutSelect.options[timeoutSelect.selectedIndex].value;

				$.saveData('timeout', value);

				this.emit('timeout', value);
			}, false);
		}
	});
}(window, window.$));