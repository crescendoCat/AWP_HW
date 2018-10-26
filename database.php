<?php
$host = 'http://40.121.221.31:8888/';


function connectOurtubeDatabase() {
    return mysqli_connect('40.121.221.31', 'nthuuser', '1qaz@WSX3edc');
}

function getVideoCaption($conn, $youtube_id) {
    $query = "SELECT Caption FROM ourtube.video WHERE YoutubeID = '".$youtube_id."'";
    //echo $query;
    $result = $conn->query($query);
    if(!$result) {
        die("Query failed: ". mysqli_error($conn));
    }
    if($row = $result->fetch_assoc()) {
        return $row['Caption'];
    } else {
        return -1;
    }
}

function getVideoTitle($conn, $youtube_id) {
  $query = "SELECT Title FROM ourtube.video WHERE YoutubeID = '".$youtube_id."'";
  $result = $conn->query($query);
    if(!$result) {
        die("Query failed: ". mysqli_error($conn));
    }
    if($row = $result->fetch_assoc()) {
        return $row['Title'];
    } else {
        return -1;
    }
}

function getVideoCount($conn) {
    $query = 'SELECT COUNT(YoutubeID) as video_num FROM ourtube.video';
    $result = $conn->query($query);
    if(!$result) {
        die("Query failed: ". mysqli_error($conn));
    }
    if($count = $result->fetch_assoc()) {
        return $count['video_num'];
    } else {
        return -1;
    }
}


function getVideoList($conn, $page, $size) { 
    global $database_thumbnail_folder_path, $host;
    if($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $query = 'SELECT YoutubeID, VoicetubeID, Title FROM ourtube.video LIMIT '.$page*$size.','.$size;
    $result = $conn->query($query);
    
    if(!$result) {
        die("Query failed: ". mysqli_error($conn));
    }
    $json_str = '[
        ';
    $first = 1;
    while($row = $result->fetch_assoc()){
        $thumbnail_link = $host.$database_thumbnail_folder_path.$row['VoicetubeID'].'/'.$row['YoutubeID'].'.jpg';
        // $thumbnail_link = glob($host.$database_thumbnail_folder_path.$row['VoicetubeID'].'/*.jpg');
        if(!$first) {
            $json_str .= ',';
        }
        $json_str .= '{
            "videoID":"'.$row['YoutubeID'].'",
            "thumbnail_link":"'.$thumbnail_link.'",
            "title":"'.$row['Title'].'"
        }';
        // $json_str .= '{
        //     "videoID":"'.$row['YoutubeID'].'",
        //     "thumbnail_link":"'.$thumbnail_link[0].'",
        //     "title":"'.$row['Title'].'"
        // }';
        $first = 0;
    }

    $json_str .= '
]';
    return $json_str;
}

// Receive ajax post request
if (isset($_POST['request'])) {
    $conn = connectOurtubeDatabase();
    
    if ($conn && $_POST['request'] == "getVideoList") {
        $total_video_num = getVideoCount($conn);
        if ($_POST['page']*$_POST['size'] > $total_video_num) {
            $response = "reachedMax";
        } else {
            $response = getVideoList($conn, $_POST['page'], $_POST['size']);
        }
    }
    exit($response);
}
?>