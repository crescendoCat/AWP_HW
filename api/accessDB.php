<?php
require_once '../database.php';

// $KEY_FILE_LOCATION = "../awp-hw-c6644f253e84.json";
// $redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
// FILTER_SANITIZE_URL);

// $client = createGoogleClientWithCredentials($redirect, $KEY_FILE_LOCATION);
// $youtube = new Google_Service_Youtube($client);

// // Receive post request for retrieving caption data from DB
// if(isset($_POST['videoId'])) {

//   // Get captionId from YouTube first
//   if(isset($_GET['lang'])) {
//     $lang_preg = sprintf("/%s/", $_GET['lang']);
//   } else {
//     $lang_preg = '/^en/';
//   }
//   $caption_tracks = $youtube->captions->listCaptions("snippet", $_GET['videoId']);

//   foreach ($caption_tracks as $caption_track) {
//     if(preg_match($lang_preg, $caption_track['snippet']['language'])) {
//         $englighCaptionId = $caption_track['id'];
//     }
//   }
//   $captionId = $englighCaptionId;

//   // Using captionId to retrieve captions from DB
//   $captions_json = getVideoCaption($captionId);
//   exit($captions_json);
// }
// 
// function getVideoCaption($captionId) {
//   $caption_res_from_db = json_decode(getVideoCaption($englighCaptionId));

//   if( count($caption_res_from_db) !== 0 ) {  // Check if captions can be found in DB
//     $en_captions = json_encode($caption_res_from_db);
//     exit($en_captions);
//   } else {  // If captions don't exist in DB, get them from YouTube API and store into DB

//   }
// }

// Receive post request for saving captions(array) into DB
if(isset($_POST['captionId'], $_POST['videoId'], $_POST['captionArray'])) {
  insertVideoCaptionPassingArray($_POST['captionId'], $_POST['videoId'], $_POST['captionArray']);
}

?>