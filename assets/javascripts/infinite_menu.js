var reachedMax = false;
var page = 0;
var size = 20;
var loading = false;

$(document).ready(function() {
  getVideoList();
});

$(window).scroll(function() {
  var reached70PercentPage = $(window).scrollTop() >= ($(document).height() - $(window).height())*0.7;
  if (reached70PercentPage && !loading) {
    
    page ++;
    getVideoList(page);
  }
  if($(window).scrollTop() >= $(document).height() - $(window).height()) {
    //reach_end
    console.log('reach_page_end');
    //The user is scrolling so fast!
    //Adding page size to give user better experience
    size *= 2;
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
          "<a href='video_infinite.html?id=" + video['videoID'] +  "' class='image-href mx-auto'>"+
            "<img class='card-img-top thumbnail' alt='Card image cap'" + 
                  "src='" + video['thumbnail_link'] + "'/>"+
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