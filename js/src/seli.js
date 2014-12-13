/**
 *
 * selie.js - Lightly wrapping native js functionality.
 *
 * Copyright (c) 2014 Trey Tacon (ttacon@gmail.com)
 * Licensed under the MIT License (see LICENSE file).
 *
 * Created 13/12/2014
 */

// for now we'll attach to the window cause i'm lazy
(function(window, document) {


	if (!(CustomEvent)) {
		(function (window) {
			function CustomEvent ( event, params ) {
				params = params || {
					bubbles: true,
					cancelable: false,
					detail: undefined
				};
				var evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent(
					event, params.bubbles, params.cancelable, params.detail );
				return evt;
			}

			CustomEvent.prototype = window.Event.prototype;
			window.CustomEvent = CustomEvent;
		})(window);
	}


	// we need to consider a node cache, for equality (i.e. we don't
	// wrap the same DOM node more than once, which we currently do do)
	var SelieEle = function(el) {
		this.el = el;
	};

	SelieEle.prototype = {
		addClass: function(c) {
			// TODO(ttacon): do it
		},
		after: function(htmlString) {
			// TODO(ttacon): do it
		},
		append: function(el) {
			// TODO(ttacon): do it
		},
		before: function(htmlString) {
			// TODO(ttacon): do it
		},
		children: function() {
			// TODO(ttacon): do it
			var ra = this.el.children, vals = [];

			// wrap them as $eles
			for (var i=0; i < ra.length; i++) {
				vals.push(new SelieEle(ra[i]));
			}
			return vals;
		},
		clone: function() {
			// TODO(ttacon): do it
		},
		contains: function(child) {
			// TODO(ttacon): do it
		},
		each: function(func) {
			// TODO(ttacon): do it
		},
		empty: function() {
			// TODO(ttacon): do it
		},
		filter: function(filterFn) {
			// TODO(ttacon): do it
		},
		find: function(sel) {
			// TODO(ttacon): do it
		},
		attr: function(attr, val) {
			if (val) {
				return this.el.setAttribute(attr, val);
			}
			return this.el.getAttribute(attr);
		},
		html: function(val) {
			if (val) {
				this.el.innerHTML = val;
			}
			return this.el.innerHTML;
		},
		css: function(ruleName) {
			// NOTE(ttacon): we will not offer setting individual rules,
			// unless someone can give a convincing reason over using classes
			// perhaps, setting individual rules takes less time to rerender
			// for the browser than setting classes? more deps, children to check
			// in class case?
			return getComputedStyle(this.el)[rulename];
		},
		text: function(val) {
			// NOTE(ttacon): http://stackoverflow.com/questions/13172305/difference-between-text-and-textcontent-properties
			if (val) {
				this.el.textContent = val;
			}
			return this.el.textContent;
		},
		hasClass: function(clz) {

		},
		is: function(ele) {
			return this.el === ele;
		},
		matches: function(sel) {
			return matches(this.el, sel);
		},
		next: function() {
			return this.el.nextElementSibling;
		},
		offset: function() {
			var rect = this.el.getBoundingClientRect()
			return {
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft
			};
		},
		offsetParent: function() {
			return this.el.offsetParent || el;
		},
		outerHeight: function(withMargin) {
			var height = this.el.offsetHeight;
			if (withMargin) {
				var style = getComputedStyle(this.el);
				height += parseInt(style.marginTop) + parseInt(style.marginBottom);
			}
			return height;
		},
		outerWidth: function(withMargin) {
			var width = this.el.offsetWidth;
			if (withMargin) {
				var style = getComputedStyle(this.el);
				width += parseInt(style.marginLeft) + parseInt(style.marginRight);
			}
			return width;
		},
		parent: function() {
			return new SelieEle(this.el.parentNode);
		},
		position: function(relToViewport) {
			if (relToViewport) {
				return this.el.getBoundingClientRect();
			}
			return {
				left: this.el.offsetLeft,
				top: this.el.offsetTop
			};
		},
		prepend: function(el) {
			// should check if this is SelieEle or not
			return this.el.parentNode.insertBefore(el, this.el.parentNode.firstChild);
		},
		prev: function() {
			return this.el.previousElementSibling;
		},
		remove: function() {
			return this.el.parentNode.removeChild(this.el);
		},
		removeClass: function(className) {
			if (this.el.classList) {
				return this.el.classList.remove(className);
			}
			return this.el.className = this.el.className.replace(
				new RegExp('(^|\\b)' +
						   className.split(' ').join('|') +
						   '(\\b|$)', 'gi'),
				' ');
		},
		replaceWith: function(htmlString) {
			return this.el.outerHTML = htmlString;
		},
		siblings: function() {
			// TODO(ttacon): do it
		},
		toggleClass: function(clz) {
			// TODO(ttacon): do it
		},
		// events
		on: function(evnt, evntLstnr) {
			return this.el.addEventListener(evnt, evntLstnr);
		},
		off: function(evnt, evntLstnr) {
			return this.el.removeEventListener(evnt, evntLstnr);
		},
		trigger: function(evnt, data) {
			var eve = undefined;
			if (data) {
				// assume custom event
				eve = new CustomEvent(evnt, data);
			} else {
				// more specific event constructors?
				// not sure about this...?
				eve = new Event(evnt);
			}
			this.el.dispatchEvent(eve);
		}
	};

	var matches = function(el, selector) {
		return (el.matches || el.matchesSelector ||
				el.msMatchesSelector || el.mozMatchesSelector ||
				el.webkitMatchesSelector ||
				el.oMatchesSelector
			   ).call(el, selector);
	};


	// a couple useful helpers
	var extend = function(e0, e1) {
		for (var prop in e1) {
			if (!(e0[prop])){
				e0[prop] = e1[prop];
			}
		}
		return e0;
	};

	// extend doesn't overwrite existing properties, merge clobbers them
	var merge = function(e0, e1) {
		for (var prop in e1) {
			e0[prop] = e1[prop];
		}
		return e0;
	};

	var $s = {
		find: function(sel, cntxt) {
			// for now not supporting context

			// for now we need to hide some attrs
			var el = document.querySelector(sel);
			return new SelieEle(el);
		},
		create: function(ele) {
			
		},
		contains: function(el, child) {

		},
		ready: function(fn) {
			document.addEventListener('DOMContentLoaded', fn());
		}
	};

	window.$s = $s;

})(window, document);
