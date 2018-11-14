<?php
require_once 'utility.php';



$autoRedirect = (isset($_POST['autoRedirect']) && $_POST['autoRedirect']=="Yes") ? true : null;
$redirectSsl = (isset($_POST['redirectSSL']) && $_POST['redirectSSL']=="Yes") ? true : null;
$redirectImmediately = (isset($_POST['redirectImmediately']) && $_POST['redirectImmediately']=="Yes") ? true : null;

if(isset($_POST['videoLink'])) {
    $checked[] = (isset($autoRedirect))? 'checked' : ' ';
    $checked[] = (isset($redirectSsl))? 'checked' : ' ';
    $checked[] = (isset($redirectImmediately))? 'checked' : ' ';
    setcookie("form_default", json_encode($checked), time()+360);
} else {
    if(isset($_COOKIE["form_default"])) {

        $checked = json_decode($_COOKIE["form_default"], true);
    } else {
        $autoRedirect = true;
        $redirectSsl = null;
        $redirectImmediately = null;
        $checked[] = (isset($autoRedirect))? 'checked' : ' ';
        $checked[] = (isset($redirectSsl))? 'checked' : ' ';
        $checked[] = (isset($redirectImmediately))? 'checked' : ' ';
        setcookie("form_default", json_encode($checked), time()+360);
    }
}

$htmlBody = <<<END

<div class="container">
  <div class="row">
    <div class="col-12">
      <form method="POST" enctype="multipart/form-data">
        <div class="form-group row">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">Youtube Video Link</span>
            </div>
            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" id="videoLink" name="videoLink" placeholder="Enter Youtube Video Link" required>
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Go</button>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-2">Options</div>
          <div class="col-sm-10">
            <div class="form-check">
              <input class="form-check-input" name="autoRedirect" type="checkbox" value="Yes" id="autoRedirectCheck" $checked[0]>
              <label class="form-check-label" for="gridCheck1">
              Auto Redirect
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" name="redirectSSL" type="checkbox" value="Yes" id="redirectSslCheck" disabled $checked[1]>
              <label class="form-check-label" for="gridCheck1">
              Redirect Using Secure Mode<b>(Recomanded)</b>
              </label>
              <small id="passwordHelpBlock" class="form-text text-muted">
                Redirect using "https://" protocol.
              </small>
            </div>
            <div class="form-check">
              <input class="form-check-input" name="redirectImmediately" value="Yes" type="checkbox" id="redirectImmediatelyCheck" $checked[2]>
              <label class="form-check-label" for="gridCheck1">
              Redirect Immediately
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
END;

// service account secrets
$KEY_FILE_LOCATION = "./awp-hw-c6644f253e84.json";


$client = new Google_Client();
$client->setApplicationName("AWP_HW");
$client->setAuthConfig($KEY_FILE_LOCATION);
$client->setScopes(['https://www.googleapis.com/auth/youtube.force-ssl']);
$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
FILTER_SANITIZE_URL);
$client->setRedirectUri($redirect);

// prevent the server stores another token with different scope
// use the scopes as a session key to store/get the token
$tokenSessionKey = 'token-' . $client->prepareScopes();

// check if the user sent the data or not
if(isset($_POST['videoLink'])) {
    // if so, prepareing for the authentication routine
    
    // check if we have the token or not
    if (isset($_SESSION[$tokenSessionKey])) {
        // if we've already acquired the authentication token, 
        // just use it. 
        $client->setAccessToken($_SESSION[$tokenSessionKey]);
    } else {
        // if we havn't acquired the access token, 
        // calling Google Api Library to get it.
        $client->fetchAccessTokenWithAssertion();
        $_SESSION[$tokenSessionKey] = $client->getAccessToken();
        $htmlBody .= '<p> token isn\'t set, using service account to ask access token<br>';
        $htmlBody .= '<p> and got token = '.$_SESSION[$tokenSessionKey]['access_token'].'<br>';
    }

    // Check to ensure that the access token was successfully acquired.
    if ($client->getAccessToken()) {
        $youtube = new Google_Service_Youtube($client);
        $videoLink = isset($_POST['videoLink']) ? $_POST['videoLink'] : null;
        $query = parse_url($videoLink, PHP_URL_QUERY);
        parse_str($query, $queryResult);
        
        $videoId = isset($queryResult['v']) ? $queryResult['v'] : null;
        try {
            $captions = listCaptions($youtube, $videoId, $htmlBody);
            $htmlBody .= '<ul>';
            foreach ($captions as $line) {
                if(preg_match('/^en/', $line['snippet']['language'])) {
                    $englighCaptionId = $line['id'];
                    //echo $englighCaptionId.'</br>';
                }
                $htmlBody .= sprintf('<li>%s(%s) in %s language</li>', $line['snippet']['name'],
                    $line['id'],  $line['snippet']['language']);
            }
            $htmlBody .= '</ul>';
            if(isset($englighCaptionId)) {
                $responseHeader = '';
                $_SESSION[$videoId] = downloadCaption($youtube, $englighCaptionId, $responseHeader);
                if(isset($redirectSsl)) {
                    $protocol = 'https://';
                } else {
                    $protocol = 'http://';
                }
                $redirect_uri = $protocol . $_SERVER['HTTP_HOST'] . '/awp_hw/video.php?youtubeid=' . $videoId . '&use_session=True';
                $htmlBody .= sprintf("<a href=\"%s\">Go </a>", $redirect_uri);
                //header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
                if(isset($autoRedirect)) {
                    $htmlBody .= sprintf('<div id="counter" countDown="6" redirectUri="%s"></div>',
                    $redirect_uri);  
                    if(isset($redirectImmediately)) {
                        header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));  
                    }
                }
                $htmlBody .= $responseHeader;
            } else {
                $htmlBody .= "<h3>This video does not have an english caption</h3>";
            }
        } catch (Google_Service_Exception $e) {
            $htmlBody .= sprintf('<p>A service error occurred: <code>%s</code></p>',
                'code: '.$e->getCode().'\n'. htmlspecialchars($e->getMessage()));
            $logout_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/awp_hw/logout.php';        

            $htmlBody .= sprintf('<p>Maybe your authentication is out of date, we have refresh the authentication, please </p><a href="%s">try again</a></p>', filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
FILTER_SANITIZE_URL));
        } catch (Google_Exception $e) {
            $htmlBody .= sprintf('<p>An client error occurred: <code>%s</code></p>',
            htmlspecialchars($e->getMessage()));
        }
    }
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



?>
<!doctype html>
<html>
<head>
  <?php echoBootstrapAndJqueryDependencies(); ?>
  <!-- our own css and js file -->
  <script src="assets/javascripts/youtube-captions.js"></script>
  <link rel="stylesheet" type="text/css" href="assets/css/home.css"/>   
<title>Create and manage video caption tracks</title>
</head>
<body>
  <?=$htmlBody?>
</body>
</html>