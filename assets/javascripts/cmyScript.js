

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
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
		width:'100%',
		height:'360',
        videoId: 'WWG6jaBFYtU', //blcokchain 101:_160oMzblY8
        playerVars: { 'autoplay': 1, 'controls': 1 },
        events: {
            'onReady': onPlayerReady,
            // 'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onStateChange': onPlayerStateChange,
            'OnApiChange': 'onPlayerApiChange',
            'onError': onPlayerError
        }
    });
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
        'mediaContentUrl': 'http://www.youtube.com/v/WWG6jaBFYtU?version=3',
        'startSeconds': 0,
        //'endSeconds': 100,
        'suggestedQuality': 'large'
    });

    // bind the caption
    bindCaption();

    //console.log('player: ' + document.getElementById('embed-code').id);
    document.getElementById('embed-code').style.borderColor = '#FF6D00';
    event.target.setVolume(80);

    // 取得第一段字幕的起訖時間
    var c = JSON.parse(captionContents);
    var start = Number(c.en[0].start);
    var duration = Number(c.en[0].dur);
    var end = start + duration;

    // 呼叫播放API
    playVideo(start, end);

    // set the timer for scrolling to current play time
    scrollToCaption(0, start, end);

}


function playVideo(startTime, endTime) {
    player.seekTo(Number(startTime), true);
    player.playVideo();

    // 必須延遲些許時間，讓player開始播放影片，才可正確取得player.getCurrentTime()回傳值。
    // 經多次實驗後，25ms可正確取得player.getCurrentTime();
    setTimeout(function () {
        pauseVideo(endTime);
    }, 25);
}

function scrollToCaption(captionIndex, start, end) {

    var objDiv = document.getElementById("container_caption");

    // 取得所有字幕集合<td start='' end=''>..</td>
    var caps = $('td');
    var move_downward = document.getElementById("table_caption").clientHeight / caps.length; // 每次往下捲動的單位

    for (var i = 0; i < caps.length; i++) {
        if (i == captionIndex) {
            caps[i].firstChild.nextSibling.firstChild.nextSibling.classList.add('highlight_caption');
        }
        else {
            caps[i].firstChild.nextSibling.firstChild.nextSibling.classList.remove('highlight_caption');
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
                caps[i].innerHTML = "<a href='javascript:;' onclick=\"player.seekTo(" + start + "); playVideo(" + start + "," + end + ");\">\r<font color='red'>" + caps[i].innerHTML + "</font>\r<\a>";
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
        console.log('change color: ' + document.getElementById('embed-code'));
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
    console.log(event.data); // show the event type
    if (event.data == YT.PlayerState.PLAYING) {
        // 由目前的執行時間，取得對應的字幕物件資訊
        var current = player.getCurrentTime();
        var c = JSON.parse(captionContents);
        var start, duration;
        for (var i = 0; i < c.en.length; i++) {
            start = Number(c.en[i].start);
            duration = Number(c.en[i].dur);
            if (current >= start && current < (start + duration)) {
                scrollToCaption(i);
                pauseVideo((start + duration));
                return;
            }
        }
    }
    console.log("onPlayerStateChange. Current time: " + player.getCurrentTime());
}

var handlerPauseTimeStamp = 0;  // 設定呼叫setTimeout(pauseTimeStamp)之handler
function pauseVideo(pauseTimeStamp) {
    var current = player.getCurrentTime();
    if (current == undefined || current < pauseTimeStamp) {
        handlerPauseTimeStamp = setTimeout(pauseVideo, 100, pauseTimeStamp);
    } else {
        clearTimeout(handlerPauseTimeStamp);
        player.pauseVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}

// set the caption contents manaully
// TODO: using Youtube Data API to obtain the caption automatically!
//var captionContents='{"captions":[{"offset":3,"caption":"I\'ve had my ups and downs."},{"offset":5, "caption":"my fair share of bumpy roads and heavy winds."},{"offset":9, "caption":"That’s what made me what I am today. "},{"offset":13,"caption":"Now I stand here before you."},{"offset":16,"caption":"What you see is a body crafted to perfection,"},{"offset":21,"caption":"a pair of legs engineered to defy the laws of physics …"},{"offset":25,"caption":"and a mind set to master the most epic of splits."},{"offset":61,"caption":"This test was set up to demonstrate the stability"},{"offset":63,"caption":"and precision of Volvo Dynamic Steering."},{"offset":72,"caption":"It was carried out by professionals in a closed-off area."}]}';
var captionContents = '{"en":[{ "id": "30937935", "caption_id": "141637", "seq": "1", "text": "China has total respect for Donald Trump", "start": "0.109", "dur": "3.6"}, { "id": "30937936", "caption_id": "141637", "seq": "2", "text": "and for Donald Trump\'s very, very large brain.", "start": "3.709", "dur": "4.44"}, { "id": "30937937", "caption_id": "141637", "seq": "3", "text": "Why has president Trump given so much to North Korea?", "start": "8.148", "dur": "4.672"}, { "id": "30937938", "caption_id": "141637", "seq": "4", "text": "If I wasn\'t elected, you would have had a war.", "start": "12.82", "dur": "2.9"}, { "id": "30937939", "caption_id": "141637", "seq": "5", "text": "President Obama thought you had to go to war.", "start": "15.72", "dur": "2.14"}, { "id": "30937940", "caption_id": "141637", "seq": "6", "text": "You know how close he was to pressing", "start": "17.87", "dur": "1.64"}, { "id": "30937941", "caption_id": "141637", "seq": "7", "text": "the trigger for war?", "start": "19.51", "dur": "1.32"}, { "id": "30937942", "caption_id": "141637", "seq": "8", "text": "We\'re not doing well ...", "start": "20.83", "dur": "1"}, { "id": "30937943", "caption_id": "141637", "seq": "9", "text": "Err, let me call the Russian\'s to help.", "start": "21.83", "dur": "3.699"}, { "id": "30937944", "caption_id": "141637", "seq": "10", "text": "We have pictures of president Trump.", "start": "25.53", "dur": "2.28"}, { "id": "30937945", "caption_id": "141637", "seq": "11", "text": "Woooah, where can I get \'em?", "start": "27.81", "dur": "1.71"}, { "id": "30937946", "caption_id": "141637", "seq": "12", "text": "Err, wow that\'s a lot of hands.", "start": "29.52", "dur": "3.66"}, { "id": "30937947", "caption_id": "141637", "seq": "13", "text": "You\'re with who? \u2013 Hannah Thomas Peter from Sky News.", "start": "33.18", "dur": "3.31"}, { "id": "30937948", "caption_id": "141637", "seq": "14", "text": "OK good, Sky News. Congratulations on the purchase.", "start": "36.49", "dur": "3.45"}, { "id": "30937949", "caption_id": "141637", "seq": "15", "text": "[Laughter] \u2013 Nothing to do with me.", "start": "40.96", "dur": "2.74"}, { "id": "30937950", "caption_id": "141637", "seq": "16", "text": "I hope you benefited.", "start": "44.18", "dur": "1.2"}, { "id": "30937951", "caption_id": "141637", "seq": "17", "text": "Yeah, you. Guy looks ... Guy looks like he\'s shocked.", "start": "46.2", "dur": "5.2"}, { "id": "30937952", "caption_id": "141637", "seq": "18", "text": "This is going to be not good.", "start": "51.4", "dur": "1.49"}, { "id": "30937953", "caption_id": "141637", "seq": "19", "text": "The guy looks totally, like, stunned.", "start": "52.89", "dur": "2.64"}, { "id": "30937954", "caption_id": "141637", "seq": "20", "text": "Have you ever been picked before for a question?", "start": "55.53", "dur": "1.94"}, { "id": "30937955", "caption_id": "141637", "seq": "21", "text": "Excuse me, you said where, from where?", "start": "57.47", "dur": "1.92"}, { "id": "30937956", "caption_id": "141637", "seq": "22", "text": "\u2013 Rudaw Media Network from Kurdistan region,", "start": "59.39", "dur": "1.71"}, { "id": "30937957", "caption_id": "141637", "seq": "23", "text": "northern Iraq. I\'m a Kurd. \u2013 OK. Good. Good.", "start": "61.1", "dur": "3.49"}, { "id": "30937958", "caption_id": "141637", "seq": "24", "text": "Great people. \u2013Thank you, sir.", "start": "64.59", "dur": "1.52"}, { "id": "30937959", "caption_id": "141637", "seq": "25", "text": "Great people! Thank you. \u2013 Mr President ...", "start": "66.11", "dur": "2.38"}, { "id": "30937960", "caption_id": "141637", "seq": "26", "text": "Are you a Kurd? \u2013 Mr President ...", "start": "68.49", "dur": "2.159"}, { "id": "30937961", "caption_id": "141637", "seq": "27", "text": "Good. They\'re great people, they\'re great fighters.", "start": "70.65", "dur": "3.31"}, { "id": "30937962", "caption_id": "141637", "seq": "28", "text": "I like them a lot. Let\'s go. I like this question so far.", "start": "73.96", "dur": "2.849"}, { "id": "30937963", "caption_id": "141637", "seq": "29", "text": "Yes, please, Mr Kurd.", "start": "76.81", "dur": "1.96"}, { "id": "30937964", "caption_id": "141637", "seq": "30", "text": "New York Times, come on! New York Times.", "start": "78.77", "dur": "2.129"}, { "id": "30937965", "caption_id": "141637", "seq": "31", "text": "The failing New York Times. Stand up, go ahead.", "start": "80.9", "dur": "2.3"}, { "id": "30937966", "caption_id": "141637", "seq": "32", "text": "I like president Xi a lot. I think he\'s a friend of mine.", "start": "83.2", "dur": "2.589"}, { "id": "30937967", "caption_id": "141637", "seq": "33", "text": "He may not be a friend of mine anymore", "start": "85.79", "dur": "1.71"}, { "id": "30937968", "caption_id": "141637", "seq": "34", "text": "but I think he probably respects ... From what I hear.", "start": "87.5", "dur": "2.69"}, { "id": "30937969", "caption_id": "141637", "seq": "35", "text": "\u2013 You were talking about your administration\'s accomplishments", "start": "90.19", "dur": "2.42"}, { "id": "30937970", "caption_id": "141637", "seq": "36", "text": "at the United Nations and a lot of the leaders laughed ...", "start": "92.61", "dur": "3.11"}, { "id": "30937971", "caption_id": "141637", "seq": "37", "text": "Well, that\'s fake news. \u2013 What was that experience like?", "start": "95.72", "dur": "1.79"}, { "id": "30937972", "caption_id": "141637", "seq": "38", "text": "That\'s fake news and it was covered that way.", "start": "97.51", "dur": "1.87"}, { "id": "30937973", "caption_id": "141637", "seq": "39", "text": "OK, they weren\'t laughing at me,", "start": "99.38", "dur": "2.06"}, { "id": "30937974", "caption_id": "141637", "seq": "40", "text": "they were laughing with me. We had fun.", "start": "101.44", "dur": "1.8"}, { "id": "30937975", "caption_id": "141637", "seq": "41", "text": "When you say \'does it effect me?\' In terms of my thinking,", "start": "103.24", "dur": "3.15"}, { "id": "30937976", "caption_id": "141637", "seq": "42", "text": "with respect to Judge Kavanaugh,", "start": "106.39", "dur": "2.33"}, { "id": "30937977", "caption_id": "141637", "seq": "43", "text": "absolutely because I\'ve had it many times.", "start": "108.72", "dur": "2.05"}, { "id": "30937978", "caption_id": "141637", "seq": "44", "text": "When I see it, I view it differently than somebody", "start": "110.77", "dur": "2.59"}, { "id": "30937979", "caption_id": "141637", "seq": "45", "text": "sitting home, watching television, where they say:", "start": "113.36", "dur": "2.24"}, { "id": "30937980", "caption_id": "141637", "seq": "46", "text": "\'Oh, Judge Kavanaugh\' this or that.", "start": "115.6", "dur": "3.17"}, { "id": "30937981", "caption_id": "141637", "seq": "47", "text": "It\'s happened to me many times. I\'ve had many false charges.", "start": "118.77", "dur": "3.129"}, { "id": "30937982", "caption_id": "141637", "seq": "48", "text": "If we bought George Washington here and we said:", "start": "121.9", "dur": "4.04"}, { "id": "30937983", "caption_id": "141637", "seq": "49", "text": "\'We have George Washington\', the Democrats would", "start": "125.94", "dur": "2.44"}, { "id": "30937984", "caption_id": "141637", "seq": "50", "text": "vote against him, just so you understand.", "start": "128.38", "dur": "3"}, { "id": "30937985", "caption_id": "141637", "seq": "51", "text": "And he may have had a bad past, who knows? You know.", "start": "131.38", "dur": "2.34"}, { "id": "30937986", "caption_id": "141637", "seq": "52", "text": "He may have had some, I think, accusations made.", "start": "133.72", "dur": "3.96"}, { "id": "30937987", "caption_id": "141637", "seq": "53", "text": "Didn\'t he have a couple of things in his past?", "start": "137.68", "dur": "1.87"}, { "id": "30937988", "caption_id": "141637", "seq": "54", "text": "Always like to finish with a good one.", "start": "139.55", "dur": "1.7"}, { "id": "30937989", "caption_id": "141637", "seq": "55", "text": "Elton John said: When you hit that last tune", "start": "141.25", "dur": "3.05"}, { "id": "30937990", "caption_id": "141637", "seq": "56", "text": "and it\'s good, don\'t go back.\'", "start": "144.3", "dur": "2.6"}, { "id": "30937991", "caption_id": "141637", "seq": "57", "text": "\u2013 Well, let me ask you ...", "start": "146.9", "dur": "0.53"}, { "id": "30937992", "caption_id": "141637", "seq": "58", "text": "I\'ve seen ... Have you ever seen? They do great , they\'re great,", "start": "147.43", "dur": "2.97"}, { "id": "30937993", "caption_id": "141637", "seq": "59", "text": "they hit the last tune and everyone goes crazy.", "start": "150.4", "dur": "2.179"}]}';

function bindCaption() {
    var c = JSON.parse(captionContents);
    console.log('json' + c.en.length);

    var captionElement = document.getElementById('table_caption');
    //console.log('table_caption: ' + captionElement.innerHTML);
    var captionTableContent = "";
    var end = 0, start = 0;
    for (var i = 0; i < c.en.length; i++) {
        start = Number(c.en[i].start);
        console.log('caption: ' + c.en[i].text);
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
