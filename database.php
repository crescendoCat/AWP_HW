<?php

function getVideoList($page, $size)
    $conn = mysql_connect('localhost', 'awpuser', 'awpuser');
    $request = mysql_db_query('awp_test', 'SELECT innerID, videoID, thumbnail_link, title, content FROM videos');
    
?>