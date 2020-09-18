<?php
// ----------------------------конфигурация-------------------------- //

$adminemail="samoylenko.webmaster@gmail.com";  // e-mail админа

$name="Заявка с сайта Jokla";

$headers .= "From: Заявка с сайта Jokla<>\r\n";

$headers .= "Reply-To: \r\n";

//---------------------------------------------------------------------- //


$name = substr(htmlspecialchars(trim($_POST['name'])), 0, 100);
$email = substr(htmlspecialchars(trim($_POST['email'])), 0, 100);

// Answers
$answPost = $_POST['answers'];
$answers = array();
$itt = 0;
foreach ($answPost as $answ) {
    $answers[$itt] = $answ['value'];
    $itt++;
}

$msg=" 

Имя: $msg1

E-mail: $msg2

Ответы: 

Для чего нужно название?: $answers[0]
Ситуация: $answers[1]
Сроки: $answers[2]
Предполагается ли франшиза, собственная сеть?: $answers[3]
Планируете регистрацию названия в Роспатенте?: $answers[4]
Сколько человек будет принимать решение с вашей стороны ?: $answers[5]
Кем вы являетесь в своей компании?: $answers[6]

";

    // Отправляем письмо админу


    mail("$adminemail", "$name", "$msg", "$headers");




?>
