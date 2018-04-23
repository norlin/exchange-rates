(function ($) {
	$.register('b-lang-switch', {
		init: function () {
			var langSelect,
				lang,
				langsList = [];

			for (lang in window.i18n) {
				if (window.i18n.hasOwnProperty(lang)) {
					langsList.push({
						id: lang,
						title: window.i18n[lang].langName,
						active: lang === window.i18nSelected
					});
				}
			}

			this.render(langsList);

			langSelect = $.find('select', this.node)[0];
			$.bind(langSelect, 'change', () => {
				var lang = langSelect.options[langSelect.selectedIndex].value;

				window.location = '?lang=' + lang;
			}, false);
		}
	});
}(window.$));