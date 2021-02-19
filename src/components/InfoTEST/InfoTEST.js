import React from "react";
import './InfoTEST.scss'


const InfoTEST = () => {
  return (
    <main className='InfoTEST'>
      <h2>Информация о тестовой версии сайта:</h2>
      <h3>Уже работает: </h3>
      <p className='InfoTEST__paragraph'>— Поиск товара по базе с актуальными ценами.</p>
      <p className='InfoTEST__paragraph'>— Регистрация (пока по e-mail, позже только по телефону) / Личный кабинет</p>
      <p className='InfoTEST__paragraph'>— Просмотр истории офлайн покупок по бонусной карте / статус бонусной карты
        (движение баллов)</p>
      <p className='InfoTEST__paragraph'>— Просмотр истории интернет заказов, их статус, возможность отменить заказ,
        если он ещё не исполнен, повторить заказ</p>
      <p className='InfoTEST__instruction'>Заказ товара: Ему присваивается номер / статус "Принят". <b>Текущий статус
        можно посмотреть в личном кабинете в Истории заказов.</b>
        В терминале аптеке загорается зелёным раздел Интернет. В этом разделе список интернет заказов со всеми
        требуемыми данными. МПМ закрепляет заказ за собой нажатием на кнопку "Принять", и далее
        после сборки изменяет на статус "Собран". После покупки изменяет на статус "Выполнен" и привязывает заказ к
        чеку.</p>
      <h3>Пока не работает: </h3>
      <ul>
        <li><p className='InfoTEST__paragraph'>ВХОД В ЛИЧНЫЙ КАБИНЕТ ТОЛЬКО ПО E-mail КОДУ. <i>При первой регистрации
          пароль придёт вам на e-mail
          и его
          даже можно будет изменить, но войти с помощью него нельзя. Так как функционал настроен под СМС-оповещения и
          вход
          по номеру телефона. И до подключения СМС-сервиса не работает.</i></p></li>
        <li><p className='InfoTEST__paragraph'>Не подключена подробная информация о товаре - страница представляет собой
          шаблон. Ведётся подключение к РЛС.</p></li>
        <li><p className='InfoTEST__paragraph'>Планируется регистрация по СМС коду. E-mail вводить не нужно будет - это
          поле будет удалено из формы
          входа.</p></li>
        <li><p className='InfoTEST__paragraph'>Страницы акции и советы в стадии наполнения, пока стоят заглушки. Ждём
          контент от наших
          маркетологов</p></li>
      </ul>
      <p className='InfoTEST__message'>Если нашли баг, прошу прислать баг репорт, со скриншотом, на почту
        Mankov.SV@garzdrav.ru. Опишите, пожалуйста подробно
        ситуацию или последовательность действий приведшую к некорректной работе объекта внимания, с указанием
        ожидаемого результата.</p>
    </main>
  )
}

export default InfoTEST