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

		// глобальный эвент для переключения языка
		this.listen('switch-lang', (lang) => {
			this.destroy();
			this.init();
		});
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

	Block.prototype.getLangData = function () {
		window.i18nSelected = window.i18nSelected || $.getParam('lang') || 'ru';

		return window.i18n[window.i18nSelected][this.name];
	};

	Block.prototype.render = function (template, data, callback) {
		var templateData = {};

		// имя шаблона состоит из названия директории блока + названия файла шаблона,
		// например 'b-header/b-header'

		if (typeof(template) === 'function') {
			callback = template;
			template = undefined;
			data = undefined;
		}

		if (typeof(data) === 'function') {
			callback = data;
			data = undefined;
		}

		if (typeof(template) === 'object') {
			data = template;
			template = undefined;
		}

		template = template || (this.name + '/' + this.name);

		if (!dust.cache[template]) {
			throw new Error('There is no template with name `' + this.name + '`! :(');
		}

		templateData.i18n = this.getLangData();
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

	Block.prototype.destroy = function () {
		this.handlers = {};
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
		addClass: function (node, classToAdd) {
			var classes = node.className.replace(/\s+/g, ' ').split(' ');

			if (classes.indexOf(classToAdd) === -1) {
				classes.push(classToAdd);
				classes = classes.join(' ');

				node.className = classes;
			}
		},
		removeClass: function (node, classToRemove) {
			var currentClassName = node.className,
				classes = currentClassName.replace(/\s+/g, ' ').split(' ');

			classes = classes.filter(function (className) {
				if (className === classToRemove) {
					return false;
				}

				return true;
			});

			classes = classes.join(' ');
			if (classes !== currentClassName) {
				node.className = classes;
			}
		},
		trigger: function (element, event) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, false, true);
			element.dispatchEvent(evt);
		},
		bind: function (nodes, event, handler) {
			if (typeof(nodes) === 'string') {
				nodes = $.find(nodes);
			}

			if (!(nodes instanceof Array)) {
				nodes = [nodes];
			}

			nodes.forEach(function (node) {
				node.addEventListener(event, handler, false);
			});
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
		},
		getJSON: function (url, callback) {
			var request = new XMLHttpRequest();

			request.open('GET', url, true);

			request.onload = function () {
				try {
					response = JSON.parse(request.responseText);
				} catch (e) {
					response = request.responseText;
				}

				callback(response);
			};

			request.onerror = function () {
				callback();
			};

			request.send(null);

			return request;
		},
		getParam: function (paramName) {
			var params = window.location.search.split('?')[1],
				result;

			if (!params) {
				return;
			}

			params = params.split('&');
			if (!params) {
				return;
			}

			params.forEach(function (param) {
				param = param.split('=');

				if (param[0] === paramName) {
					if (result) {
						if (!(result instanceof Array)) {
							result = [result];
						}

						result.push(param[1]);
					} else {
						result = param[1];
					}
				}
			});

			return result;
		},
		wordEnd: function (word, num) {
			//word = ['секунд','секунды','секунда']
			var num100 = num % 100;

			if (num === 0) {
				return typeof(word[3]) !== 'undefined' ? word[3] : word[0];
			}
			if (num100 > 10 && num100 < 20) {
				return word[0];
			}
			if ((num % 5 >= 5) && (num100 <= 20)) {
				return word[0];
			} else {
				num = num % 10;
				if (((num >= 5) && num <= 9) || (num === 0)) {
					return word[0];
				}
				if ((num >= 2) && (num <= 4)) {
					return word[1];
				}
				if (num === 1) {
					return word[2];
				}
			}
			return word[0];
		},
		parseTime: function (date) {
			function addZero (value) {
				var intValue = parseInt(value, 10);

				if (intValue && intValue < 10) {
					return '0' + intValue;
				}

				return value;
			}

			return [
				addZero(date.getHours()),
				addZero(date.getMinutes()),
				addZero(date.getSeconds())
			].join(':');
		},
		saveData: function (name, data) {
			data = JSON.stringify(data);
			window.localStorage.setItem(name, data);
		},
		restoreData: function (name) {
			var data = window.localStorage.getItem(name);

			return JSON.parse(data);
		}
	};

	// локализация
	window.i18n = {
		ru: {
			langName: 'Русский'
		},
		en: {
			langName: 'English'
		}
	};
}(window));