<?php
  // Файлы phpmailer
  require 'PHPMailer/PHPMailer.php';
  require 'PHPMailer/SMTP.php';
  require 'PHPMailer/Exception.php';

  // Переменные, которые отправляет пользователь
  $name = $_POST['name'];
  $contact = $_POST['contact'];
  $text = $_POST['text'];

  // Формирование самого письма
  $title = "Письмо с сайта aptekalegko.ru";
  $body = "
  <h2>Содержание формы: </h2>
  <b>ФИО отправителя:</b> $name<br>
  <b>Контакты:</b> $contact<br><br>
  <b>Сообщение:</b><br>$text
  ";

  // Настройки PHPMailer
  $mail = new PHPMailer\PHPMailer\PHPMailer();
  try {
      //$mail->isSMTP();
      $mail->CharSet = "UTF-8";
      //$mail->SMTPAuth   = true;
      //$mail->SMTPDebug = 2;
      $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

      // Настройки вашей почты
      $mail->Host       = 'smtp.office365.com'; // SMTP сервера вашей почты
      $mail->Username   = 'aptekalegko@garzdrav.ru'; // Логин на почте
      $mail->Password   = 'RQBvaF9Y'; // Пароль на почте
      $mail->SMTPSecure = 'ssl';
      $mail->Port       = 465;
      $mail->setFrom('aptekalegko@garzdrav.ru', 'AptekaLegko'); // Адрес самой почты и имя отправителя

      // Получатель письма
      $mail->addAddress('Mankov.SV@garzdrav.ru');

      // Отправка сообщения
      $mail->isHTML(true);
      $mail->Subject = $title;
      $mail->Body = $body;

      // Проверяем отравленность сообщения
      if ($mail->send()) {$result = "success";}
      else {$result = "error";}

  } catch (Exception $e) {
      $result = "error";
      $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
  }

  // Отображение результата
  echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);
  ?>