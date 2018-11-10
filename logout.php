/** logout file **/
<?php    
require_once __DIR__ . '/assets/libraries/google-api-php-client-2.2.2_PHP54/vendor/autoload.php';    
session_start();

$client = new Google_Client();

$client->setScopes('https://www.googleapis.com/auth/youtube.force-ssl');

// Check if an auth token exists for the required scopes
$tokenSessionKey = 'token-' . $client->prepareScopes();

$accessToken=$_SESSION[$tokenSessionKey];

//Unset token and user data from session    
unset($_SESSION[$tokenSessionKey]);     

//Reset OAuth access token    
$client = new Google_Client();

//$client->revokeToken();    
$client->revokeToken($accessToken);

//Redirect to homepage    
$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/awp_hw/google-api-test.php';    
header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));    
?>