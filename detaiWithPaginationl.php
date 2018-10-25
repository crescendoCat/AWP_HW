<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>Ourtube Paginatin</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <script type="text/javascript" src="Scripts/jquery-1.8.0.min.js"></script>
	<link rel="stylesheet" type="text/css" href="Style/style.css">
	
	<script type="text/javascript">
	$(document).ready(function(){
		changePagination('0');	
	});
	
	function changePagination(pageId){
     $(".flash").show();
     $(".flash").fadeIn(400).html('Loading <img src="ajax-loader.gif" />');
     
	 var dataString = 'pageId='+ pageId;
     $.ajax({
           type: "POST",
           url: "loadData.php",
           data: dataString,
           cache: false,
           success: function(result){
			$(".flash").hide();
			$("#pageData").html(result);
           }
      });
}
</script>
  </head>
  <body>
    <h1>Ourtube</h1>

	<div id="pageData"></div>
	<span class="flash"></span>

</body>
</html>