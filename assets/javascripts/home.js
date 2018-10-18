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
  var latest_menu = document.getElementsByClassName("latest_menu")[0];
  var videos = JSON.parse(latest_videos_json);
  for(var i in videos) {
    const card_panel = document.createElement("div");
    card_panel.setAttribute("class", "col-12 col-md-4 col-xl-3 card-panel");
    const card_shadow = document.createElement("div");
    card_shadow.setAttribute("class", "card shadow");

    const card_thumbnail = createCardThumbnail(videos[i]["thumbnail_img"], videos[i]["link"]);
    const card_body = createCardBody(videos[i]["title"], videos[i]["link"], videos[i]["view"]);
    card_shadow.appendChild(card_thumbnail);
    card_shadow.appendChild(card_body);
    card_panel.appendChild(card_shadow);

    latest_menu.appendChild(card_panel);
  }
  $('[data-toggle="popover"]').popover();
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

function createCardBody(title, link, view) {
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

  const viewded_info = document.createElement("div");
  viewded_info.setAttribute("class", "vertical-middle");
  const headphone_icon = document.createElement("i");
  headphone_icon.setAttribute("class", "fas fa-headphones");
  const view_times = document.createElement("span");
  view_times.innerHTML = view;
  viewded_info.appendChild(headphone_icon);
  viewded_info.appendChild(view_times);

  card_body.appendChild(title_with_popover);
  card_body.appendChild(viewded_info);
  return card_body;
}
