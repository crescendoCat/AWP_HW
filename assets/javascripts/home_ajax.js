const video_page = "./video.html";
const apologize_page = "./apologize.html";
const latest_videos_json = 
'[{"title": "The strangest moments from Donald Trump\'s UN press conference","thumbnail_img": "https://i.ytimg.com/vi/WWG6jaBFYtU/hqdefault.jpg","link": "./video.html","view": 15},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683},{ "title": "如何不再遲到？給自己與慣性遲到者的建議 (How to Stop Being Late Forever(advice for myself and other chronically late people))","thumbnail_img": "https://cdn.voicetube.com/assets/thumbnails/_pqkpfckjO0_s.jpg","link": "./apologize.html","view": 1683}]';

{/* <div class="col-12 col-md-4 col-xl-3 card-panel">
  <div class="card shadow">
    <a href="video.html" class="image-href mx-auto">
      <img class="card-img-top thumbnail" src="https://i.ytimg.com/vi/WWG6jaBFYtU/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCfKTCgpCCE0teFxhMu3XzA_MRO0Q" alt="Card image cap"/>
    </a>
    <div class="card-body thumbnail-intro">
      <h6 class="thumbnail-title title-popover" data-toggle="popover" data-trigger="hover" data-placement="top" 
          data-content="The strangest moments from Donald Trump's UN press conference">
        <a href="#"><span>The strangest moments from Donald Trump's UN press conference</span></a>
      </h6>
      <div class="vertical-middle">
        <i class="fas fa-headphones"></i>
        <span>15</span>
      </div>
    </div>
  </div>
</div> */}

$(document).ready(function(){
  var total_page = 246;
  var page = getValue("page");
  var page_item_num = 10;
  //console.log(page);
  ajax_work(page);
  pagination(page, total_page, page_item_num);
  
});

function createCardThumbnail(thumbnail_img, link) {
  var thumbnail_image = document.createElement("img");
  thumbnail_image.setAttribute("class", "card-img-top thumbnail img-center");
  thumbnail_image.setAttribute("src", thumbnail_img);
  const thumbnail_with_link = document.createElement("a");
  thumbnail_with_link.setAttribute("href", link);
  thumbnail_with_link.setAttribute("class", "image-href");
  thumbnail_with_link.appendChild(thumbnail_image);

  return thumbnail_with_link;
}

function createCardBody(title, link) {
  const card_body = document.createElement("div");
  card_body.setAttribute("class", "card-body thumbnail-intro");

  const title_with_popover = document.createElement("h6");
  title_with_popover.setAttribute("class", "thumbnail-title title-popover");
  title_with_popover.setAttribute("data-toggle", "popover");
  title_with_popover.setAttribute("data-trigger", "hover");
  title_with_popover.setAttribute("data-placement", "top");
  title_with_popover.setAttribute("data-content", title);
  const title_with_link = document.createElement("a");
  title_with_link.setAttribute("href", link);
  const title_span = document.createElement("span");
  title_span.innerHTML = title;
  title_with_popover.appendChild(title_with_link.appendChild(title_span));

  card_body.appendChild(title_with_popover);
  return card_body;
}

function ajax_work(page) {
  //console.log(page);
  var pagesize = 8;
  $.ajax({
    type: 'POST',
    url: './database.php',
    //dataType: 'json',
    data: {
    page : page, 
    size : pagesize,
    request: "getVideoList"
    },
    success: function(msg) {
      //console.log(msg);
      ajax_success(msg);
    },
  })
}

function ajax_success(videos_json) {
  var latest_menu = document.getElementsByClassName("latest_menu")[0];
  var videos = JSON.parse(videos_json);
  for(var i in videos) {
    const card_panel = document.createElement("div");
    card_panel.setAttribute("class", "col-12 col-md-6 col-lg-4 col-xl-3 card-panel");
    const card_shadow = document.createElement("div");
    card_shadow.setAttribute("class", "card shadow");
    var link_url = './video_ajax.html?id=' + videos[i]["videoID"]
    const card_thumbnail = createCardThumbnail(videos[i]["thumbnail_img"], link_url);
    const card_body = createCardBody(videos[i]["title"], link_url);
    card_shadow.appendChild(card_thumbnail);
    card_shadow.appendChild(card_body);
    card_panel.appendChild(card_shadow);

    latest_menu.appendChild(card_panel);
  }
  //$('[data-toggle="popover"]').popover();
}

function pagination(page, total_page, page_item_num) {
  var page_item = document.getElementsByClassName("pagination")[0];
  var prev = '';
  var next = '';
  if(page == 1) {
      prev = 'disabled';
  }
  if(page == total_page) {
      next = 'disabled';
  }
  prevpage = page-1;
  nextpage = page+1;
  
  if(page_item_num >= total_page) {
      page_item_num = total_page;
      start = 1;
  } 
  else {
      start = page - Math.floor(page_item_num / 2);
      if(start < 1) {
          start = 1;
      }
      if(start + page_item_num >= total_page) {
          start = total_page - page_item_num + 1;
      }
  }
  end = start + page_item_num - 1;
  var pagination = document.createElement('nav');
  pagination.setAttribute("class", "col-12");
  pagination.setAttribute("aria-label", "Page navigation");
  var paginationItem = document.createElement('ul');
  paginationItem.setAttribute("class", "pagination justify-content-center");
  paginationItem.appendChild(createPageitem("first", "", 1))
  paginationItem.appendChild(createPageitem("prev", prev, prevpage))
  for(var i = start; i <= end; i = i + 1) {
    var activate = "";
        if(i == page) {
            activate = "active";
        }
    pageItem = createPageitem(i, activate, i);
    paginationItem.appendChild(pageItem);
  }
  paginationItem.appendChild(createPageitem("next", next, nextpage))
  paginationItem.appendChild(createPageitem("final", "", total_page))
  pagination.appendChild(paginationItem);
  page_item.appendChild(pagination)
}

function createPageitem(string, activate, hrefPage) {
  pageLink = document.createElement('a');
  pageLink.setAttribute("href", window.location.href.split('?')[0] + "?page=" + hrefPage);
  pageLink.appendChild(document.createTextNode(string));
  pageItem = document.createElement('li');
  pageItem.setAttribute("class", "page-item " + activate);
  pageItem.appendChild(pageLink);
  return pageItem; 
}

function getValue(varname)
{
  var url = window.location.href;
  var varparts = url.split("?");
  if (varparts.length < 2){return 1;}
  var vars = varparts[1].split("&amp;");
  var value = 1;
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
  value = parseInt(value);
  return value;
}
