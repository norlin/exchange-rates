(function ($) {
	$.register('b-header', {
		init: function () {
			this.working = true;
			this.render();

			this.pauseButton = $.find('.js-pause', this.node)[0];
			$.bind(this.pauseButton, 'click', () => {
				this.working = !this.working;

				this.update();
			});
		},
		update: function () {
			if (this.working) {
				$.removeClass(this.pauseButton, 'b-button_pressed');
				this.emit('start');
			} else {
				$.addClass(this.pauseButton, 'b-button_pressed');
				this.emit('stop');
			}
		}
	});
}(window.$));