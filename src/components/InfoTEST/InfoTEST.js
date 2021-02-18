import React from "react";
import './InfoTEST.scss'


const InfoTEST = () => {
  return (
    <main className='InfoTEST'>
      <h2>Информация о тестовой версии сайта:</h2>
      <p>- Не подключена подробная информация о товаре - страница представляет собой шаблон. Ждём подключения к 1BF РЛС.</p>
      <p>- Планируется регистрация по СМС коду. E-mail вводить не нужно будет - это поле будет удалено из формы входа.</p>
      <p>- Страницы акции и советы в стадии наполнения, пока стоят заглушки. Ждём контент от наших маркетологов</p>
      <p> </p>
      <p className='InfoTEST__message'>Если нашли баг, прошу прислать баг репорт, со скриншотом, на почту Mankov.SV@garzdrav.ru. Опишите, пожалуйста подробно
        ситуацию или последовательность действий приведшую к некорректной работе объекта внимания, с указанием ожидаемого результата.</p>
    </main>
  )
}

export default InfoTEST