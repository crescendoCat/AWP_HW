<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Bootstrap Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


	<!-- Bootstrap latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" 
		integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" 
      integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
      
      
    <!-- jQuery first, then Popper.js, then Bootstrap JS, final AJAX -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    
    <!-- our own css and js file -->
	<link rel="stylesheet" type="text/css" href="assets/css/home.css"/>
    <script src="assets/javascripts/home_ajax.js"></script>
    
    <title>OurTube</title>
  </head>
  <body class="bg-light">
<!-- Navbar -->
	<?php
include('utility.php');
echoNavbar();
?>
<!-- End of Navbar -->

<!-- The main content -->
	<!-- This container contains all the items -->
	<div class="container main-content">
	<!-- Within the main container, I use one row item to implement RWD -->
		<div class="row">
		  <div class="col-12">
		    <div class="d-lg-block d-none">
			  <img src="./assets/images/hero_ad_banner.png" alt="banner_ad" class="img-center">
		    </div>
		  </div>
		</div>
		<div class="row">
		<!-- The video part, using "col-sm-9" to keep the spaces between main contents and the sidebar when reading on the screens larger than small ones -->
		  <div class="col-12 col-md-8 col-lg-9 content ">
		  <!-- Using another row item to divide title and videos -->
				<div class="row section-title__latest">
					<h>每日最新影片</h>
				</div>
				<!-- Latest video menu will be insert into below ('.latest_menu') -->
				<!-- Videos here. Using "col-lg-4" class to keep the spaces and using "col-12" class to convert the three-column style to one-column style -->
				<div class="row latest_menu"></div>
        <!-- Pagination here -->
        <div class="row mt-5 pagination"></div>
		  </div>
		  <!-- The sidebar part, using "col-12" to move the whole part under the main content(videos) when reading on small devices. The contents inside use the Bootstrap card component -->
		  <div class="col-12 col-md-4 col-lg-3">
			<div class="card sidebar panel">
			  <img class="card-img-top img-cm" src="https://2.bp.blogspot.com/-6gFTAUHPMxQ/Wxt2YvEiG0I/AAAAAAAAOgU/xdJdvgxzQAI5ELvirno6dHYTD5mXtk1RgCLcBGAs/s1600/0.png" alt="Card image cap">
			  <div class="card-body panel-body">
				<h5 class="card-title panel-heading">
【秋番】2018年10月新番一覽（日本秋季新番列表）</h5>
				<p class="card-text">還沒找到這季要追的新番嗎？</p>
				<a href="http://justlaughtw.blogspot.com/2018/04/2018-10.html" target="_blank" class="btn btn-primary">去看看</a>
			  </div>
			</div>
			<div class="card sidebar">
			  <div class="card-header">
				Featured
			  </div>
			  <ul class="list-group list-group-flush">
				<li class="list-group-item">Cras justo odio</li>
				<li class="list-group-item">Dapibus ac facilisis in</li>
				<li class="list-group-item">Vestibulum at eros</li>
			  </ul>
			</div>
		  </div>
		</div>
	</div>
  </body>
</html>
