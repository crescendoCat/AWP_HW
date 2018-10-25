<?php

$mysql_conf = array(
  "host"     => "40.121.221.31",
  "username" => "nthuuser",
  "password" => "1qaz@WSX3edc",
  "dbname"   => "ourtube"
);

$conn = connectOurtubeDatabase($mysql_conf['host'], $mysql_conf['username'], $mysql_conf['password'], $mysql_conf['dbname']);
$data = getVideoInfo($conn);
echo $data;
closeDatabaseConnection($conn);

function connectOurtubeDatabase($host, $username, $password, $dbname) {
  $conn = new mysqli($host, $username, $password, $dbname);
  if ($conn -> connect_error) {
    print "failed";
    die("Connect to database failed: " . $conn -> connect_error);
  } 
  return $conn;
}

function getVideoInfo($conn) {
  $sql = "SELECT YoutubeID, VoicetubeID, Title FROM video LIMIT 5";
  $result = $conn->query($sql);
  $result_array = array();
  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
      array_push($result_array, $row);
    }
  }
  return json_encode($result_array);
}

function closeDatabaseConnection($conn) {
  $conn->close();
}

?>
