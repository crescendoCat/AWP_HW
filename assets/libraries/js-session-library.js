/**
 * Implements cookie-less JavaScript session variables
 * v1.0
 *
 * By Craig Buckler, Optimalworks.net
 *
 * As featured on SitePoint.com
 * Please use as you wish at your own risk.
*
 * Usage:
 *
 * // store a session value/object
 * Session.set(name, object);
 *
 * // retreive a session value/object
 * Session.get(name);
 *
 * // clear all session data
 * Session.clear();
 *
 * // dump session data
 * Session.dump();
 */
 
if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function() {
 
	// window object
  var win = window.top || window;
	
	// session store
  var store = (win.name ? JSON.parse(win.name) : {});
	
	// save store on page unload
	function Save() {
		win.name = JSON.stringify(store);
	};
	
	// page unload event
	if (window.addEventListener) window.addEventListener("unload", Save, false);
	else if (window.attachEvent) window.attachEvent("onunload", Save);
	else window.onunload = Save;

	// public methods
	return {
	
		// set a session variable
		set: function(name, value) {
			store[name] = value;
    },

    // add a single item to a session variable(array)
    add: function(name, item) {
      if(!store[name]) {
        store[name] = item;
      } else {
        store[name].push(item);
      }
    },
    
    // add items to a session variable(array)
    add_items: function(name, items_arr) {
      if(!store[name]) {
        store[name] = items_arr;
      } else {
        for(var i in items_arr) {
          store[name].push(items_arr[i]);
        }
      }
    },
		
		// get a session value
		get: function(name) {
			return (store[name] ? store[name] : undefined);
		},
		
		// clear session
		clear: function() { store = {}; },
		
		// dump session data
		dump: function() { return JSON.stringify(store); }
 
	};
 
 })();