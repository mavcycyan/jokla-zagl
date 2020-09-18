<?php
    require_once 'questions.php';

    $curId = 0;
    $postData = $_POST['id'];

    if($postData) {
        $curId = $postData;
    }

    if ($data[$curId]) {
        echo json_encode($data[$curId]);
    } else {
        echo json_encode(array('wasLast' => 'true'));
    }
?>
