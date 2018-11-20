

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script'); // Just in memory. Not yet added to the DOM
var timer_checkPlayerCurrentTime;
var currentPlaySequenceNumber;    // 目前播放字幕的序號

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // Now added to the DOM

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var caption;
var caption_array = {
    en: new Array()
};
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

function onYouTubeIframeAPIReady() {
    console.log(getValue("youtubeid"));
    player = new YT.Player('player', {
        width: '100%',
        height: '360',
        videoId: getValue("youtubeid"), //blcokchain 101:_160oMzblY8
        playerVars: { 'autoplay': 1, 'controls': 1 },
        events: {
            'onReady': onPlayerReady,
            // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onStateChange': onPlayerStateChange,
            'OnApiChange': 'onPlayerApiChange',
            'onError': onPlayerError
        }
    });
    /*
    caption = document.getElementById("table_caption").getElementsByTagName("tbody")[0].getElementsByTagName("td");
    for(i=0; i<caption.length; i++) {
        var item = {
            start: caption[i].getAttribute('start'),
            end: caption[i].getAttribute('end'),
            dur: caption[i].getAttribute('dur')
        };
        //console.log(item);
        caption_array.en.push(item);
    }
    */

}

function onPlayerError(event) {
    /*
    2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
    5 – The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
    100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
    101 – The owner of the requested video does not allow it to be played in embedded players.
    150 – This error is the same as 101. It's just a 101 error in disguise!
    */

    console.log("error: " + event.data);
}

function onApiChange(event) {
    console.log('OnApiChange. Player Captions: ' + event.data);
}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

    // http://www.youtube.com/v/WWG6jaBFYtU?version=3
    player.cueVideoByUrl({
        'mediaContentUrl': 'http://www.youtube.com/v/' + getValue("youtubeid") + '?version=3',
        'startSeconds': 0,
        //'endSeconds': 100,
        'suggestedQuality': 'large'
    });
    document.getElementById('embed-code').style.borderColor = '#FF6D00';
    event.target.setVolume(80);
	
	 var video_id=getValue("youtubeid");
	 var caption_req_url = "api/caption.php?videoId=" + video_id;

   $.get(caption_req_url, function(response) {
    if(response) {
      var res = JSON.parse(response);

      if(res['code']==200) {
        var caption_arr = res['caption'];
        getTableCaption(caption_arr);
        storeCaptionArrayIntoDB(res['captionId'], video_id, caption_arr);
        // set global caption variable as caption_arr
        caption = caption_arr;
        
        // 取得第一段字幕的起訖時間
        var start = Number(caption[0]['start']);
        var duration = Number(caption[0]['dur']);
        var end = start + duration;
        // 呼叫播放API
        playVideo(start, end);
        
        // set the timer for scrolling to current play time
        scrollToCaption(0, start, end);
      } else {
        var no_caption = [];
        getTableCaption(no_caption);
      }
    } else {
      var no_caption = [];
      getTableCaption(no_caption);
    }
  });
	
	
}



function playVideo(startTime, endTime) {
    console.log("start: " + startTime + " endTime:" + Number(endTime));
    player.seekTo(Number(startTime), true);
    player.playVideo();

    // 必須延遲些許時間，讓player開始播放影片，才可正確取得player.getCurrentTime()回傳值。
    // 經多次實驗後，25ms可正確取得player.getCurrentTime();
    setTimeout(function () {
        pauseVideo(Number(endTime));
    }, 25);
}

function scrollToCaption(captionIndex, start, end) {

    var objDiv = document.getElementById("container_caption");

    // 取得所有字幕集合<td start='' end=''>..</td>
    var caps = $("td");
    console.log(caps);
    var move_downward = document.getElementById("table_caption").clientHeight / caps.length; // 每次往下捲動的單位

    for (var i = 0; i < caps.length; i++) {
        if (i == captionIndex) {
            caps[i].firstChild.classList.add('highlight_caption');
        }
        else {
            caps[i].firstChild.classList.remove('highlight_caption');
        }
    }

    if (objDiv.scrollTop < (objDiv.scrollHeight - 16)) {
        objDiv.scrollTop = (captionIndex > 0 ? captionIndex - 1 : captionIndex) * move_downward;
    }
}


function checkPlayerCurrentTimeAndScrollToCaption() {
    var currentTime = player.getCurrentTime();
    if (currentTime == 'undefined') return;

    var objDiv = document.getElementById("container_caption");

    // 取得所有字幕集合<td start='' end=''>..</td>
    var caps = $('td');
    var start, end;
    var move_downward = document.getElementById("table_caption").clientHeight / caps.length; // 每次往下捲動的單位
    for (var i = 0; i < caps.length; i++) {
        // 偵測目前所撥放時間位在那個區間
        start = Number(caps[i].attributes['start'].value);
        end = Number(caps[i].attributes['end'].value);

        // 加入<td>之onClick event handler

        if (currentTime >= start && currentTime < end) {
            objDiv.scrollTop = (i > 0 ? i - 1 : i) * move_downward;
            if (caps[i].innerHTML.indexOf('href=\"javascript:;\"') == -1) {
                caps[i].innerHTML = "<a href='javascript:;' onclick=\"player.pauseVideo(); playVideo(" + start + "," + end + ");\">\r<font color='red'>" + caps[i].innerHTML + "</font>\r<\a>";
                //caps[i].innerHTML = "<a href='javascript:;' onclick=\"player.seekTo(" + start + "); playVideo(" + start + "," + end + ");\">\r<font color='red'>" + caps[i].innerHTML + "</font>\r<\a>";
                clearTimeout(timer_checkPlayerCurrentTime);
            }
            return;
        }
        else {
            caps[i].innerHTML = caps[i].innerHTML.replace("<font color=\"red\">", "").replace("</font>", "");
        }

    }

    if (objDiv.scrollTop == (objDiv.scrollHeight - 16)) {
        objDiv.scrollTop = 0;
    }

    timer_checkPlayerCurrentTime = setTimeout(checkPlayerCurrentTimeAndScrollToCaption, 100);
}

function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }

    if (color) {
        // console.log('change color: ' + document.getElementById('embed-code'));
        document.getElementById('embed-code').style.borderColor = color;
    }
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    //console.log('current playback quality: ' + player.getPlaybackQuality());
    changeBorderColor(event.data);
    //console.log(event.data); // show the event type
    if (event.data == YT.PlayerState.PLAYING) {

        // 由目前的執行時間，取得對應的字幕物件資訊
        var current = player.getCurrentTime();
        var start, duration;
       // console.log("PlayerState= PLAYING! CurrentTime:" + current);
        for (var i = 0; i < caption.length; i++) {
            start = Number(caption[i]['start']);
            duration = Number(caption[i]['dur']);
            if (current >= start && current < (start + duration)) {
                scrollToCaption(i);
                pauseVideo((start + duration));
                return;
            }
        }
    }
    else {
        console.log("onPlayerStateChange: " + event.data + "| Current time: " + player.getCurrentTime());
    }
}

var handlerPauseTimeStamp = 0;  // 設定呼叫setTimeout(pauseTimeStamp)之handler
function pauseVideo(pauseTimeStamp) {
    var current = player.getCurrentTime();
    //console.log("pauseVideo_currentTime: " + current + " pauseTimeStamp: " + pauseTimeStamp);
    if (current == undefined || current < pauseTimeStamp) {
        // 若已指派setTimeout，則清除該Timeout
        clearTimeout(handlerPauseTimeStamp);
        // 當YT.PlayerState.PLAYING時，若使用者隨意點選某一段字幕檔，
        // 故當時狀態為為pause，則直接撥放video
        if (player.getPlayerState() == YT.PlayerState.PAUSED) {
            player.playVideo();
        }
        handlerPauseTimeStamp = setTimeout(pauseVideo, 10, pauseTimeStamp);
    } else {
        clearTimeout(handlerPauseTimeStamp);
        player.pauseVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}

// set the caption contents manaully
function bindCaption() {
    var c = JSON.parse(captionContents);
    //console.log('json' + c.en.length);

    var captionElement = document.getElementById('table_caption');
    //console.log('table_caption: ' + captionElement.innerHTML);
    var captionTableContent = "";
    var end = 0, start = 0;
    for (var i = 0; i < c.en.length; i++) {
        start = Number(c.en[i].start);
        //console.log('caption: ' + c.en[i].text);
        end = start + Number(c.en[i].dur);
        captionTableContent = captionTableContent + ('<tr><td start=\'' + start + '\' end=\'' + end + '\'>\n<a href=\"javascript:;\" onclick=\"playVideo(' + start + ',' + end + ');\">\r<span>' + c.en[i].text + '</span></a>\n</td></tr>\r');
    }
    captionElement.innerHTML = captionTableContent;
}


//*********************************************************
//*** 捲動效果
//*********************************************************
var my_time;
//$(document).ready(function () {
//    pageScroll();
//    $("#container_caption")
//        .mouseover(function () {
//            clearTimeout(my_time);
//        }).mouseout(function () {
//            pageScroll();
//    });
//});

function pageScroll() {
    console.log("pageScroll is running...");
    var objDiv = document.getElementById("container_caption");
    objDiv.scrollTop = objDiv.scrollTop + 1;

    if (objDiv.scrollTop == (objDiv.scrollHeight - 100)) {
        objDiv.scrollTop = 0;
    }

    my_time = setTimeout(pageScroll, 100); // 設定定時執行timer，並回傳timerID
}
