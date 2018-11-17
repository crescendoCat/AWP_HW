<?php
	require_once __DIR__.'/google-api-php-client-2.2.2/google-api-php-client-2.2.2/vendor/autoload.php';
	session_start();
	
	$json_result='';
	
	if ($_GET['q'] && $_GET['maxResults']) {
		
		
	$client = new Google_Client();
	//$client->setApplicationName("My Project");
	//AIzaSyBPS3aToTVD0SXGNYZpEgAwf43CahHK-58
	$client->setDeveloperKey("AIzaSyBPS3aToTVD0SXGNYZpEgAwf43CahHK-58"); // 輸入你申請的金鑰 //719317849789-of4pur2uvq06859jlbdi72es3b3g7lc5.apps.googleusercontent.com
	$list_id = "PLE3YZlvD6460YuXUH1gdIJAzi57Rf5uwO";//"UC-b2nGm0xLzic38Byti0VjA"; // 欲讀取的頻道id
	$youtube = new Google_Service_Youtube($client);
	$nextPageToken = '';
	$item = array();
	$col = 0;
	
	do {
		
		try
		{
			$playlist = $youtube->playlistItems->listPlaylistItems('snippet', array(
			'playlistId' => $_GET['q'],//$list_id
			'maxResults' => $_GET['maxResults'],//10
			'pageToken' => $nextPageToken,
			));
			
			
			foreach ($playlist['items'] as $key) {
				$item[$col]['col'] = $col;
				$item[$col]['title'] = $key['snippet']['title'];
				$item[$col]['description'] = $key['snippet']['description'];
				$item[$col]['videoId'] = $key['snippet']['resourceId']['videoId'];
				$col += 1;
			}
			$nextPageToken = $playlist['nextPageToken'];
		}
		catch(Exception $excp)
		{
			
			$json_result=$excp->getMessage();
		}
		
	} while (is_null($playlist['nextPageToken']) != true);
	
		//$json_result= json_encode($item, JSON_UNESCAPED_UNICODE);
		for($i=0;$i<count($item);$i++){
			foreach($item[$i] as $k=>$v){
				
				$json_result.=sprintf("%s: %s<br/>",$k,$v);
			}
		}
		
	}

?>

<!doctype html>
<html>
  <head>
    <title>YouTube Search</title>
<link href="//www.w3resource.com/includes/bootstrap.css" rel="stylesheet">
<style type="text/css">
body{margin-top: 50px; margin-left: 50px}
</style>
  </head>
  <body>
    <form method="GET">
  <div>
    Search Playlist: <input type="search" id="q" name="q" >
  </div>
  <div>
    Max Results: <input type="number" id="maxResults" name="maxResults" min="1" max="50" step="1" value="25">
  </div>
  <input type="submit" value="Search">
</form>
<h3>List Info: <em><?php print $_GET['q'] ?></em> </h3>
    <? print_r($json_result) ?>
</body>
</html>
