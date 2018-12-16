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
  searchInCaption: function (caption, value, return_nearest=false) {
    // initial values for start, middle and end
    var ret;
    for(let i=0; i<caption.length; i++) {
        let data = $(caption.get( i )).data();
        if(data.start <= value && value < data.end) {
            return caption.get( i );
        }
        if(return_nearest == true) {
            if(data.end <= value && value <= $(caption.get( i+1 )).data().start ) {
                return caption.get( i );
            }
        }
    }
    return -1;
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
              this.seconds = -1;
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
  _editor,


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
        $(div).append(_singleLineHTML(caption[i]));
        if(parseInt(caption[i].seq) > _max_seq) {
          //console.log(caption[i].seq);
          _max_seq = parseInt(caption[i].seq);
        }
        //store the caption record into the structure
        caption_ret[caption[i].seq] = caption[i];
      }
    }
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
    var card = $("<div class='card shadow mt-2 editor-line'></div>").html("\
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
    </div>")


    $(card).data(conf);
    $(card).find('#start-time').val(new TStamp(conf.start).toString());
    $(card).find('#end-time').val(new TStamp(conf.end).toString());


    return card;
  },



  // to test a DOM node is a "card" of caption or not
  _isCard = function(card) {
    if($(card).hasClass('editor-line')) {
      return true;
    } else {
      return false;
    }
  },


  _getTime = function(card, as_number) {
    if(!_isCard(card)) {
      //throw new EditorException('unknow card element');
        return {start:'00:0.0', end: '00:0.0'};
    }


    if(as_number === true)
        return {
            start: TStamp.timeStringToMillis(
                $(card).find('#start-time').val()),
            end:   TStamp.timeStringToMillis(
                $(card).find('#end-time').val())
        };


    return {
        start: $(card).find('#start-time').val(),
        end:   $(card).find('#end-time').val()
    };
  },


  _getSeq = function(card) {
    if(_isCard(card)) {
        return;
    } else {
        return $(card).data().seq;
    }
  },



  // set a caption card as highlight
  _setFocusAndHighlight = function(card) {
      if(!_isCard(card)) {
          return;
      }
      // make sure there is exactly one caption are highlighted
      for(var i=0; i<_highlightedList.length; i++) {
         _highlightedList[i].removeClass('editor-line-body-highlight');
      }
      _highlightedList = [];
      $(card).addClass('editor-line-body-highlight');
      //console.log(_caption_area_node);
      // show the caption to the screen
      if(_caption_area_node !== undefined && _caption_area_node !== null) {
         $(_caption_area_node).text($(card).find('#line-text').val());
      }
      _highlightedList.push($(card));
  },


  // insert a caption card after a spceific caption card
  _insertLineAfter = function(target, conf, before=false) {
    var card = _findParentCard(target);
    console.log(card);
    var target_time = _getTime(card, true); // return value will be number type second
    var end_time;
    var prev = $(card).prev();

    // check if the start time has been assigned
    if(conf.start === undefined) {
        conf.start = target_time.end;
    } else {
        conf.start = new TStamp(conf.start).valueOf();
    }

    if(conf.start <= 0) {
        conf.start = 0;
    }
    if(prev && _getTime(prev).end > conf.start) {
        conf.start = _getTime(prev).end;
    }


    //check if the end time has been assigned
    if(conf.end === undefined) {

      // check if this line has a sibling after itself,
      // if no, we can set the time as we like.
        if($.isEmptyObject($(card).next())) {
            conf.end = target_time.end + 2;


        } else {
        // if the card has a sibling, check the sibling's starting time.
            var next_time = _getTime($(card).next(), true);


            if(target_time.end + 2 >= next_time.start) {
                conf.end = next_time.start;
            } else {
                conf.end = target_time.end + 2;
            }
      }


    //if the end time has been assigned     
    } else {
        // convert conf.end to number
        conf.end = new TStamp(conf.end).valueOf();
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
    if(before === true) {
        line.insertBefore($(card));
    } else {
        line.insertBefore($(card).next());
    }
    line.find('.editor-time-input').change(_timeInputChangedHandler);
    line.find('#line-text').change(_textInputChangedHandler);


    _captionInsertedEventHandler(card, conf);   //execute the call back routine
    return line;
  },


  // if the node is a inner element in the card 
  // find the reference of the parent of the node
  _findParentCard = function(node) {
      if($(node).hasClass('editor-line')) {
          return node;
      }
      node = $(node).parents('.editor-line').get( 0 );
    

      if(!$.isEmptyObject(node)) {
          return node;
      } else {
          return null;
      }
  },


  // find the specific caption in _caption array
  // by passing a DOM node
  _findCardCaption = function(card) {
      if(!_isCard(card)) {
          return null;
      }
      // since the id attribute is like 'cap-xx', and the 'xx' part
      // is the id number
      cards = $(":data(seq)");
      for(let i=0; i < cards.length; i++) {
          if($(cards.get( i )).data().seq == $(card).data().seq) {
             return cards.get( i );
          }
      }

      return null;
  },


  // the delegating function of the editor division
  _divClickHandler = function(e) {
    var src, parts;
    // get event and source element
    e = e || window.event;
    src = e.target || e.srcElement;
    // actual work: update label

    console.log(src);
    //console.log(e);

    var card = _findParentCard(src);
    if(_isCard(card)) {
        _setFocusAndHighlight(card);
        if(_player !== undefined) {
        //console.log(_getTime(card).start);
          _player.seekTo(_getTime(card, true).start, true);
        } 
    } 

    if(src.id === "btn-delete") {
        _captionDeletedEventHandler(card, $(card).data());
      
        console.log($(card).data().seq);
        $(card).remove();
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

      console.log(src.value);

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
                  var new_line_text = new_node.find("#line-text");
                  //new_line_text.setSelection(0, 0);
              }
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
        var cap = tool.searchInCaption($(":data(seq)"), now_time);
        if (cap != -1) {
              var cap_node      = $(cap),
                  pos        = $(cap).position(),
                  parentHeight  = $(_div_node).innerHeight(),
                  nodeHeight    = $(cap).outerHeight(),
                  scrollTop     = $(_div_node).scrollTop();

            console.log(pos.top, parentHeight, nodeHeight, scrollTop);
            if (pos.top < 0 || pos.top > parentHeight - nodeHeight) {
                $(_div_node).scrollTop(scrollTop + pos.top - $(_div_node).offset().top);
            }
            _setFocusAndHighlight(cap_node);
        } else {
            $(_caption_area_node).text('');
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
    var card = $(_findParentCard(this));
    if(_isCard(card)) {
      //since id is encoded as cap_#id
      var cap_obj =  card.data();
      var prev_card_obj = _getTime(card.prev(), true);
      var next_card_obj = _getTime(card.next(), true);
      var second = new TStamp(this.value).valueOf();

      console.log(cap_obj, prev_card_obj, next_card_obj);

      if(second < 0) {
          $(this).val(new TStamp(cap_obj.start).toString());
      }

      if(this.id === 'start-time') {
          if((_isCard(card.prev()) &&
              prev_card_obj.end > second) ||
              second > cap_obj.end) {
              $(this).val(new TStamp(cap_obj.start).toString());
          } else {
              cap_obj.start = second;
              _captionUpdatedEventHandler(card, cap_obj);
              $(card).data().start = second;
          }


      } else if(this.id === 'end-time') {
          console.log(cap_obj.start);
          if((_isCard(card.next()) &&
              next_card_obj.start < second) ||
              second < cap_obj.start) {
              $(this).val(new TStamp(cap_obj.end).toString());
          } else {
              cap_obj.end = second;
              _captionUpdatedEventHandler(card, cap_obj);
              $(card).data().end = second;
          }
      }
    }
  },

  _textInputChangedHandler = function(e) {
      var src, parts;
      // get event and source element
      e = e || window.event;
      src = e.target || e.srcElement;


      console.log(src);
      var card = _findParentCard(src);
      $(card).data().text = src.value;
      _captionUpdatedEventHandler(card, _findCardCaption(card));
  },


  _loadCaption = function(video_id, caption) {
      $(_div_node).text('');
      _id  = video_id;
      _highlightedList = [];


      if(caption === undefined || caption === null) {
          var caption_req_url = "api/caption.php?videoId=" + video_id;
          $.get(caption_req_url, function(response) {
              var caption_arr;
              if(response) {
                var res = JSON.parse(response);

                if(res['code']==200) {
                  caption_arr = res['caption'];
                  //storeCaptionArrayIntoDB(res['captionId'], video_id, caption_arr);
                  _caption_id = res['captionId'];
                }
            }

            createCaptionLines(_div_node, caption_arr);
            $(_div_node).find(".editor-time-input").change(_timeInputChangedHandler);
            $(_div_node).find(".editor-line-text").change(_textInputChangedHandler);
          });
      }
  };
  //end of private member section

  Constr = function(div, config) {
      var editor = document.getElementById(div);
      $(editor).html("\
        <div class='card shadow mt-2' id='caption-insert'>\
          <div class='card-body editor-line-body d-flex'>\
            <textarea class='editor-line-text d-flex col-9 col-lg-9' id='line-text' placeholder='輸入字幕'></textarea>\
            <div class='d-flex flex-column col-3 col-lg-3'> \
              <button class='btn btn-danger' id='btn-delete'>x</button>\
              <button class='btn btn-light' id='btn-add'>+</button>\
            </div>\
          </div>\
        </div>\
        <div id='inner-editor'></div>");
      _editor = editor;
      $(editor).find('#btn-delete').click(function(e) {
          $(editor).find('#line-text').val('');
      });
      $(editor).find('#btn-add').click(function(e) {
          if(!_player) {
              return;
          }
          var play_time = _player.getCurrentTime(), 
              cap = tool.searchInCaption($(":data(seq)"), play_time, true);
          t = _getTime(cap, true);
          console.log(t, play_time);
          if(t.end < play_time) {
              _insertLineAfter(cap, {
                  start: play_time,
                  text: $(editor).find('#line-text').val()
              });
          } else {
              _insertLineAfter(cap, {
                  start: t.start - 0.5,
                  end: t.start,
                  text: $(editor).find('#line-text').val()
              },
              true);
          }
      })
      _div = 'inner-editor';
      _div_node = document.getElementById('inner-editor');
      console.log($(_div_node).parent());
      _id  = config.videoId;
      _highlightedList = [];
      _events = config.events;
      _caption_area_node = document.getElementById(config.captionArea)
      $(_div_node).keyup(_divKeyUpHandler);
      $(_div_node).click(_divClickHandler);


    // using ajax the fetch the caption data from server
      if(caption === undefined || caption === null) {
          var caption_req_url = "api/caption.php?videoId=" + video_id;
          $.get(caption_req_url, function(response) {
              var caption_arr;
              if(response) {
                console.log(response);
                var res = JSON.parse(response);

                if(res['code']==200) {
                  caption_arr = res['caption'];
                  //storeCaptionArrayIntoDB(res['captionId'], video_id, caption_arr);
                  _caption_id = res['captionId'];
                }
            }

            createCaptionLines(_div_node, caption_arr);
            $(_div_node).find(".editor-time-input").change(_timeInputChangedHandler);
            $(_div_node).find(".editor-line-text").change(_textInputChangedHandler);
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
