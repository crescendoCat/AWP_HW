<?php
require_once 'database.php';
require_once 'utility.php';
try {
    
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($_FILES['file']['error']) ||
        is_array($_FILES['file']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // Check $_FILES['file']['error'] value.
    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here. 
    if ($_FILES['file']['size'] > 1000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }

    // DO NOT TRUST $_FILES['file']['mime'] VALUE !!
    // Check MIME Type by yourself.
    /*
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($_FILES['file']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }
*/
    // You should name it uniquely.
    // DO NOT USE $_FILES['file']['name'] WITHOUT ANY VALIDATION !!
    // On this example, obtain safe unique name from its binary data.
    /*
    if (!move_uploaded_file(
        $_FILES['file']['tmp_name'],
        sprintf('./uploads/%s.%s',
            sha1_file($_FILES['file']['tmp_name']),
            $ext
        )
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }
    */
	$file = file_get_contents($_FILES['file']['tmp_name']);
	if(isset($_REQUEST['captionid'], $_REQUEST['videoid'])) {
		$conn = connectOurtubeDatabase();
		$result = deleteVideoCaption($_REQUEST['captionid'], $conn);
		if(result === False) {
			http_response_code(500);
			exit(mysqli_error($conn));
		}
		$cap_obj = srtCaptionJsonHelper(srtCaptionParser($file), false);
		$result = insertVideoCaptionPassingArray($_REQUEST['captionid'], $_REQUEST['videoid'], $cap_obj);
		if($result === False) {
			http_response_code(500);
			exit(mysqli_error($conn));
		} else {
			exit('成功上傳字幕! 字幕ID: '.$_REQUEST['captionid'].'影片ID: '.$_REQUEST['videoid']);
		}
	} else {
		http_response_code(404);
		exit('沒有字幕與影片ID');
	}

} catch (RuntimeException $e) {
	http_response_code(500);
    exit($e->getMessage());

}

?>