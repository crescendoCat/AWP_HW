/** logout file **/
<?php    
require_once __DIR__ . '/assets/libraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php';    
session_start();
$OAUTH2_CLIENT_ID = '1049869561605-u8t78rtiee4p0mgike3oft252af70onj.apps.googleusercontent.com';
$OAUTH2_CLIENT_SECRET = '0KOgrDen2l0Taayk2Kuw0Dvh';

$client = new Google_Client();
$client->setClientId($OAUTH2_CLIENT_ID);
$client->setClientSecret($OAUTH2_CLIENT_SECRET);

$client->setScopes('https://www.googleapis.com/auth/youtube.force-ssl');
$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
    FILTER_SANITIZE_URL);
$client->setRedirectUri($redirect);

// Check if an auth token exists for the required scopes
$tokenSessionKey = 'token-' . $client->prepareScopes();

$accessToken=$_SESSION[$tokenSessionKey];

//Unset token and user data from session    
unset($_SESSION[$tokenSessionKey]);     

//Reset OAuth access token    
$client = new Google_Client();

//$client->revokeToken();    
$client->revokeToken($accessToken);

//Destroy entire session
session_destroy();    

//Redirect to homepage    
$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/awp_hw/google-api-test.php';    
header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));    
?>