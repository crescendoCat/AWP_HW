<?php
include('database.php');
$conn = connectOurtubeDatabase();
if(isset($_GET['youtubeid'])) {
    $youtubeId = $_GET['youtubeid'];
    echo getVideoTitle($conn, $youtubeId);
} else {
    echo 'error: No youtube id!';
    header('Location: index.php');
}
?>