<?php
$host = 'http://40.121.221.31:8888/';
$database_thumbnail_folder_path = 'Videos/';
$apiKey="AIzaSyBPS3aToTVD0SXGNYZpEgAwf43CahHK-58";

class Video{
	public $videoId;
	public $title;
	public $description;
	public $video_width;
	public $video_height;
	public $thumbnail_url;
	public $thumbnail_width;
	public $thumbnail_height;
	public $author_url;
	public $author_name;
	public $channelId;
	// The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
	public $publishDate;
	
	// param: The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
	// Return: standard datetime format in php
	function convertIso8601toDateTime($iso8601Datetime){
		 return date('Y-m-d h:i:s', strtotime(substr($iso8601Datetime,0,19)));
	}	
}


function connectOurtubeDatabase() {
    return new mysqli('40.121.221.31', 'nthuuser', '1qaz@WSX3edc', 'ourtube');
}

function getVideoCaption($caption_id) {
    $mysqli = new mysqli("40.121.221.31", "nthuuser", "1qaz@WSX3edc", "ourtube");	
	if($mysqli->connect_error){
        debug_to_console("Connection failed: ".$mysqli->connect_error);
        $mysqli->close();
		return null;
    }
    
    $sql=sprintf("select sequence, start, duration, content from caption where captionid='%s' order by sequence ASC;", $caption_id);
    // debug_to_console("sql:".$sql);

    $result = $mysqli->query($sql);
    if(!$result){
		debug_to_console("Failed to select captions data from caption table!" . mysqli_error($mysqli));
		$mysqli->close();
		return null;
	}
    
    $rows=mysqli_num_rows($result);
    // debug_to_console("returned rows:".$rows);

    if($rows!==0){
        $captions_data = [];
        while($row = $result->fetch_assoc()) {
            $caption_item = [
                'seq' => $row['sequence'],
                'start' => $row['start'],
                'end' => $row['start'] + $row['duration'],
                'dur' => $row['duration'],
                'text' => $row['content']
            ];

            array_push($captions_data, $caption_item);    
        }

        $mysqli->close();
        return json_encode($captions_data);
    } else {
        return null;
    }

}

// Previous one: get captions of the videos both exists in YouTube & VoiceTube
// function getVideoCaption($conn, $youtube_id) {
//     $query = "SELECT Caption FROM ourtube.video WHERE YoutubeID = '".$youtube_id."'";
//     //echo $query;
//     $result = $conn->query($query);
//     if(!$result) {
//         die("Query failed: ". mysqli_error($conn));
//     }
//     if($row = $result->fetch_assoc()) {
//         return $row['Caption'];
//     } else {
//         return -1;
//     }
// }

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

function getVideoSearchList($conn, $q, $page, $size) { 
    global $database_thumbnail_folder_path, $host;
    if($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $query = 'SELECT YoutubeID, VoicetubeID, Title FROM ourtube.video WHERE Title LIKE '.$q.' LIMIT '.$page*$size.','.$size;
    //echo $query;
    $result = $conn->query($query);
    
    if(!$result) {
        die("Query failed: ". mysqli_error($conn));
    }
    $query2 = 'SELECT Count(YoutubeID) as total FROM ourtube.video WHERE Title LIKE '.$q;

    $total_result = $conn->query($query2);
    
    if(!$total_result) {
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
    
    if($num = $total_result->fetch_assoc()) {
        $total_num = $num['total'];
    }
    
    $json_str .= '
]';
    return Array($json_str, $total_num);
}

/**
 * Simple helper to debug to the console
 *
 * @param $data object, array, string $data
 * @param $context string  Optional a description.
 *
 * @return string
 */
function debug_to_console( $data, $context = 'Debug in Console' ) {

    // Buffering to solve problems frameworks, like header() in this and not a solid return.
    ob_start();

    $output  = 'console.info( \'' . $context . ':\' );';
    $output .= 'console.log(' . json_encode( $data ) . ');';
    $output  = sprintf( '<script>%s</script>', $output );

    echo $output;
}

// Database insert. Insert caption info to the Caption table
function insertVideoCaption(
	$captionId,	// The caption id from Youtube
	$videoId,	// The video id from Youtube
	$sequence,	// The sequence number to the text content 
	$start,		// The start time of the caption
	$duration,	// The duration of the caption
	$content,	// The text content of the caption
    $conn
){
	if($conn->connect_error) {
		
        debug_to_console("Connection failed: " . $conn->connect_error);
		if(!is_null($conn)){
			mysqli_close($conn);
		}
		return;
    }
	/*
	$sql=sprintf("select * from ourtube.video_caption where videoid='%s' and captionId='%s';"
	,$videoId,$captionId);
	$result = $conn->query($sql);
	
	if(!$result) {
		debug_to_console("Query failed: ". mysqli_error($conn));
		mysqli_close($conn);
		return; 
    }
	
	$rows=mysqli_num_rows($result);
    */
	debug_to_console('rows:'.$rows);
	// Close db connection
	
	// Set autocommit to off
	//mysqli_autocommit($mysqli,FALSE);

	//$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

	
		$sql= sprintf("Insert ignore into Video_Caption(videoId, captionId) values('%s','%s');",$videoId,$captionId); 
		$result = $conn->query($sql);
		
		if($result!==True){
			debug_to_console("Failed to insert data to Video_Caption!");
			return;
		}
		
		debug_to_console("Succeeded to insert into table video_caption;");
		
		$sql=sprintf("insert into Caption(captionId,sequence,start,duration,content)			values('%s',%d,'%s','%s','%s') ;",$captionId,$sequence,$start,$duration,$content);
        $result = $conn->query($sql);
		if($result===True){
			debug_to_console("Succeeded to insert into table caption;");
		}else{
			debug_to_console("Faile to insert into table caption;");
		}
	
		
	//debug_to_console("sql: ".$sql);	
	
	//close the connection;	
}

function insertVideoCaptionPassingArray(
    $captionId,
    $videoId,
    $captionArray // should be an array like[]
){
    $conn = connectOurtubeDatabase();
	if($conn->connect_error) {
		
        debug_to_console("Connection failed: " . $conn->connect_error);
		if(!is_null($conn)){
			mysqli_close($conn);
		}
		return;
    }
	/*
	$sql=sprintf("select * from ourtube.video_caption where videoid='%s' and captionId='%s';"
	,$videoId,$captionId);
	$result = $conn->query($sql);
	
	if(!$result) {
		debug_to_console("Query failed: ". mysqli_error($conn));
		mysqli_close($conn);
		return; 
    }
	
	$rows=mysqli_num_rows($result);
    */
	// debug_to_console('rows:'.$rows);
	// Close db connection
	
	// Set autocommit to off
	//mysqli_autocommit($mysqli,FALSE);

	//$mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

	
    $sql= sprintf("Insert ignore into video_caption(videoId, captionId) values('%s','%s');",$videoId,$captionId); 
    $result = $conn->query($sql);
    if($result!==True){
        debug_to_console("Failed to insert data to Video_Caption!");
        die("Query Failed: ".mysqli_error($conn));
    }
    $sql = "insert ignore into caption(captionId,sequence,start,duration,content) values";
    $first = True;
	foreach($captionArray as $caption) {		
        if($first) {
            $delim = '';
            $first = False;
        } else {
            $delim = ',';
        }
        // $sql .=sprintf("%s('%s', %d, '%s', '%s', '%s')\n", $delim, $captionId, $caption->seq,$caption->start,$caption->dur,$caption->text);
        $sql .=sprintf("%s('%s', %d, '%s', '%s', '%s')\n", $delim, $captionId, $caption['seq'],$caption['start'],$caption['dur'],$caption['text']);
    }
    //file_put_contents("sql_log.txt", $sql);
    if($conn->query($sql)===True){
        debug_to_console("Succeeded to insert into table caption;");
        //die("Query Failed: ".mysqli_error($conn));
    }else{
        debug_to_console("Faile to insert into table caption;");
        die("Query Failed: ".mysqli_error($conn));
    }
		
	//debug_to_console("sql: ".$sql);	
	
	//close the connection;	
}


// Database insert. Insert video info into YoutubeVideo table.
function insertYoutubeVideio($Video){
	$mysqli=new mysqli("40.121.221.31", "nthuuser", "1qaz@WSX3edc","ourtube");	
	if($mysqli->connect_error){
		debug_to_console("Connection failed: ".$mysqli->connect_error);
		return;
	}

	$sql= sprintf("Select * from YoutubeVideo where videoId='%s';",$Video->videoId); 
	debug_to_console("sql:".$sql);
	$result=$mysqli->query($sql);
	if(!$result){
		debug_to_console("Failed to select the YoutubeVideo!".mysqli_error($mysqli));
		$mysqli->close();
		return;
	}	
	
	$rows=mysqli_num_rows($result);
	debug_to_console("returned rows:".$rows);
	if($rows==0){
		$sql= sprintf("insert ignore into YoutubeVideo(videoId,title,description,video_width,video_height,thumbnail_url,thumbnail_width,thumbnail_height,author_url,author_name,channelId,publishDate) values('%s','%s','%s',%d,%d,'%s',%d,%d,'%s','%s','%s','%s');"
		,$Video->videoId,$Video->title,$Video->description,$Video->video_width,$Video->video_height,$Video->thumbnail_url,$Video->thumbnail_width,$Video->thumbnail_height,$Video->author_url,$Video->author_name,$Video->channelId,$Video->publishDate); 
		
		$mysqli->query($sql);
		if(!$mysqli){
			debug_to_console("Failed to insert data into YoutubeVideo!");
			$mysqli->close();
			return;
		}else{
			debug_to_console("Succeeded to insert data into YoutubeVideo!");
		}
	}
	
	// close the objec
	$mysqli->close();
}

// Database Update

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
