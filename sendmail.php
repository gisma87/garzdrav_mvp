<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './src/utils/PHPMailer/src/Exception.php'
require './src/utils/PHPMailer/src/PHPMailer.php'

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', './language/');
$mail->IsHTML(true);

$mail->setFrom('aptekalegko@garzdrav.ru', 'AptekaLegko');
$mail->addAddress('Mankov.SV@garzdrav.ru');
$mail->Subject = 'Сообщение от AptekaLegko';

$body = '<h1>Содержание письма: </h1>'

$body.='<p><strong>ФИО: </strong> '.$_POST['name'].'</p>';
$body.='<p><strong>Контакты: </strong> '.$_POST['contact'].'</p>';
$body.='<p><strong>Сообщение: </strong> '.$_POST['text'].'</p>';

if(!mail->send()) {
$message = 'Ошибка';
} else {
$message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>