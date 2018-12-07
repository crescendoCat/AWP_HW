<?php
require_once "../utility.php";
require_once "../database.php";
/* caption.php:
 * @get method parameter
 * id: youtube caption id
 * [videoId: youtube video id] 選用，如果videoId跟id都存在優先使用id
 * [lang: caption language] 選用，如果videoId有才會有效，指定回傳的語言(如果不存在這個語言的字幕回傳空值)
 * @return
 * json type:
 * {
 * "code": int,
 * "discription": string,
 * "caption": [
 * {
 * "seq": int,
 * "start": float,
 * "dur": float,
 * "text": string
 * }
 * ]
 * }
 * code是youtube api query的回應碼，通常200代表正常，403代表字幕需要開放第三方權限。如果code是200以外的情況，不會回傳caption欄位。
 * discription是code的描述，例如code 200的描述是ok。
 * caption是字幕欄位，裡面的內容就是video頁面需要的所有內容
 */
$KEY_FILE_LOCATION = "../../awp-hw-c6644f253e84.json";       // for windows server 2016
$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
FILTER_SANITIZE_URL);
//如果傳來的query沒有帶id 把$captionId設為空

$captionId = (isset($_GET['id'])) ? $_GET['id'] : null;

$client = createGoogleClientWithCredentials($redirect, $KEY_FILE_LOCATION);
$youtube = new Google_Service_Youtube($client);
if(isset($_GET['videoId'])) {
    if(isset($_GET['lang'])) {
        $lang_preg = sprintf("/%s/", $_GET['lang']);
    } else {
        $lang_preg = '/^en/';
    }
    $caption_tracks = $youtube->captions->listCaptions("snippet", $_GET['videoId']);
    foreach ($caption_tracks as $caption_track) {
        if(preg_match($lang_preg, $caption_track['snippet']['language'])) {
            $englighCaptionId = $caption_track['id'];
        }
    }
    $captionId = isset($englighCaptionId)? $englighCaptionId : null;
}
//檢查有沒有$captionId 如果有表示之前的程式有嘗試取得$captionId
//利用$captionId確認字幕有沒有在DB，若有 即從DB取字幕
//若DB沒有該字幕，再利用downloadCaption()從YouTube取得真正的Caption
if(isset($captionId)) {
    if( isset($caption_res_from_db)) {  // Check if captions can be found in DB
        $caption = $caption_res_from_db;
        $code = 200;
        $discription = "ok";
    } else {  // If captions don't exist in DB, get them from YouTube API and store into DB
        try {
            $caption = downloadCaption($youtube, $captionId, $html, true);
        // $thumbnail = $youtube->thumbnail()
            $code = 200;
            $discription = "ok";
        } catch (Google_Service_Exception $e) {
            $code = $e->getCode();
            $discription = $e->getMessage();
        } catch (Google_Exception $e) {
            $code = $e->getCode();
            $discription = $e->getMessage();
        }
    }
    $caption_obj = [
    'code' => $code,
    'discription' => $discription,
    'captionId' => $captionId,
    'caption' => $caption
    ];
    file_put_contents('../caption2.txt', $caption);
    exit(print_r($caption_obj, true));
}
function playlistItemsListByPlaylistId($youtube, $part, $params) {
    $params = array_filter($params);
    $response = $youtube->playlistItems->listPlaylistItems(
        $part,
        $params
    );
    return $response;
}
?>