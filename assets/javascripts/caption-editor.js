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


// The function class which contains some tool functions
// used in editor class
MYAPP.ToolBox = ({
  addListener: null,
  removeListener: null,

  // find a specific caption by a time
  /*
   * input- 
   * caption: the caption array
   * value: time
   */
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

  // init time branching on listener attaching function
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


// my own exception event
// now is unused
MYAPP.namespace('MYAPP.Exception');


MYAPP.Exception = function(message) {
   this.message = message + "\n trace back: " + new Error().stack;
   this.name = 'MyappException';
};

// Time stamp class
// using in convert from string-type time stamp to number
// and vice versa
MYAPP.namespace('MYAPP.TimeStamp');

MYAPP.TimeStamp = (function() {
    var Constr,
        debug,
        _debug = function(msg) {
          //debug += '\n' + msg;
        }
        ;


    // when creating a TimeStamp instance
    // I convert the input value (string or number)
    // to a type
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


// main class
MYAPP.namespace('MYAPP.CaptionEditor');

//console.log('after namespace: ' + MYAPP.CaptionEditor.oldAttribute);

MYAPP.CaptionEditor = (function() {
  //shorten the variable name
  var tool = MYAPP.ToolBox;
  var TStamp = MYAPP.TimeStamp;


  var 
  Constr,
  _caption,
  _div,
  _div_node,
  _highlightedList,
  _caption_id,
  _player,
  _id,
  _player_div,
  _video_time,
  _events,
  _max_seq,
  _caption_area_node,

  captionCount = function(){
    return this.caption.length;
  },


  //this function will return a structure that
  //using 'seq' as index to read/write the caption
  //record
  createCaptionLines = function(div, caption) {
    console.log(new Error().stack);
    if(window.jQuery) {

    } else {
      alert('Please include jquery apendencies to make sure CaptionEditor running well!');
      return;
    }
    var frag = document.createDocumentFragment();
    if(caption === undefined) {
      frag.appendChild(_singleLineHTML({
        start: 0,
        end  : 2,
        content: ''
      }));
    } else {
      var count = caption.length;
      var caption_ret = [];

      _max_seq = 0;
      for(var i=0; i<count; i++) {
        var start = new TStamp(caption[i].start);
        var dur = new TStamp(caption[i].dur);
        var end = new TStamp(start + dur);
        caption[i].start = start.valueOf();
        caption[i].dur = dur.valueOf();
        caption[i].end = end.valueOf();
        frag.appendChild(_singleLineHTML(caption[i]));
        if(parseInt(caption[i].seq) > _max_seq) {
          console.log(caption[i].seq);
          _max_seq = parseInt(caption[i].seq);
        }
        //store the caption record into the structure
        caption_ret[caption[i].seq] = caption[i];
      }
    }
    jQuery(frag).appendTo(div);
    console.log("max_seq: "+_max_seq);
    return caption_ret;
  },


/* conf = {
 *   start:   number
 *   dur:     number
 *   content: string
 *   seq:     number
 */
  _singleLineHTML = function(conf) {
    var card = document.createElement('div');
        content = "\
    <div class='card-body editor-line-body d-flex'>\
      <div class='d-flex flex-column mr-auto col-3 col-lg-2 editor-timestamp-container'>\
        <span class='editor-line-time-span'>\
          <input type='text' class='editor-time-input' id='start-time' value='00:00.0' row></input>\
        </span>\
        <span class='editor-line-time-span'>\
          <input type='text' class='editor-time-input' id='end-time' value='00:00.0'></input>\
        </span>\
      </div> \
      <textarea class='editor-line-text d-flex col-6 col-lg-9' id='line-text' placeholder='輸入字幕'>" + conf.text + "</textarea>\
      <div class='d-flex flex-column col-3 col-lg-1'> \
        <button class='btn btn-danger' id='btn-delete'>x</button>\
        <button class='btn btn-light' id='btn-add'>+</button>\
      </div>\
    </div>";
    card.setAttribute('class', 'card shadow mt-2 editor-line');
    card.setAttribute('id', 'cap_' + conf.seq);
    card.innerHTML = content;
    _setTime(card, conf.start, conf.end);
    return card;
  },



  // to test a DOM node is a "card" of caption or not
  _isCard = function(card) {
    if(card === undefined || card === null || !card.classList.contains('editor-line')) {
      return false;
    } else {
      return true;
    }
  },


  _setTime = function(card, start, end) {
    if(!_isCard(card)) {
      //throw new EditorException('unknow card element');
      return;
    }
    var start_t = new TStamp(start);
    var end_t = new TStamp(end);
    card.querySelector('#start-time').value = start_t.toString();
    card.querySelector('#end-time').value = end_t.toString();
  },


  _getTime = function(card) {
    if(!_isCard(card)) {
      //throw new EditorException('unknow card element');
      return {start:'00:0.0', end: '00:0.0'};
    }
    return {
      start: card.querySelector('#start-time').value,
      end:   card.querySelector('#end-time').value
    };
  },


  _getSeq = function(card) {
    if(_isCard(card)) {
      return;
    } else {
      return card.getAttribute('seq');
    }
  },



  // set a caption card as highlight
  _setFocusAndHighlight = function(card) {
      if(card === undefined) {
          return;
      }

      if(card.classList === undefined || !card.classList.contains('editor-line')) {
          return;
      }
      // make sure there is exactly one caption are highlighted
      for(var i=0; i<_highlightedList.length; i++) {
         _highlightedList[i].classList.remove('editor-line-body-highlight');
      }
      _highlightedList = [];
      card.classList.add('editor-line-body-highlight');
      //console.log(_caption_area_node);
      // show the caption to the screen
      if(_caption_area_node !== undefined && _caption_area_node !== null) {
         _caption_area_node.innerHTML = card.querySelector('#line-text').value;
      }
      _highlightedList.push(card);
  },


  // insert a caption card after a spceific caption card
  _insertLineAfter = function(target, conf) {
    var card = _findParentCard(target);
    var card_time = _getTime(card);
    var end_time;
    if(conf.start === undefined) {
      conf.start = TStamp.timeStringToMillis(card_time.end);
    } else {
      var start = new TStamp(conf.start);
      conf.start = start.valueOf();
    }
    if(conf.end === undefined) {
      var millis = TStamp.timeStringToMillis(card_time.end);
      // check if this line has a sibling after itself,
      // if no, we can set the time as we like.
      if(card.nextSibling === undefined || card.nextSibling === null) {
        conf.end = millis + 2;
      } else {
        // if the card has a sibling, check the sibling's starting time.
        var next_time = _getTime(card.nextSibling);
        var next_start_millis = TStamp.timeStringToMillis(next_time.start);
        if(millis + 2 >= next_start_millis) {
          end_time = next_start_millis;
        } else {
          end_time = millis + 2;
        }
        conf.end = end_time;
      }
    } else {
      var end = new TStamp(conf.end);
      conf.end = end.valueOf();
    }
    if(conf.end - conf.start < 0) {
      alert('字幕長度不可為負!');
      return -1;
    }
    console.log(conf);
    if(conf.end - conf.start < 0.1) {
      alert('字幕長度不可小於0.1秒!');
      return -1;
    }
    if(conf.text === undefined) {
      conf.text = '';
    }
    conf.seq = ++_max_seq;
    conf.dur = conf.end - conf.start;
    var line = _singleLineHTML(conf);
    var new_node = _div_node.insertBefore(line, card.nextSibling);
    $(new_node.querySelector('.editor-time-input')).change(_timeInputChangedHandler);
    $(new_node.querySelector('#line-text')).change(_textInputChangedHandler);   
    _caption[conf.seq] = conf;
    _captionInsertedEventHandler(card, conf);   //execute the call back routine
    return new_node;
  },


  // if the node is a inner element in the card 
  // find the reference of the parent of the node
  _findParentCard = function(node) {
    while(!node.classList.contains('editor-line')) {
      node = node.parentNode;
    }
    return node;
  },


  // find the specific caption in _caption array
  // by passing a DOM node
  _findCardCaption = function(card) {
    if(_isCard(card)) {
      // since the id attribute is like 'cap-xx', and the 'xx' part
      // is the id number
      return _caption[card.getAttribute('id').slice(4)];
    } else {
      return null;
    }
  },


  // the delegating function of the editor division
  _divClickHandler = function(e) {
    var src, parts;
    // get event and source element
    e = e || window.event;
    src = e.target || e.srcElement;
    // actual work: update label

    //console.log(src.classList.contains('editor-line'));
    //console.log(e);

    var card = _findParentCard(src);
    if(_isCard(card)) {
      _setFocusAndHighlight(card);
      if(_player !== undefined) {
        //console.log(_getTime(card).start);
        _player.seekTo(new TStamp(_getTime(card).start).valueOf(), true);
      } 
    }

    if(src.id === "btn-delete") {
      _captionDeletedEventHandler(card, _findCardCaption(card));
      
      console.log(_caption.splice(card.getAttribute('id').slice(4), 1));
      card.remove();
    } else if(src.id === "btn-add") {
      _insertLineAfter(src, {});
    }

    // no bubble
    if (typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    if (typeof e.cancelBubble !== "undefined") {
      e.cancelBubble = true;
    }
    // prevent default action
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (typeof e.returnValue !== "undefined") {
      e.returnValue = false;
    }
  },

  _divKeyUpHandler = function(e) {
    var src, parts;
    // get event and source element
    e = e || window.event;
    src = e.target || e.srcElement;
    // actual work: update label

    //console.log(src.selectionStart, src.value);

    if(src.id === "line-text") {
      if(e.key === "Enter" && !e.shiftKey) {
        var line_text = src.value;
        var new_content = line_text.slice(src.selectionStart);
        console.log(new_content);
        var new_node = _insertLineAfter(src, {
          text: new_content
        });
        if(new_node !== -1) { // insertion success, change the original value
          src.value = line_text.slice(0, src.selectionStart-1);
          var new_line_text = new_node.querySelector("#line-text");
          new_line_text.setSelectionRange(0, 0);
        }
      }
      if(src.value !== _findCardCaption(_findParentCard(src)).text) {
        //_textInputChangedHandler(_findParentCard(src));
      }
    }


    // no bubble
    if (typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    if (typeof e.cancelBubble !== "undefined") {
      e.cancelBubble = true;
    }
    // prevent default action
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (typeof e.returnValue !== "undefined") {
      e.returnValue = false;
    }
  },


  _onPlayerReady = function(event) {
    console.log(event);
    _video_time = _player.getCurrentTime();
    _player.playVideo();
    

    setTimeout(function() {
      _player.pauseVideo();
    }, 1000);


    setInterval(function() {
      var now_time = _player.getCurrentTime();
      //using current index
      if (! ((-0.005 > now_time - _video_time || now_time - _video_time > 0.005) ) ) {
          return;
      }
      //console.log(_caption);
      if (_caption === undefined) {
          return;
      }
      var index = tool.searchInCaption(_caption, now_time);
      if (index != -1) {  
            var cap_node      = _div_node.querySelector('#cap_'+index),
                topPos        = cap_node.offsetTop,
                parentHeight  = _div_node.parentNode.clientHeight,
                nodeHeight    = cap_node.clientHeight,
                scrollTop     = _div_node.parentNode.scrollTop;

          if (topPos < scrollTop || topPos > scrollTop + parentHeight - nodeHeight) {
              $(_div_node.parentNode).scrollTop(topPos - parentHeight + nodeHeight);
          }
          _setFocusAndHighlight(cap_node);
      } else {
          _caption_area_node.innerHTML = '';
      }

      _video_time = now_time;
    }, 100);
    console.log(_player.getPlayerState());
  },

  _onPlayerStateChange = function(event) {
    console.log(event.data);
  },


  configureYoutubePlayer = function(div, width, height) {
    this.player_div = div;
    console.log(div);
    _player = new YT.Player(div, {
        width: width,
        height: height,
        videoId: _id, //blcokchain 101:_160oMzblY8
        playerVars: { 'autoplay': 0, 'iv_load_policy': 3},
        events: {
            'onReady': _onPlayerReady,
            // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onStateChange': _onPlayerStateChange,
            // 'OnApiChange': 'onPlayerApiChange',
            // 'onError': onPlayerError
        }
    });
  },


  _captionInsertedEventHandler = function(target, conf) {
    //TODO: implement it later!
    if(_events.onCaptionInserted !== undefined && _events.onCaptionInserted !== null) {
      var event = {
        target: target,
        data:   conf
      }
      _events.onCaptionInserted(event);
    }
    return;
  },

  
  _captionUpdatedEventHandler = function(target, conf) {
    if(_events.onCaptionUpdated !== undefined && _events.onCaptionUpdated !== null) {
      var event = {
        target: target,
        data:   conf
      }
      _events.onCaptionUpdated(event);
    }
    return;
  },


  _captionDeletedEventHandler = function(target, conf) {
    if(_events.onCaptionDeleted !== undefined && _events.onCaptionDeleted !== null) {
      var event = {
        target: target,
        data:   conf
      }
      _events.onCaptionDeleted(event);
    }
    return;
  },


  _playVideo = function(start) {
    
    _player.seekTo(Number(startTime), true);
    _player.playVideo();
  },


  _timeInputChangedHandler = function() {
    //is there a better way to avoid those complex
    //time string->value/value->string casting?
    var card = _findParentCard(this);
    if(_isCard(card)) {
      //since id is encoded as cap_#id
      var cap_obj =  _findCardCaption(card);
      var prev_card_obj = _findCardCaption(card.previousSibling);
      var next_card_obj = _findCardCaption(card.previousSibling);
      var second = TStamp.timeStringToMillis(this.value);


      if(this.id === 'start-time') {
          if((_isCard(card.previousSibling) &&
              prev_card_obj.end > second) ||
              second > cap_obj.end) {
              this.value = TStamp.millisToTimeString(cap_obj.start*1000);
          } else {
              cap_obj.start = second;
              _captionUpdatedEventHandler(card, cap_obj);
          }


      } else if(this.id === 'end-time') {
          console.log(cap_obj.start);
          if((_isCard(card.nextSibling) &&
              next_card_obj.start < second) ||
              second < cap_obj.start) {
              this.value = TStamp.millisToTimeString(cap_obj.end*1000);
          } else {
              _captionUpdatedEventHandler(card, cap_obj);
          }
      }
    }
  },

  _textInputChangedHandler = function(e) {
    var src, parts;
    // get event and source element
    e = e || window.event;
    src = e.target || e.srcElement;

    var card = _findParentCard(src);
    _findCardCaption(card).text = src.value;
    _captionUpdatedEventHandler(card, _findCardCaption(card));
  },


  _loadCaption = function(video_id, caption) {
    _div_node.innerHTML = '';
    _id  = video_id;
    _highlightedList = [];
    if(caption === undefined || caption === null) {
      var caption_req_url = "api/caption.php?videoId=" + video_id;
      $.get(caption_req_url, function(response) {
        var caption_arr;
        if(response) {
          //console.log(response);
          var res = JSON.parse(response);

          if(res['code']==200) {
            caption_arr = res['caption'];
            //storeCaptionArrayIntoDB(res['captionId'], video_id, caption_arr);
            _caption_id = res['captionId'];
          }
        }

        _caption = createCaptionLines(_div_node, caption_arr);
        var time_input_nodes = _div_node.querySelectorAll(".editor-time-input");
        time_input_nodes.forEach(function(element) {
          $(element).change(_timeInputChangedHandler);
        });
        var text_input_nodes = _div_node.querySelectorAll("#line-text");
        text_input_nodes.forEach(function(element) {
          $(element).change(_textInputChangedHandler);
        });
      });
    }
  };
  //end of private member section

  Constr = function(div, config) {
    var editor = document.getElementById(div);
    _div = div;
    _div_node = editor;
    _id  = config.videoId;
    _highlightedList = [];
    _events = config.events;
    _caption_area_node = document.getElementById(config.captionArea);
    tool.addListener(editor, 'keyup', _divKeyUpHandler);
    tool.addListener(editor, 'click', _divClickHandler);


    // using ajax the fetch the caption data from server
    if(config.caption === undefined || config.caption === null) {
      var caption_req_url = "api/caption.php?videoId=" + config.videoId;
      console.log('load caption');
      $.get(caption_req_url, function(response) {
        console.log('caption response');
        var caption_arr;
        if(response) {
          //console.log(response);
          var res = JSON.parse(response);

          if(res['code']==200) { // successed
            caption_arr = res['caption'];
            _caption_id = res['captionId'];
          }
        }

        // create and maintain the _caption structure
        _caption = createCaptionLines(_div_node, caption_arr);

        // adding listener when user change the values of the captions
        var time_input_nodes = _div_node.querySelectorAll(".editor-time-input");
        time_input_nodes.forEach(function(element) {
          $(element).change(_timeInputChangedHandler);
        });

        var text_input_nodes = _div_node.querySelectorAll("#line-text");
        text_input_nodes.forEach(function(element) {
          $(element).change(_textInputChangedHandler);
        });
      });
    }
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

console.log('after redefine: '+ MYAPP.CaptionEditor.oldAttribute);


console.log('test time stamp');
var a = new MYAPP.TimeStamp('02:5.8'),
    b = new MYAPP.TimeStamp('abc'),
    c = new MYAPP.TimeStamp('.4'),
    d = new MYAPP.TimeStamp(5299.4);
console.log(a.debug);
console.log(b.debug);
console.log(c.debug);
console.log(d.debug);


//using in getting a url request key-value pair
//
function getValue(varname)
{
  var url = window.location.href;
  var varparts = url.split("?");
  if (varparts.length < 2){return 0;}
  var vars = varparts[1].split("&");
  //console.log(vars);
  var value = 0;
  for (i=0; i<vars.length; i++)
  {
    var parts = vars[i].split("=");
    if (parts[0] == varname)
    {
      value = parts[1];
      break;
    }
  }
  value = unescape(value);
  value.replace(/\+/g," ");
  return value;
}


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script'); // Just in memory. Not yet added to the DOM

tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // Now added to the DOM
