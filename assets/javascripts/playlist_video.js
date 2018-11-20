$(document).ready(function(){
  // Get the videos scroll menu only if there is list id
  if (getValue('list')!==0) { 
    if(Session.get('videos')) {  // Check if videos already in session
      appendVideosToScrollingMenu(Session.get('videos'));
    } else {
      getVideosListAndShowMenu(getValue('list'));
    } 
  }

  // getVideosCaptions(getValue('youtubeid'));
});


function getVideosListAndShowMenu(listID)
{
  $.get(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    { part: "snippet", playlistId: listID, key: "AIzaSyBPS3aToTVD0SXGNYZpEgAwf43CahHK-58", maxResults: 50 },
    function(list_res){
      if(list_res.items.length == 0) return;
      else {
        handleListDataFromYT(list_res);
      }
    }
  )
}

function handleListDataFromYT(list) {
  var videos_json = ListToVideosJson(list);
  appendVideosToScrollingMenu(JSON.parse(videos_json));
}

function ListToVideosJson(list)
{
  // console.log(list);
  var result = [];
  for(var i in list.items) {
    var item = {
      index: list.items[i].snippet.position,
      listID: list.items[i].snippet.playlistId,
      videoID: list.items[i].snippet.resourceId.videoId,
      thumbnail_img: list.items[i].snippet.thumbnails.high.url || '',
      title: list.items[i].snippet.title
    };
    result.push(item);
  };

  return JSON.stringify(result);
}

// append cards into horizontal menu scroller (append into '.scrolling-wrapper-flexbox')
function appendVideosToScrollingMenu(videos) {

  for(var i in videos) {
    var video_card = 
      "<div class='col-12 col-sm-6 col-md-4 col-lg-3'>"+
        "<div class='card card-block'>"+
          "<a href='video.php?youtubeid=" + videos[i]['videoID'] + "&list=" + videos[i]['listID'] + "&index=" + videos[i]['index'] + "' class='image-href mx-auto'>"+
            "<img class='card-img-top thumbnail' alt='Card image cap'" + 
                  "src='" + videos[i]['thumbnail_img'] + "'/>"+
          "</a>"+
          "<div class='card-body thumbnail-intro'>"+
            "<h6 class='thumbnail-title title-popover' data-toggle='popover' data-trigger='hover' data-placement='top' data-content='" + videos[i]['title'] + "'>" +
              "<a href='video.php?youtubeid=" + videos[i]['videoID'] + "&list=" + videos[i]['listID'] + "&index=" + videos[i]['index'] +"'>" + 
                "<span class='thumbnail-title-span'>" + videos[i]['title'] + "</span>" + 
              "</a>"+
            "</h6>"+
          "</div>"+
        "</div>"+
      "</div>"
    ;

    $(video_card).appendTo(".scrolling-wrapper-flexbox");
  }

  $('[data-toggle="popover"]').popover();
}

/*
function getVideosCaptions(video_id) {
  var caption_req_url = "http://awp-hw-page.tk:8888/api/caption.php?videoId=" + video_id;

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
*/
function getTableCaption(captions) {
  var captions_tbody = document.getElementById('table_caption').getElementsByTagName('tbody');

  if(captions.length == 0) {
    var no_captions_alert = "<tr><th>This video has no captions!</th></tr>";

    $(no_captions_alert).appendTo(captions_tbody);
  } else {
    for(var i in captions) {
      var caption_row = 
        "<tr><td start='" + captions[i]['start'] + "' " +
                "end='" + captions[i]['end'] + "' " +
                "dur='" + captions[i]['dur'] + "' >" +
          "<a href='javascript:' onclick='playVideo(" + captions[i]['start'] + ", " + captions[i]['end'] + ");' >" +
            "<span>" + captions[i]['text'] + "</span>" +
          "</a>" +
        "</td></tr>";

      $(caption_row).appendTo(captions_tbody);
    }

  }
}

function storeCaptionArrayIntoDB(caption_id, video_id, caption_arr) {
  $.post("./api/accessDB.php", 
        { captionId: caption_id, videoId: video_id, captionArray: caption_arr });
}
