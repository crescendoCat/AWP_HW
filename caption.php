<?php
include('database.php');
include('utility.php');
$conn = connectOurtubeDatabase();
if(isset($_GET['youtubeid'])) {
    $youtubeId = $_GET['youtubeid'];
    exit(jsonPreprocess(getVideoCaption($conn, $youtubeId)));
} else {
    echo 'error: No youtube id!';
    header('Location: index.php');
}
?>