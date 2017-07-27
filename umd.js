(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.a = factory());
}(this, (function () { 'use strict';

var ADIV = function ADIV () {};

ADIV.prototype.text = function text (str) {
	if(str !== undefined) {
		this.el.textContent = str;
	} else {
		return this.el.textContent;
	}
};

ADIV.prototype.toBody = function toBody () {
	document.body.appendChild( this.el );
	return this;
};

ADIV.prototype.add = function add (child) {
	this.el.appendChild(child.el);
	return this;
};

ADIV.prototype.empty = function empty () {
	this.el.innerHTML = '';
};

ADIV.prototype.q = function q (selector) {
	return this.el.querySelector( selector )._adiv_;
};

ADIV.prototype.parent = function parent () {
	return this.el.parentElement._adiv_;
};

ADIV.prototype.on = function on (type, cb) {
	var self = this;
	this.el.addEventListener(type, function(e) {
		cb.apply( self, [ e ] );
	}, true);
	this.lastEventType = type;
	return this;
};

ADIV.prototype.trigger = function trigger (type) {
	if(!this.el.parentNode) {
		var self = this;
		setTimeout( function() {
			self.trigger(type);
		},0);
		return this;
	}
	if(!type) { type = this.lastEventType; }
	var evt = new Event(type, { 'bubbles': true, 'cancelable': true });
	this.el.dispatchEvent(evt);
	return this;
};

function a(tag,args) {
	var el = document.createElement(tag);
	var e = new ADIV();
	e.el = el;
	el._adiv_ = e;

	var args = [].slice.call(arguments);
	args.shift();
	args.forEach( function(a) {
		if(typeof(a) === 'function') {
			var result = a.toString().match(/ ([^\(]+)\(/);
			if(result && result.length==2 && result[1].length>0) {
				e[ result[1] ] = a;
			}
		}
		if( typeof(a) === 'string') {
			el.appendChild( document.createTextNode(a) );
		} else {
			if(a.toBody) {
				e.add(a);
			} else {
				for(var i in a) {
					el.setAttribute( i, a[i]);
				}
			}
		}
	});
	return e;
}

[ 'div', 'p', 'span', 'a',
	'input', 'label', 'button',
	'ul', 'ol', 'li'
].forEach( function(tag) {
	a[tag] = function(args) {
		var args = [].slice.call(arguments);
		args.unshift(tag);
		return a.apply( null ,args );
	};
});

return a;

})));
