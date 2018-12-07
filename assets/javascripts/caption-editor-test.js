var MYAPP = MYAPP || {};

MYAPP.namespace = function(ns_string) {
    // MYAPP.modules.module1
 
    var parts = ns_string.split('.'),
        parent = MYAPP,
        i;
 
    // strip MYAPP, leading global
    if (parts[0] === 'MYAPP') {
        parts = parts.slice(1);
    }
 
    for (i=0; i<parts.length; i++) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}
MYAPP.CaptionEditor = {};
MYAPP.CaptionEditor.oldAttribute = 'oldAttribute';

MYAPP.namespace('MYAPP.ToolBox');

MYAPP.ToolBox = ({
  addListener: null,
  removeListener: null,
  searchInCaption: function (caption, value) {
    // initial values for start, middle and end
    var ret;
    caption.forEach(function(element, index) {
        if(element.start <= value && value < element.end) {
          ret = element.seq;
        }
      }
    );
    if(ret === undefined) {
      return -1;
    } else {
      console.log(ret);
      return ret;
    }
  },

  init: function() {
    if (typeof window.addEventListener === "function") { // modern browsers
      this.addListener = function(el, eventType, fn) {
        el.addEventListener(eventType, fn);
      };
      this.removeListener = function(el, eventType, fn) {
        el.removeEventListener(eventType, fn)
      };
    } else if (typeof document.attachEvent === "function") { // IE 8 and lower
      this.addListener = function(el, eventType, fn) {
        el.attachEvent('on' + eventType, fn);
      };
      this.removeListener = function(el, eventType, fn) {
        el.detachEvent('on' + eventType, fn);
      };
    } else { // if they don't support methods above then:
      this.addListener = function(el, eventType, fn) {
        el['on' + eventType] = fn;
      };
      this.removeListener = function(el, eventType, fn) {
        el['on' + eventType] = undefined;
      };
    }
    return this;
  }
}).init();


MYAPP.namespace('MYAPP.Exception');


MYAPP.Exception = function(message) {
   this.message = message + "\n trace back: " + new Error().stack;
   this.name = 'MyappException';
};

MYAPP.namespace('MYAPP.TimeStamp');

MYAPP.TimeStamp = (function() {
  var Constr,
      debug,
      _debug = function(msg) {
        //debug += '\n' + msg;
      }
      ;

  Constr = function(second) {
    debug = '';
    //checking the second's type
    if(typeof(second) === "string") { // it will be a string of time, or just a number in string
      //_debug('in string');
      var reg_patt_float = /([+]?([0-9]*[.])?[0-9]+)/; // we only applies positive number
      var reg_patt = /[0-9]*:?[0-9]*:[0-9]*\.?[0-9]*/;
      if(reg_patt.test(second) == true) {
        //_debug('is time stamp style string');
        var parts = second.split(':');
        this.seconds = 0;
        var scale = 1;
        for(var i = parts.length; i--; i>=0) {
          _debug(i + ', ' + parts[i]);
          this.seconds += parts[i] * scale;
          scale *= 60;
        }
        //_debug('transform outcome: ' + this.seconds);
      } else if(reg_patt_float.test(second) == true) {
        //_debug('is float style string');
        this.seconds = parseFloat(second);
      } else {
        this.seconds = 0.0;
        //throw new MYAPP.Exception('Time stamp consturctor cannot identify this string: ' + second);
      }
    } else if(typeof(second) === "number") {
      //_debug('is number');
      this.seconds = second;
      //console.log(this.seconds);
    } else if(second instanceof MYAPP.TimeStamp) {
      //_debug('is TimeStamp');
      this.seconds = second.valueOf();
    }
    this.debug = debug;
  };

  Constr.prototype.valueOf = function() {
    return this.seconds;
  };

  Constr.prototype.toString = function() {
    return MYAPP.TimeStamp.millisToTimeString(this.seconds*1000);
  };

  return Constr;
})();

  /* translate 00:00.0 to a number in millisecond
   */
MYAPP.TimeStamp.timeStringToMillis = function(string) {
      var parts = string.split(':');
      var ret = 0;
      var scale = 1;
      for(var i = parts.length; i--; i>=0) {
        ret += parts[i] * scale;
        scale *= 60;
      }
      return ret;
}


MYAPP.TimeStamp.millisToTimeString = function(millis) {
    var d = new Date(millis),
        n = d.toISOString();
    
    //ISO time string will looks like 1970-01-01T00:00:00.012Z
    return n.substr(-10, 7);
}

MYAPP.CaptionEditor = (function() {
  //shorten the variable name
  var tool = MYAPP.ToolBox;
  var TStamp = MYAPP.TimeStamp;


  var 
  Constr,
  _caption,
  _div,
  _divNode,
  _highlightedList,
  _caption_id,
  _player,
  _id,
  _player_div,
  _video_time,
  _events,
  _max_seq,
  _caption_area_node;


  Constr = function(div, config) {
  }
    Constr.prototype = {
    getCaptionCount: captionCount,
    configureYoutubePlayer: configureYoutubePlayer,
    captionId: function() {
      return _caption_id;
    },
    loadCaption: _loadCaption
  }

  return Constr;
})();