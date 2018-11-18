<!-- Navbar -->
<?php 
include('utility.php');
include('database.php');
?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	
	
	<!-- Bootstrap Required meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	
	
	<!-- Bootstrap latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" 
		integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" 
      integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
	  
	  
	<!-- Bootstrap Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
	<script src="assets/javascripts/jquery-3.3.1.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	
	
	<!-- our own css and js file -->
	<link rel="stylesheet" type="text/css" href="assets/css/home.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/video_page.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/cmyStyle.css"/>
    <script src="assets/javascripts/cmyYoutubeDataApi.js"></script>
    <script src="assets/javascripts/cmyScript_php.js"></script>
    <script src="assets/javascripts/playlist_video.js"></script>
	
    <!-- <title> php echo $title;  - OurTube</title> -->
</head>
<body>

<?php echoNavbar(); ?>
<!-- End of Navbar -->
    <div class="container main-content">
      <div class="row">
        <!-- The embed video is here-->
        <div class="col-md-7 col-12">
          <div class="video" id="player"></div>
          &nbsp;<div class="d-none d-md-block" id="embed-code">字幕功能：<br />
            1. 影片會與字幕同步，並會隨著向下捲動。<br />
            2. 點選某段字幕後，會自動播放到該段字幕結束暫停。<br />
            3. 使用Youtube播放鍵撥放，會於該段字幕後暫停。<br />
            4. 暫停後，再按Youtube播放鍵即可繼續!</div>
        </div>
        <!-- The subtitle is here-->
        <div class="col-md-5 col-12">
          <div id="container_caption">
            <table border="0" id="table_caption">
                <tbody></tbody>
            <!-- php echoTabldCaption(getJsonCaption($conn, $youtubeid));  -->
            </table>      
          </div>
        </div>
      </div>
      <!-- The embed video is here-->
      <div class="row scrolling-wrapper-flexbox flex-row flex-nowrap"></div>

    </div>
</body>
</html>
