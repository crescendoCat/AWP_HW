<?php
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
		    <a class="nav-link" href="#">匯入影片</a>
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
  <div class=\"card shadow\">
    <a href=\"video.php?youtubeid=".$youtubeid."\" class=\"image-href mx-auto\">
      <img class=\"card-img-top thumbnail\" src=\"".$thumbnail."\" alt=\"Card image cap\"/>
    </a>
    <div class=\"card-body thumbnail-intro\">
      <h6 class=\"thumbnail-title title-popover\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"top\" 
          data-content=\"".$title."\">
        <a href=\"#\"><span>".$title."</span></a>
      </h6>
      <div class=\"vertical-middle\">
        <i class=\"fas fa-headphones\"></i>
        <span>15</span>
      </div>
    </div>
  </div>
</div>
";
}
?>