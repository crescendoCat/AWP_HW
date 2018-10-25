var reachedMax = false;
var page = 0;
var size = 8;
var loading = false;

$(document).ready(function() {
  getVideoList();
});

$(window).scroll(function() {
  var reached70PercentPage = $(window).scrollTop() >= ($(document).height() - $(window).height())*0.7;
  if (reached70PercentPage) {
    page ++;
    getVideoList(page);
  }
});

function getVideoList(get_page) {
  if (reachedMax || loading) {
    return;
  } else {
    loading = true;
    $.post("./database.php", {
      request: "getVideoList",
      page: get_page,
      size: size,
      reachedMax: reachedMax
    }).done(function(response) {
      if (response === "reachedMax") {
        reachedMax = true;
        return;
      } else {
        console.log(response)
        appendLIst(JSON.parse(response));
        loading = false;
      }
    });
  }
}

function appendLIst(video_list) {
  video_list.forEach(function(video) {
    var video_card = 
      "<div class='col-12 col-sm-6 col-md-4 col-xl-3 card-panel'>"+
        "<div class='card shadow video-card'>"+
          "<a href='video.html' class='image-href mx-auto'>"+
            "<img class='card-img-top thumbnail' alt='Card image cap'" + 
                  "src='" + video['thumbnail_link'] + "'/>"+
                  // "src='https://i.ytimg.com/vi/WWG6jaBFYtU/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCfKTCgpCCE0teFxhMu3XzA_MRO0Q'/>"+
          "</a>"+
          "<div class='card-body thumbnail-intro'>"+
            "<h6 class='thumbnail-title title-popover' data-toggle='popover' data-trigger='hover' data-placement='top' data-content='" + video['title'] + "'>" +
            "<a href='#'><span class='thumbnail-title-span'>" + video['title'] + "</span></a>"+
            "</h6>"+
          "</div>"+
        "</div>"+
      "</div>"
    ;

    $(video_card).appendTo(".latest_menu");
  });
}