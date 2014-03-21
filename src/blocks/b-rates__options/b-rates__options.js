(function (window, $) {
	$.register('b-rates__options', {
		init: function () {
			var timeoutSelect;

			this.render(undefined, {
				values: [
					{
						value: 1000,
						text: '1 секунда'
					},
					{
						value: 10000,
						text: '10 секунд',
						active: true
					},
					{
						value: 30000,
						text: '30 секунд'
					},
					{
						value: 60000,
						text: '1 минута'
					}
				]
			});

			timeoutSelect = $.find('select', this.node)[0];

			timeoutSelect.addEventListener('change', () => {
				var value = timeoutSelect.options[timeoutSelect.selectedIndex].value;

				this.emit('timeout', value);
			}, false);
		}
	});
}(window, window.$));