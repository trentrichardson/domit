/*! domit - v1.0.0
* https://github.com/trentrichardson/domit
* Copyright (c) 2015 Trent Richardson; Licensed MIT */
(function() {
	"use strict";

	/**
	* @var _ A utility object for internal use only.
	*/
	var _ = {
		/**
		* @var bool - use animations or not (useful for testng)
		*/
		fx: true,

		/**
		* query - query the document for elements
		* @param selector String - css selector
		* @param scope Element - Dom element to search from
		* @return Class - selector class with properties to manipulate collection of elements
		*/
		query: function(selector, scope){
			
			/**
			* Sel - a mini selector object with built in methods to traverse nodes
			* @param selector String, NodeList, Node - css selector, a node list, or a single element
			* @param scope Element - Dom element to search from
			* @return Class - selector class with properties to manipulate collection of elements
			*/
			var Sel = function(selector, scope){
				var nl;
				this.scope = scope || document;
				this.nodes=[];

				if(typeof selector === 'string'){ // either an html string or css selector
					nl = (selector[0] === '<') ? (function(){
							var dv = document.createElement('div');
							dv.innerHTML = selector;
							return document.createDocumentFragment().appendChild(dv).childNodes;
						})() : this.scope.querySelectorAll(selector);
				}
				else{ // a Node or NodeList was passed in
					nl = selector.length !== undefined ? selector : [selector];
				}

				// convert the nodelist to a native array
				for(var i = nl.length; i--; this.nodes.unshift(nl[i])){}
				this.length = this.nodes.length;
				return this;
			};

			/**
			* Sel.find - selector functionality for the current collection of nodes
			* @param selector String - css selector
			* @return Class - returns a new Sel class instance of found nodes
			*/
			Sel.prototype.find = function(selector){
				return new Sel(selector, this.nodes[0]);
			};

			/**
			* Sel.attach - attach the collection of elements to a parent element
			* @param parent Node - an html node element to attach to
			* @param how String - append or prepend
			* @param where Node - Node to insert the new node before
			* @return Class - returns a new Sel class instance of found nodes or null
			*/
			Sel.prototype.attach = function(parent, how, where){
				var t = this, j;
				return t.each(function(i,el){
					j = how === 'append'? parent.appendChild(el) : parent.insertBefore(el, where || parent.firstChild);
				});
			};

			/**
			* Sel.neighbor - get the sibling element, not necessarily in the Sel collection but the overall dom
			* @param where String - previous or next
			* @return Class - returns a new Sel class instance of found nodes or null
			*/
			Sel.prototype.neighbor = function(where){
				return new Sel(this.nodes[0][where +'Sibling']);
			};

			/**
			* Sel.each - loop over each element in the collection
			* @param fn Function - the callback function for each node
			* @return Class - returns this Sel class instance
			*/
			Sel.prototype.each = function(fn){
				var t = this;
				for(var i=0; i<t.nodes.length; i++){
					fn.apply(t.nodes[i], [i, t.nodes[i]]);
				}
				return t;
			};

			/**
			* Sel.data - get/set the data properties on all nodes in collection
			* @param props String, Object - string of property name to get, a hash of key/values to set
			* @return Class - returns this Sel class instance or value when using get
			*/
			Sel.prototype.data = function(props){
				return (typeof props === 'string' && this.nodes.length > 0) ?
					this.nodes[0].getAttribute('data-'+props) :
					this.each(function(i, el){
						for(var k in props){
							if(props.hasOwnProperty(k)){
								el.setAttribute('data-'+k, props[k]);
							}
						}
					});
			};

			/**
			* Sel.offset - get the offset of an element from the overall document x/y
			* @return Object - {x: 123, y: 123} relative to the document, not the parent
			*/
			Sel.prototype.offset = function(){
				var el = this.nodes[0],
					ret = { x:0, y:0 };

				do {
					ret.x += isNaN(el.offsetLeft) ? 0 : el.offsetLeft;
					ret.y += isNaN(el.offsetTop) ? 0 : el.offsetTop;
				} while(el = el.offsetParent);

				return ret;
			};

			/**
			* Sel.css - get/set the css properties on all nodes in collection
			* @param props String, Object - string of property name to get, a hash of key/values to set
			* @return Class - returns this Sel class instance or value when using get
			*/
			Sel.prototype.css = function(props){
				return (typeof props === 'string' && this.nodes.length > 0) ?
					this.nodes[0].style[props] :
					this.each(function(i, el){
						for(var k in props){
							if(props.hasOwnProperty(k)){
								el.style[k] = props[k];
							}
						}
					});
			};

			/**
			* Sel.class - work with class names on all nodes in collection
			* @param action String - has, add, delete 
			* @param cls String - the class name to add, delete, has
			* @return Class/Boolean - returns this Sel class instance, when action="has" will return boolean
			*/
			Sel.prototype.cls = function(action, cls){
				var findre = new RegExp("\\b"+ cls +"\\b", 'i');
				return action === 'has' ? 
					findre.test(this.nodes[0].className) :
					this.each(function(i, el){
						el.className = el.className.replace(findre, " ");
						if(action === 'add'){
							el.className += ' '+ cls;
						}
					});
			};

			/**
			* animate the collection of elements
			* @param props Object - key/value pairs of css properties to animate to
			* @param duration Int - milliseconds to animate
			* @param fn Function - callback when done
			* @return Class - returns this Sel class instance
			*/
			Sel.prototype.animate = function(props, duration, fn){
				var raf,
					t = this,
					start,
					progress,
					percent,
					fromprops={},
					animloop = function(time){
							var tmp = {};
							start = start || time;
							progress = time - start;
							percent = duration === 0 ? 1 : (progress / duration);

							for(var k in fromprops){
								tmp[k] = (props[k]-fromprops[k]) * percent;
							}
							t.css(tmp);

							if(progress < duration){
								window.requestAnimationFrame(animloop);
							}
							else{
								window.cancelAnimationFrame(raf);
								t.css(props);
								if(fn){fn.call(t);}
							}
						};

					for(var k in props){
						fromprops[k] = t.css(k) || 0;
					}

					// we need to look for an animation flag so this can be turned off 
					if(_.fx || duration > 0){
						raf = window.requestAnimationFrame(animloop);
					}
					else{
						t.css(props);
						if(fn){fn.call(t);}
					}

				return this;
			};

			/**
			* Sel.serialize - serialize the collection's form fields into an object
			* @return Object - keys are field names, values are field values
			*/
			Sel.prototype.serialize = function(){
				var ret = {};
				this.find('input,select,textarea,button').each(function(i,el){
					var n = el.name,
						v = el.value,
						tag = el.tagName.toLowerCase();

					// checkboxes are always an array, only append if checked
					if(tag === 'input' && el.type === 'checkbox'){
						ret[n] = ret[n] || [];
						if(el.checked){
							ret[n].push(v);
						}
					}
					// radio is never an array, set only if checked
					else if(tag === 'input' && el.type === 'radio'){
						if(el.checked){
							ret[n] = v;
						}
					}
					// select multiple is always an array, append only selected options
					else if(tag === 'select' && el.multiple){
						ret[n] = [];
						new Sel('option[selected]',el).each(function(i,oel){
							ret[n].push(oel.value);
						});						
					}
					// else standard input or select, convert to array if mulple with same name
					else{
						if(typeof ret[n] === 'object'){
							ret[n].push(v);
						}
						else if(ret[n] !== undefined){
							ret[n] = [ret[n], v];
						}
						else{
							ret[n] = v;
						}
					}
				});
				return ret;
			};
			
			/**
			* Sel.on - attach an event to the node collection
			* @param type String - name of the event to attach
			* @param fn Function - the event handler function
			* @return Class - returns this Sel class instance
			*/
			Sel.prototype.on = function(type, fn){
				return this.each(function(i, el){
					el[ el.addEventListener? 'addEventListener' : 'attachEvent'](type, fn, (type === 'blur' || type === 'focus'));
				});
			};

			/**
			* Sel.off - remove an event from the node collection
			* @param type String - name of the event to attach
			* @param fn Function - the event handler function
			* @return Class - returns this Sel class instance
			*/
			Sel.prototype.off = function(type, fn){
				return this.each(function(i, el){
					el[ el.removeEventListener? 'removeEventListener' : 'detachEvent'](type, fn, (type === 'blur' || type === 'focus'));
				});
			};

			/**
			* Sel.trigger - trigger an event to the node collection
			* @param type Event/string - name of the event trigger or an Event object
			* @param isCustom bool - whether this is a custom event or native
			* @return Class - returns this Sel class instance
			*/
			Sel.prototype.trigger = function(ev, isCustom){
				var j;
				ev = (typeof ev === 'string')? _.event(ev) : ev;
				return this.each(function(i, el){
					j = el.dispatchEvent ? el.dispatchEvent(ev) : el.fireEvent((isCustom ? 'on' : '')+ ev.type, ev);
				});
			};
			
			return new Sel(selector, scope);
		}, 

		/**
		* Build a new event object
		* @param name string - name of the event. Do not include "on" ex: "onclick"
		* @param data object - any data to include into the event
		* @return Event - A native event object
		*/
		event: function(name, data){			
			var evt = (typeof Event === 'function')? new Event(name) : (function(){
					var mouse=/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/.test(name),
						evt = document.createEvent(mouse ? 'MouseEvents':'HTMLEvents');
					evt[mouse ? 'initMouseEvent':'initEvent'](name, true, true);
					return evt;
				})();
			
			for(var i in data){
				evt[i] = data[i];
			}
			return evt;
		}
		
	};


	(function() {
		// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

		// requestAnimationFrame polyfill by Erik Möller
		// fixes from Paul Irish and Tino Zijdel
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame){
			window.requestAnimationFrame = function(callback) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!window.cancelAnimationFrame){
			window.cancelAnimationFrame = function(id) { clearTimeout(id); };
		}
	}());

	
	/**
	* Make this available externally
	*/
	if (typeof module !== 'undefined') {
		module.exports = _;
	} else if (typeof define === 'function' && define.amd) {
		define([], _);
	}
	if (window && window.domit === undefined){
		window.domit = _;
	}
}());
