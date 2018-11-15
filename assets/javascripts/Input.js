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
  createInputzone();
});

function createInputzone() {
  const inputzone = document.getElementById("inputZone");
  const textzone = document.createElement("div");
  const buttonzone = document.createElement("button");
  textzone.setAttribute("class", "form-group");
  const inputTitle = document.createElement("label");
  const inputText = document.createElement("input");
  inputTitle.setAttribute("for", "url");
  inputTitle.appendChild(document.createTextNode("Please enter Youtube URL:"))
  inputText.setAttribute("type", "text");
  inputText.setAttribute("class", "form-control");
  inputText.setAttribute("id", "url");
  textzone.appendChild(inputTitle);
  textzone.appendChild(inputText);
  inputzone.appendChild(textzone);
  buttonzone.setAttribute("type", "submit");
  buttonzone.setAttribute("class", "btn btn-default");
  buttonzone.setAttribute("onclick", "buttonClick()");
  buttonzone.appendChild(document.createTextNode("submit"));
  inputzone.appendChild(buttonzone);
}

function buttonClick() {
  const outputzone = document.getElementById("output");
  $("#output").empty();
  var url = fillHttps(document.getElementById("url").value);
  if(checkURL(url) == false) alert("The input URL is not a Youtube URL");
  else 
  {
    var URL_information = getYTValue(url);
    getVideojson(URL_information[0], URL_information[1]);
  }
}

function getVideojson(videoID, listID)
{
  if(listID == "")// video
  {
    $.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {part: "snippet", id: videoID, key: "AIzaSyBAEWdxVn_cac8vQko7jnDXKXqZOvMez0Y"},
      function(response){
        if(response.items.length == 0) alert("No video");
        else putVideo(makeVideojson(response));
      }
    )
  }
  else //list
  {
    $.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {part: "snippet", playlistId: listID, key: "AIzaSyBAEWdxVn_cac8vQko7jnDXKXqZOvMez0Y", maxResults: 50},
      function(response){
        if(response.items.length == 0) alert("No video");
        else putVideo(makeVideojson(response));
      }
    )
  }
  
}

function makeVideojson(video)
{
  //console.log(video);
  var result_json = "[";
  if(video.items.length == 1)
  {
    result_json = result_json +  "{\n" + 
      "\"videoID\":\"" + video.items[0].id + "\",\n" + 
      "\"thumbnail_img\":\"" + video.items[0].snippet.thumbnails.default.url + "\",\n" +
      "\"title\":\"" + video.items[0].snippet.title + "\"\n" +
      "}";
  }
  else
  {
    for(i = 0; i < video.items.length; i++)
    {
      if(typeof video.items[i].snippet.thumbnails == "undefined")
      {
        result_json = result_json +  "{\n" + 
          "\"videoID\":\"" + video.items[i].snippet.resourceId.videoId + "\",\n" + 
          "\"title\":\"" + video.items[i].snippet.title + "\"\n" +
          "}";
      }
      else
      {
        result_json = result_json +  "{\n" + 
          "\"videoID\":\"" + video.items[i].snippet.resourceId.videoId + "\",\n" + 
          "\"thumbnail_img\":\"" + video.items[i].snippet.thumbnails.default.url + "\",\n" +
          "\"title\":\"" + video.items[i].snippet.title + "\"\n" +
          "}";
      }
      
      if(i < video.items.length - 1) result_json += ",";
    }
  }
  
  result_json = result_json + "]";
  console.log(result_json);
  return result_json;
  
  
}

function putVideo(videos_json) {
  //console.log(videos_json);
  var menu = document.getElementById("output");
  var videos = JSON.parse(videos_json);
  //console.log(videos);
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

    menu.appendChild(card_panel);
  }
  //$('[data-toggle="popover"]').popover();
}

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


function getYTValue(url)
{
  //console.log(url);
  //var url = window.location.href;
  if(tinyurl(url))
  {
    return getTinyurlValue(url);
  }
  var videoID = "";
  var listID = "";
  var varparts = url.split('?');
  //console.log(varparts);
  if (varparts.length < 2){return 0;}
  var parts = varparts[1].split("&");
  for(i = 0; i < parts.length ; i++)
  {
    
    var name = parts[i].split("=")[0];
    var value = parts[i].split("=")[1];
    if(name == "v")
    {
      videoID = value;
    }
    
    if(name == "list")
    {
      listID = value;
    }
  }
  return {0: videoID, 1: listID};
}

function getTinyurlValue(url)
{
  url.match(/(http:|https:|)\/\/(youtu.be)\/([A-Za-z0-9._%-]*)(\&\S+)?/);
  return {0: RegExp.$3, 1: ""};
}

function checkURL (url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8

    var result = url.match(/(http:|https:|)\/\/(www.)?(youtu(be\.com|\.be))\/([A-Za-z0-9._%-]*)(\&\S+)?/);
    if(result == null) return false;
    else return true;
}

function tinyurl(url)
{
  var result = url.match(/(http:|https:|)\/\/(youtu.be)\/([A-Za-z0-9._%-]*)(\&\S+)?/);
  if(result == null) return false;
  else return true;
}

function fillHttps(url)
{
  var result = url.match(/(http:|https:|)\/\/([A-Za-z0-9._%-]*)(\&\S+)?/);
  if(result == null) return "https://" + url;
  else return url;
}