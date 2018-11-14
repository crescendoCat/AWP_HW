<?php

require_once "../utility.php";


$KEY_FILE_LOCATION = "../awp-hw-c6644f253e84.json";
$redirect = filter_var('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'],
FILTER_SANITIZE_URL);

$client = createGoogleClientWithCredentials($redirect, $KEY_FILE_LOCATION);
$youtube = new Google_Service_Youtube($client);

if(isset($_GET['id'])) {
    try {
        $caption = downloadCaption($youtube, $_GET['id']);
       // $thumbnail = $youtube->thumbnail()
        exit(<<<END
{
    "code":"200",
    "discription":"OK",
    "caption":"$caption"
}
END
        );
        exit($caption);
    } catch (Google_Service_Exception $e) {
        $code = $e->getCode();
        $discription = $e->getMessage();
            exit(<<<END
{
    "code":"$code",
    "discription":"$discription"
}
END
            );
    } catch (Google_Exception $e) {
        $code = $e->getCode();
        $discription = $e->getMessage();
            exit(<<<END
{
    "code":"$code",
    "discription":"$discription"
}
END
            );
    }
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
