<?php 

require_once "utility.php";


?>
<!DOCTYPE html>
<html style="height:100%">
<head>
<?php echoBootstrapAndJqueryDependencies(); ?>
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

<script src="assets/libraries/js-session-library.js"></script>
<script src="assets/javascripts/caption-editor.js"></script>
<link rel="stylesheet" href="assets/css/caption-editor.css">
</head>
<body style="height:100%">
<?php echoNavbar()?>
<div class="container-fluid" style="padding-top:5rem;height:100%">
  <div class="row" style="height:100%">
    <div class="col-6" >
      <div class="col-12">
       <form id="form">
          <input type="file" name="file" id="file" />
          <input type="submit" name="do" id="do" value="submit" />
        </form>
	  </div>
      <div id="caption-editor"></div>
    </div>
    <div class="col-6">
      <div class="video" id="player"></div>
      <p id="text-line" >NULL</p>
    </div>
 </div>
</div>
</body>


<script type="text/javascript">

var caption,
	editor,
	video_id = getValue("youtubeid");


editor = new MYAPP.CaptionEditor('caption-editor', {
  videoId: video_id,
  captionArea: 'text-line',

  events: {
  	onCaptionInserted: onCaptionInserted,
  	onCaptionUpdated:  onCaptionUpdated,
  	onCaptionDeleted:  onCaptionDeleted
  }
});


function onCaptionInserted(event) {
	console.log(editor.captionId());
	console.log('inserted: ' , event);
	var obj = {
		captionid: editor.captionId(),
		sequence: event.data.seq,
		start: event.data.start,
		dur: event.data.dur,
		text: event.data.text,
	};
	console.log(JSON.stringify(obj));
	$.post("./api/caption-api.php",
		{
			action: 'insert',
			data: JSON.stringify(obj)
		},
	  function(data) {
	  	alert('insert result: '+ data);
	  	console.log(data);
	  }
	);
}


function onCaptionUpdated(event) {
	console.log(editor.captionId());
	console.log('updated: ' , event);
	var obj = {
		captionid: editor.captionId(),
		sequence: event.data.seq,
		start: event.data.start,
		dur: event.data.dur,
		text: event.data.text,
	};
	console.log(JSON.stringify(obj));
	$.post("./api/caption-api.php",
		{
			action: 'update',
			data: JSON.stringify(obj)
		},
	  function(data) {
	  	alert('update result: '+ data);
	  	console.log(data);
	  }
	);
}


function onCaptionDeleted(event) {
	console.log(editor.captionId());
	console.log('deleted: ' , event);
	var obj = {
		captionid: editor.captionId(),
		sequence: event.data.seq,
	};
	console.log(JSON.stringify(obj));
	$.post("./api/caption-api.php",
		{
			action: 'delete',
			data: JSON.stringify(obj)
		},
	  function(data) {
	  	alert('delete result: '+ data);
	  	console.log(data);
	  }
	);
}


function onYouTubeIframeAPIReady() {
    console.log(video_id);
    console.log(editor);
    // as soon as the youtube iframe api is ready, 
    // you can call the editor to setup the youtube iframe player.

    //提供一個youtube player
    editor.configureYoutubePlayer('player', '100%', '360');
}


$("form").submit(function(e){
  e.preventDefault();     

  	if(confirm('確定要刪除目前編輯的字幕，並上傳新的字幕嗎?')) {
  		// Using Form Data class to send a form request to server
		var fd = new FormData();
		fd.append("captionid", editor.captionId());
		fd.append("videoid", video_id);
		fd.append("file", document.getElementById("file").files[0]);  

		//var fd = new FormData(document.getElementById("form"));
		var xhr = new XMLHttpRequest();
		xhr.open("POST" ,"upload_caption.php" , true);
		xhr.send(fd);
		xhr.onload = function(e) {
			console.log(e);
			if (this.status == 200) {  //Successed
				alert(this.responseText);
				editor.loadCaption(video_id);
				$('caption-editor').text('');
			} else if(this.status == 404) {  // User mistake
				alert('檔案錯誤，請重新上傳檔案。 詳細資料：'+this.responseText);
			} else if(this.status == 500) {  // Server error ( or something wrong on MySQL service)
				alert('伺服器出現暫時性的錯誤，請稍後再試，或聯絡管理員。 詳細資料：'+this.responseText);
			}
		};
		return;
	} else {
		//do nothing
	}
});
</script>

</html>