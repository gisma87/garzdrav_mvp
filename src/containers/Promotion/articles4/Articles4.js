import React from "react";
import './Articles4.scss'
import img_01 from "../../../img/articllesImg/promotion4/img_1.jpg"

const Article4 = () => {
  return (
    <section className='Article4 wrapper'>
      <h1 className='Article4__mainTitle'>Получить выгоду – Легко!</h1>
      <img src={img_01} alt="карта Легко"/>
      <p className='Article4__description'>И это не просто слоган!</p>
      <p className='Article4__description'>Легко – это единая бонусная карта.</p>
      <p className='Article4__description'>Отличительной особенностью данной карты является её универсальность, бонусы
        по карте можно получать и тратить в интернет-аптеке «Легко», в аптеках «Гармония здоровья», «Дешевая аптека»,
        «Аптека Всем», «Эвалар», а также в сети оптик «Очень Оптика».</p>
      <p className='Article4__description'>Вам больше не нужно носить с собой несколько карт, достаточно всего одной –
        единой бонусной карты «Легко».</p>
      <p className='Article4__description'>Бонусная программа по карте «Легко» гибкая и полностью зависит от ваших покупок– покупатели могут получить бонусами на карту от 2% до 15%, потратить бонусы на любые покупки, оплатив до 50% чека.
        А также только для держателей карты «Легко» в аптеках действуют специальные акции и бонусы.
      </p>
      <p className='Article4__description'>Присоединяйтесь к владельцам
        <a target="_blank" rel="noopener noreferrer" href='http://kartalegko.ru/'> карты Легко </a> и получайте 50 приветственных бонусов в подарок!</p>
    </section>
  )
}

export default Article4