<?php

/**
 * This sample creates and manages caption tracks by:
 *
 * 1. Uploading a caption track for a video via "captions.insert" method.
 * 2. Getting the caption tracks for a video via "captions.list" method.
 * 3. Updating an existing caption track via "captions.update" method.
 * 4. Download a caption track via "captions.download" method.
 * 5. Deleting an existing caption track via "captions.delete" method.
 *
 * @author Ibrahim Ulukaya
 */

/**
 * Library Requirements
 *
 * 1. Install composer (https://getcomposer.org)
 * 2. On the command line, change to this directory (api-samples/php)
 * 3. Require the google/apiclient library
 *    $ composer require google/apiclient:~2.0
 */
require_once 'utility.php';

date_default_timezone_set('Asia/Taipei');
 
if (!file_exists(__DIR__ . '/assets/libraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php')) {
  throw new \Exception('please run "composer require google/apiclient:~2.0" in "' . __DIR__ .'"');
}

require_once __DIR__ . '/assets/labraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php';
session_start();

$htmlBody = <<<END

<div class="container">
  <div class="row">
    <div class="col-12">
      <form method="POST" enctype="multipart/form-data">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-default">Youtube Video Link</span>
          </div>
          <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" id="videoLink" name="videoLink" placeholder="Enter Youtube Video Link">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Go</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
END;

/*
 * You can acquire an OAuth 2.0 client ID and client secret from the
 * {{ Google Cloud Console }} <{{ https://cloud.google.com/console }}>
 * For more information about using OAuth 2.0 to access Google APIs, please see:
 * <https://developers.google.com/youtube/v3/guides/authentication>
 * Please ensure that you have enabled the YouTube Data API for your project.
 */
$OAUTH2_CLIENT_ID = '1049869561605-u8t78rtiee4p0mgike3oft252af70onj.apps.googleusercontent.com';
$OAUTH2_CLIENT_SECRET = '0KOgrDen2l0Taayk2Kuw0Dvh';

$client = new Google_Client();
$client->setClientId($OAUTH2_CLIENT_ID);
$client->setClientSecret($OAUTH2_CLIENT_SECRET);

/*
 * This OAuth 2.0 access scope allows for full read/write access to the
 * authenticated user's account and requires requests to use an SSL connection.
 */
$client->setScopes('https://www.googleapis.com/auth/youtube.force-ssl');
$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
    FILTER_SANITIZE_URL);
$client->setRedirectUri($redirect);

// Define an object that will be used to make all API requests.
$youtube = new Google_Service_YouTube($client);

// Check if an auth token exists for the required scopes
$tokenSessionKey = 'token-' . $client->prepareScopes();
if (isset($_GET['code'])) {
  if (strval($_SESSION['state']) !== strval($_GET['state'])) {
    die('The session state did not match.');
  }

  $client->authenticate($_GET['code']);
  $_SESSION[$tokenSessionKey] = $client->getAccessToken();
  header('Location: ' . $redirect);
}

if (isset($_SESSION[$tokenSessionKey])) {
  $client->setAccessToken($_SESSION[$tokenSessionKey]);
}

// Check to ensure that the access token was successfully acquired.
if ($client->getAccessToken()) {
  // This code executes if the user enters an action in the form
  // and submits the form. Otherwise, the page displays the form above.
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $videoLink = isset($_POST['videoLink']) ? $_POST['videoLink'] : null;
    $query = parse_url($videoLink, PHP_URL_QUERY);
    parse_str($query, $queryResult);
    
    $videoId = isset($queryResult['v']) ? $queryResult['v'] : null;
    try {
      $captions = listCaptions($youtube, $videoId, $htmlBody);
      foreach ($captions as $line) {
        if($line['snippet']['language'] == 'en') {
          $englighCaptionId = $line['id'];
          //echo $englighCaptionId.'</br>';
        }
        $htmlBody .= sprintf('<li>%s(%s) in %s language</li>', $line['snippet']['name'],
            $line['id'],  $line['snippet']['language']);
      }
  $htmlBody .= '</ul>';
  $htmlBody .= '<div id="counter" countDown="6"></div>';
      if(isset($englighCaptionId)) {
        $caption = downloadCaption($youtube, $englighCaptionId, $htmlBody);
        //echo $caption;
      }
      if(isset($caption)) {
        $_SESSION[$videoId] = $caption;
        
        $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/awp_hw/video.php?youtubeid=' . $videoId . '&use_session=True';
        $htmlBody .= sprintf("<a href=\"%s\">Go </a>", $redirect_uri);
        //header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
        $htmlBody .= <<<END
    <script>
        var myVar = setInterval(function() {
            var div = document.querySelector("#counter");
            var count = Number(div.attributes['countDown'].value) - 1;
            if (count > 0) {
                div.innerHTML = "This page will be redirect in " + count + " second(s).";
                div.setAttribute("countDown", count);
            } else if (count <= 0) {
                div.innerHTML = "Redirecting ...";
                window.location = "$redirect_uri";
                clearInterval(myVar);
            }
        }, 1000);
    </script>
END;
      } else {
        $htmlBody .= "<h3>This video does not have an english caption</h3>";
      }
    } catch (Google_Service_Exception $e) {
      $htmlBody .= sprintf('<p>A service error occurred: <code>%s</code></p>',
          'code: '.$e->getCode().'\n'. htmlspecialchars($e->getMessage()));
           $logout_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/awp_hw/logout.php';        

      $htmlBody .= sprintf('<p>Maybe your authentication is out of date, try to</p><a href="%s">login again</a></p>', $logout_uri);
    } catch (Google_Exception $e) {
      $htmlBody .= sprintf('<p>An client error occurred: <code>%s</code></p>',
          htmlspecialchars($e->getMessage()));
    }
  }
  $_SESSION[$tokenSessionKey] = $client->getAccessToken();
} elseif ($OAUTH2_CLIENT_ID == 'REPLACE_ME') {
  $htmlBody = <<<END
  <h3>Client Credentials Required</h3>
  <p>
    You need to set <code>\$OAUTH2_CLIENT_ID</code> and
    <code>\$OAUTH2_CLIENT_ID</code> before proceeding.
  <p>
END;
} else {
  // If the user hasn't authorized the app, initiate the OAuth flow
  $state = mt_rand();
  $client->setState($state);
  $_SESSION['state'] = $state;

  $authUrl = $client->createAuthUrl();
  $htmlBody = <<<END
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card" style="width: 50%;">
          <div class="card-body">
            <h5 class="card-title">請求使用者授權</h5>
            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
            <p class="card-text">哈嘍！我們想請您同意我們存取您的Google帳戶，來取得Youtube上面的字幕</p>
            <a href="$authUrl" class="btn btn-primary">同意授權</a>
            <a href="#" class="btn btn-secondary">不同意</a>
          </div>
        </div>
      </div>
    </div>
  </div>
END;
}

/**
 * Returns a list of caption tracks. (captions.listCaptions)
 *
 * @param Google_Service_YouTube $youtube YouTube service object.
 * @param string $videoId The videoId parameter instructs the API to return the
 * caption tracks for the video specified by the video id.
 * @param $htmlBody - html body.
 */
function listCaptions(Google_Service_YouTube $youtube, $videoId, &$htmlBody) {
  // Call the YouTube Data API's captions.list method to retrieve video caption tracks.
  $captions = $youtube->captions->listCaptions("snippet", $videoId);

  return $captions;
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
function downloadCaption(Google_Service_YouTube $youtube, $captionId, &$htmlBody) {
    // Call the YouTube Data API's captions.download method to download an existing caption.
    $captionResouce = $youtube->captions->download($captionId, array(
        'tfmt' => "srt"));
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
    $body = $captionResouce->getBody();
    // Implicitly cast the body to a string and echo it
    $caption = srtCaptionParser($body);
    return srtCaptionJsonHelper($caption);
}

function srtCaptionJsonHelper($subs) {
    $json_str = "[";
    $first = 1;
    foreach($subs as $sub){
        //seprate the second part and the millisecond part
        $start_str = split(',', $sub['startTime']);
        $end_str = split(',', $sub['stopTime']);
        //echo $sub['startTime'].', '.$sub['stopTime']."</br>";
        $offset = strtotime('00:00:00');
        $start = strtotime($start_str[0]);
        $end = strtotime($end_str[0]);
        
        $start_float = floatval($start_str[1])/1000;
        $end_float = floatval($end_str[1])/1000;
        $dur = (float)($end - $start) + $end_float - $start_float;
        //echo "$start, $end, $dur</br>";
        if(!$first) {
            $json_str .= ',';
        }
        $json_str .= sprintf('{
        "seq": "%d",
        "start": "%s",
        "dur": "%s",
        "text": "%s"
}',
        $sub['number'],
        $start-$offset+$start_float,
        $dur,
        $sub['text']);
        $first = 0;
    }
    $json_str .= ']';
    return $json_str;
}

function srtCaptionParser($string) {
$SRT_STATE_SUBNUMBER = 0;
$SRT_STATE_TIME = 1;
$SRT_STATE_TEXT = 2;
$SRT_STATE_END  = 3;
echo '</br>split string</br>';
//file_put_contents('./caption.txt', $string);
$lines   = split("\n", $string);
echo 'parsing</br>';
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

<!doctype html>
<html>
<head>
  <?php echoBootstrapAndJqueryDependencies(); ?>
  <!-- our own css and js file -->
  <link rel="stylesheet" type="text/css" href="assets/css/home.css"/>   
<title>Create and manage video caption tracks</title>
</head>
<body>
  <?=$htmlBody?>
</body>
</html>