<?php
date_default_timezone_set('Asia/Taipei');
 
if (!file_exists(__DIR__ . '/assets/libraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php')) {
  throw new \Exception('please run "composer require google/apiclient:~2.0" in "' . __DIR__ .'"');
}

require_once __DIR__ . '/assets/libraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php';
/* define the link of the homepage
 * using the link in your file to avoid the
 * possible change of the homepage that makes
 * whole web site die.
 */
/* 定義主要頁面的位置，避免更改了位置之後
 * 導致某些頁面無法運作
 * 請在有使用到
 */
$home_page_link = 'index.php';
$video_playing_page_link = 'video.html';
$database_thumbnail_folder_path = 'Videos/';

/*
 * 輸出Bootstrap跟jQuery的必要css跟js連結
 * 通常用於<head></head>tag裡面
 *
 */

function echoBootstrapAndJqueryDependencies() {
    echo <<<END
    <!-- Bootstrap Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


	<!-- Bootstrap latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" 
		integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" 
      integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
      
      
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
END;

}

/*
 *
 * 使用於輸出網頁最上方之選單列
 * **由於選單列是固定在網頁最上端，因此會遮蔽選單下方的內容**
 * 請使用margin-top或padding-top屬性讓內容空出選單的位置
 */
function echoNavbar() {
    echo '
<div class="container-fluid">
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top navbar-fixed-top">
	  <a class="navbar-brand" href="index.php"><h1>OurTube</h1></a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbar">
		<ul class="navbar-nav mr-auto">
		<li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMainMenu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			  精選頻道
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownMainMenu">
			  <a class="dropdown-item" href="#">中英文雙字幕影片</a>
			  <div class="dropdown-divider"></div>
			  <a class="dropdown-item" href="#">深度英文演講</a>
			  <a class="dropdown-item" href="#">知識型動畫</a>
			  <div class="dropdown-divider"></div>
			  <a class="dropdown-item" href="#">看BBC學英文</a>
			  <a class="dropdown-item" href="#">看CNN學英文</a>
			  <div class="dropdown-divider"></div>
			  <a class="dropdown-item" href="#">TOEIC 多益考試</a>
			  <a class="dropdown-item" href="#">TOFEL 托福考試</a>
			  <a class="dropdown-item" href="#">IELTS 雅思 <span class="badge badge-danger">NEW</span></a>
			  <div class="dropdown-divider"></div>
			  <a class="dropdown-item" href="#">阿滴英文 </a>
			  <a class="dropdown-item" href="#">主編解析 <span class="badge badge-danger">NEW</span></a>
			</div>
		  </li>
		  <li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownLevels" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			  程度分級
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownLevels">
			  <div class="dropright" href="#">
			    <a class="dropdown-item dropdown-toggle" href="#" id="levelsDropdownLevel1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">初級: TOEIC 250-545</a>
				<div class="dropdown-menu" aria-labelledby="levelsDropdownLevel1">
				  <a class="dropdown-item" href="#">a</a>
				</div>
			  </div>
			  <div class="dropright" href="#">
			    <a class="dropdown-item dropdown-toggle" href="#" id="levelsDropdownLevel1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">中級: TOEIC 550-780</a>
				<div class="dropdown-menu" aria-labelledby="levelsDropdownLevel1">
				  <a class="dropdown-item" href="#">a</a>
				</div>
			  </div>
			  <div class="dropright" href="#">
			    <a class="dropdown-item dropdown-toggle" href="#" id="levelsDropdownLevel1" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">高級: TOEIC 785-990</a>
				<div class="dropdown-menu" aria-labelledby="levelsDropdownLevel1">
				  <a class="dropdown-item" href="#">a</a>
				</div>
			  </div>
			</div>
		  </li>
		  <li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			  聽力口說
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
			  <a class="dropdown-item" href="#">每日口說挑戰</a>
			  <a class="dropdown-item" href="#">聽力測驗</a>
			</div>
		  </li>
		  <li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			  社群
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
			  <a class="dropdown-item" href="#">激勵牆</a>
			  <a class="dropdown-item" href="#">翻譯社群</a>
			  <div class="dropdown-divider"></div>
			  <a class="dropdown-item" href="#">VoiceTube Campus</a>
			</div>
		  </li>
		  <li class="nav-item">
		    <a class="nav-link" href="Input.html">匯入影片</a>
		  </li>
        </ul>
        <form class="form-inline" action="search.php" method="get">
          <input class="form-control mr-sm-2" type="search" name="q" placeholder="Simple Search" aria-label="Search" required="required"/>
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
	  </div>
	</nav>
</div>
';
}
/* 使用於輸出分頁按鈕群
 * arguments:
 * $total_page: 總頁數
 * $page: 要顯示的頁碼
 * $size: 每頁顯示的資料筆數
 * $itemnum: 要顯示的按鈕數量--假設$itemnum = 5
 *     ┌----┬-┬---┬---┬---┬---┬---┬---┬---┬-----------┬----┐
 *     |prev|1|...|x-2|x-1| x |x+1|x+2|...|$total_page|next|
 *     └----┴-┴---┴---┴---┴---┴---┴---┴---┴-----------┴----┘
 *                └>     5個按鈕     <┘
 */
function echoPagination($total_page, $page, $size, $itemnum, $addition_arg = '') {
    $prev = '';
    $next = '';
    if($page <= 1) {
        $prev = 'disabled';
    }
    if($page >= $total_page) {
        $next = 'disabled';
    }
    $prevpage = $page-1;
    $nextpage = $page+1;
    
    if($itemnum >= $total_page) {
        $itemnum = $total_page;
        $start = 1;
    } else {
        $start = $page - floor($itemnum / 2);
        if($start < 1) {
            $start = 1;
        }
        if($start + $itemnum >= $total_page) {
            $start = $total_page - $itemnum + 1;
        }
    }
    //echo 'start:'.$start.', page:'.$page.', $itemnum:'.$itemnum;
    echo
'
<nav class="col-12" aria-label="Page navigation">
  <ul class="pagination justify-content-center">
    <li class="page-item '.$prev.'"><a class="page-link" href="?page='.$prevpage.'&'.$addition_arg.'">Previous</a></li>
';
    if($start > floor($itemnum / 2) && $itemnum != $total_page) {
        echo
        '<li class="page-item"><a class="page-link" href="?page=1&'.$addition_arg.'">1</a></li>'.
        '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>';
        
    }
    for($i=$start; $i < $start+$itemnum; $i++) {
        $activate = '';
        if($i == $page) {
            $activate = 'active';
        }
        echo 
        '<li class="page-item '.$activate.'"><a class="page-link" href="?page='.$i.'&'.$addition_arg.'">'.$i.'</a></li>';
    }
    if($start + $itemnum < $total_page && $itemnum != $total_page) {
        echo
        '<li class="page-item disabled"><a class="page-link" href="#">...</a></li>'.
        '<li class="page-item"><a class="page-link" href="?page='.$total_page.'&'.$addition_arg.'">'.$total_page.'</a></li>';
        
    }
    
    echo
'
    <li class="page-item '.$next.'"><a class="page-link" href="?page='.$nextpage.'&'.$addition_arg.'">Next</a></li>
  </ul>
</nav>
';
}
/* 為了避免json字串出現php json_decode函式無法轉換的格式
 * 預先處理json字串
 *
 *
 *
 */
function jsonPreprocess($json) {
//去除json可能的開頭標示字串(BOM)
if (0 === strpos(bin2hex($json), 'efbbbf')) {
   //echo 'removed hidden chars';
   $json = substr($json, 3);
}
//去除LF與換行字元
$json = preg_replace( "/\r|\n/", "", $json );
//將單引號轉換為雙引號
$json = str_replace("'", '"', $json);
//檢查是否有多餘的','並去除
$json = preg_replace('/,\s*([\]}])/m', '$1', $json);
return $json;
}

function card($title, $thumbnail, $youtubeid) {
return
"
<div class=\"col-12 col-md-6 col-lg-4 col-xl-3 card-panel\">
  <div class=\"card shadow video-card\">
    <a href=\"video.php?youtubeid=".$youtubeid."\" class=\"image-href mx-auto\">
      <img class=\"card-img-top thumbnail\" src=\"".$thumbnail."\" alt=\"Card image cap\"/>
    </a>
    <div class=\"card-body thumbnail-intro\">
      <h6 class=\"thumbnail-title title-popover\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"top\" 
          data-content=\"".$title."\">
        <a href=\"#\"><span>".$title."</span></a>
      </h6>
      <!--div class=\"vertical-middle\">
        <i class=\"fas fa-headphones\"></i>
        <span>15</span>
      </div-->
    </div>
  </div>
</div>
";
}
function createGoogleClientWithCredentials($redirect, $keyFileLocation) {
    session_start();

    $client = new Google_Client();
    $client->setApplicationName("AWP_HW");
    $client->setAuthConfig($keyFileLocation);
    $client->setScopes(['https://www.googleapis.com/auth/youtube.force-ssl']);
    $client->setRedirectUri($redirect);
    $client->useApplicationDefaultCredentials();
    // prevent the server stores another token with different scope
    // use tclit;
    return $client;
}
/**
 * Downloads a caption track for a YouTube video. (captions.download)
 *
 * @param Google_Service_YouTube $youtube YouTube service object.
 * @param string $captionId The id parameter specifies the caption ID for the resource
 * that is being downloaded. In a caption resource, the id property specifies the
 * caption track's ID.
 * @param $htmlBody - html body.
 */

function downloadCaption(Google_Service_YouTube $youtube, $captionId, &$htmlBody = null, $asSrt=false) {
    // Call the YouTube Data API's captions.download method to download an existing caption.
    $captionResouce = $youtube->captions->download($captionId, array(
        'tfmt' => "srt"));
    $body = $captionResouce->getBody();
    $contents = $captionResouce->getBody()->getContents();
    //echo $body;
    //file_put_contents('./caption2.txt', $body);
    if(isset($htmlBody)) {
        $code = $captionResouce->getStatusCode(); // 200
        $reason = $captionResouce->getReasonPhrase(); // OK
        $htmlBody .= 'code: '. $code. ',reason: '.$reason. '</br>';
        if ($captionResouce->hasHeader('Content-Length')) {
        $htmlBody .= "Header: </br>";
        }

        // Get a header from the response.
        $htmlBody .= $captionResouce->getHeader('Content-Length'). '</br>';

        // Get all of the response headers.
        foreach ($captionResouce->getHeaders() as $name => $values) {
            $htmlBody .= $name . ': ' . implode(', ', $values) . "</br>";
        }
        $htmlBody .= sprintf("body: %d, content: %d</br>", !empty($body), !empty($contents));
    }

    if(!empty($body)) {
        $srt = $body;
    } else if(!empty($contents)) {
        $srt = $contents;
    }
    if(isset($srt)) {
        $caption = srtCaptionParser($body);
    }
    // Implicitly cast the body to a string and echo it
    if($asSrt) {
        return (isset($caption))? $srt : '';
    } else {
        return (isset($caption))? srtCaptionJsonHelper($caption) : '';
    }
}

function srtCaptionJsonHelper($subs_arr, $to_json=true) {
  $new_captions_obj = [];
  
  foreach($subs_arr as $sub) {
    //seprate the second part and the millisecond part
    $start_str = preg_split('/,/', $sub['startTime']);
    $end_str = preg_split('/,/', $sub['stopTime']);
    
    $offset = strtotime('00:00:00');
    $start = strtotime($start_str[0]);
    $end = strtotime($end_str[0]);
    
    $start_float = floatval($start_str[1])/1000;
    $end_float = floatval($end_str[1])/1000;
    $dur = (float)($end - $start) + $end_float - $start_float;

    $caption_item = [
      'seq' => $sub['number'],
      'start' => $start - $offset + $start_float,
      'end' => $end - $offset + $end_float,
      'dur' => $dur,
      'text' => $sub['text']
    ];

    array_push($new_captions_obj, $caption_item);
  }

  return ($to_json)? json_encode($new_captions_obj) : $new_captions_obj;
}

function srtCaptionParser($string) {
$SRT_STATE_SUBNUMBER = 0;
$SRT_STATE_TIME = 1;
$SRT_STATE_TEXT = 2;
$SRT_STATE_END  = 3;
//file_put_contents('./caption.txt', $string);
$lines   = preg_split('/\n/', $string);
$subs    = array();
$state   = $SRT_STATE_SUBNUMBER;
$subNum  = 0;
$subText = '';
$subTime = '';

foreach($lines as $line) {
    //echo "{".$line."}\n";
    switch($state) {
        case $SRT_STATE_SUBNUMBER:
            //echo "number: ".$line."\n";
            $subNum = trim($line);
            $state  = $SRT_STATE_TIME;
            break;

        case $SRT_STATE_TIME:
            //echo "time: ".$line."\n";
            $subTime = trim($line);
            $state   = $SRT_STATE_TEXT;
            break;
        case $SRT_STATE_END:
            if (trim($line) == '') {           
                //echo "end section: ".$line."\n";
                $sub = array();
                $sub['number'] = $subNum;
                list($sub['startTime'], $sub['stopTime']) = explode(' --> ', $subTime);
                $sub['text']   = $subText;
                $subText     = '';
                $state       = $SRT_STATE_SUBNUMBER;

                $subs[]      = $sub;
                break;
            } else {
                // It is still some text here.
                // Sould'n go into the end state,
                // pass through to next case;
            }
        case $SRT_STATE_TEXT:
            //echo "text: ".$line."\n";
            $subText .= $line;
            $state = $SRT_STATE_END;
            break;

    }
}

if ($state == $SRT_STATE_TEXT) {
    // if file was missing the trailing newlines, we'll be in this
    // state here.  Append the last read text and add the last sub.
    $sub['text'] = $subText;
    $subs[] = $sub;
}
//print_r($subs);
return $subs;
}

?>