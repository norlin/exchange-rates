(function ($) {
	$.register('b-header', {
		init: function () {
			this.working = true;
			this.render();

			$.find('.js-pause', this.node)[0].addEventListener('click', () => {
				this.working = !this.working;

				this.update();
			});
		},
		update: function () {
			if (this.working) {
				this.emit('start');
			} else {
				this.emit('stop');
			}
		}
	});
}(window.$));