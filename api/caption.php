<?php

require_once "../utility.php";
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
 
//KEY FILE的位置是相對於本檔案的位置
$KEY_FILE_LOCATION = "../../awp-hw-c6644f253e84.json";
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
    $captionId = $englighCaptionId;
}
//檢查有沒有$captionId 如果有表示之前的程式有嘗試取得$captionId
//之後再利用downloadCaption()取得真正的Caption
if(isset($captionId)) {
    try {
        $caption = downloadCaption($youtube, $captionId);
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
    $caption_obj = [
      'code' => $code,
      'discription' => $discription,
      'caption' => json_decode($caption)
    ];
    exit(json_encode($caption_obj));
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
