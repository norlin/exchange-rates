(function (window) {
	var BlockTypes = {},
		Block = function (node) {
			var options = node.dataset;

			this.node = node;
			this.name = options.block;

			this.create();
		},
		BlockHandlers = [];

	Block.prototype.create = function () {
		var blockType = BlockTypes[this.name],
			method;

		if (!blockType) {
			throw new Error('There is no block with name `' + this.name + '`! :(');
		}

		// заменяем дефолтные методы на переданные при регистрации блока
		for (method in blockType) {
			if (blockType.hasOwnProperty(method)) {
				this[method] = blockType[method];
			}
		}

		this.handlers = {};

		BlockHandlers.push(this.handlers);
	};

	Block.prototype.init = function () {
		this.render();
	};

	Block.prototype.listen = function (event, handler) {
		this.handlers[event] = this.handlers[event] || [];
		this.handlers[event].push(handler.bind(this));
	};

	Block.prototype.stopListening = function (event, handler) {
		var listeners = this.handlers[event],
			listenerIndex;

		if (listeners) {
			if (handler) {
				listenerIndex = listeners.indexOf(handler);

				if (listenerIndex > -1) {
					listeners.splice(listenerIndex, 1);
				}
			} else {
				this.handlers[event] = [];
			}
		}
	};

	Block.prototype.emit = function (event, data) {
		function executeHandler (handler) {
			handler(data);
		}

		BlockHandlers.forEach(function (listeners) {
			var handlers = listeners[event];

			if (handlers) {
				handlers.forEach(executeHandler);
			}
		});
	};

	Block.prototype.render = function (template, data, callback) {
		var templateData = {};
		// имя шаблона состоит из названия директории блока + названия файла шаблона,
		// например 'b-header/b-header'
		template = template || (this.name + '/' + this.name);

		if (!dust.cache[template]) {
			throw new Error('There is no template with name `' + this.name + '`! :(');
		}

		templateData.i18n = window.i18n[this.name];
		templateData.data = data;

		// если коллбека нет, берём дефолтный
		callback = callback || ((err, html) => {
			if (err) {
				throw err;
			}

			this.node = $.replace(html, this.node);

			// смотрим, есть ли внутри сгенерённого блока другие блоки
			$.initBlocks(this.node);
		});

		dust.render(template, templateData, callback);
	};

	// Различные "базовые" методы
	window.$ = {
		// поиск элементов
		find: function (selector, node) {
			node = node || window.document;

			if (typeof(node) === 'string') {
				node = $.find(node);
			}

			return [].slice.call(node.querySelectorAll(selector));
		},
		// замена элемента на новый, созданный из html-строки
		replace: function (html, destination) {
			var e = document.createElement('div'),
				createdBlock;

			e.innerHTML = html;

			createdBlock = e.firstChild;
			destination.parentNode.replaceChild(createdBlock, destination);

			return createdBlock;
		},
		// Инициализация блоков
		initBlocks: function (node) {
			var blockList = [];

			$.find('.js-block', node).forEach(function (node) {
				try {
					(new Block(node)).init();
				} catch (e) {
					console.error(e);
				}
			});
		},
		// Регистрация блока
		register: function (name, block) {
			BlockTypes[name] = block;
		},
		// jsonp-запросы
		getJSONP: function (url, callbackName, callback) {
			var script = document.createElement('script');

			url += '&callback=' + callbackName;
			script.setAttribute('src', url);

			window[callbackName] = callback;

			document.body.appendChild(script);
		}
	};

	// локализация
	window.i18n = {};
}(window));