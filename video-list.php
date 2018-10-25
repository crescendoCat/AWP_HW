<?
include('database.php');
$conn = connectOurtubeDatabase();
$check = 1;
if(isset($_GET['page']) && $_GET['page'] != '') {
    $page = $_GET['page'];
} else {
    $page = 1;
    $check = 0;
    //echo 'error: No page num!';
}
if(isset($_GET['size']) && $_GET['size'] != '') {
    $size = $_GET['size'];
} else {
    $size = 12;
    $check = 0;
    //echo 'error: No size num!';
}
if($check) {
    echo getVideoList($conn, $page-1, $size);
} else {
    echo 'error: No youtube id!';
    header('Location: index.php');
}
?>



