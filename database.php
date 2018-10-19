<?php

function getVideoList($conn, $page, $size) { 
    if($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $result = $conn->query('SELECT innerID, videoID, thumbnail_link, title, content FROM awp_test.videos LIMIT '.$page*$size.','.$size);
    
    if(!$result) {
        die("Query failed: ". mysqli_error);
    }
    $json_str = '[{';

    while($row = $result->fetch_assoc()){
        $json_str .= '
            "videoID":"'.$row['videoID'].'",
            "thumbnail_link":"'.$row['thumbnail_link'].'",
            "title":"'.$row['title'].'"
        },{';
    }

    $json_str .= '}]';
    return $json_str;
}
?>