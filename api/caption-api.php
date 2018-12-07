<?php
require_once "../utility.php";
require_once "../database.php";
if(isset($_POST['action'], $_POST['data'])) {  //checking the request
	// calling database.php function to establish the connection to MySQL server
	$conn = connectOurtubeDatabase();
	// print the data for debug
	// echo $_POST['data'];
	$data = json_decode($_POST['data']);
	$discription = '';
	$success = 0;
	switch($_POST['action']) {
	case 'insert':
	// Since 'insertSingleVideoCaption' will update instead of insert a record when
	// there is another record with same primary key in the database, 
	// the insert action and the update action are using same code section
	// 
	case 'update':
		$result = insertSingleVideoCaption(
			$data->captionid,
			$data->sequence,
			$data->start,
			$data->dur,
			$data->text,
			$conn
		);
		if($result === True) {
			$success = 1;
			$discription = 'ok';
		} else {
			$success = 0;
			$discription = mysqli_error($conn);
		}
		break;
	case 'delete':
		$result = deleteSingleVideoCaption(
			$data->captionid,
			$data->sequence,
			$conn
		);
		if($result === True) {
			$success = 1;
			$discription = 'ok';
		} else {
			$discription = mysqli_error($conn);
		}
		break;
	}
	$ret = [
		'success' => $success,
		'discription' => $discription
	];
} else {
	// dump the debug message
	$act =  $_POST['action'];
	$id = $_POST['caption_id'];
	$data = $_POST['data'];
	$str = <<<END
debug: 
action: "$act"
caption_id: "$id"
data: "$data"
END;
	$ret = [
		'success' => 0,
		'discription' => $str
	];
}
exit(json_encode($ret));
?>