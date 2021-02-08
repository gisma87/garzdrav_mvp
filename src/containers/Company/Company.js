import React from "react"
import './Company.scss'
import blockImg from '../../img/test/block.jpg'
import logoPrice from '../../img/company/logoPrice.png'
import company2 from '../../img/company/company2.png'
import company3 from '../../img/company/company3.png'
import company4 from '../../img/company/company4.png'
import company5 from '../../img/company/company5.png'
import company6 from '../../img/company/company6.png'


const Company = (props) => {

  return (
    <div className='Company wrapper'>
      <div className="Company__infoBlock">
        <h1 className='Company__title'>Интернет аптека Легко</h1>
        <p>Удобный интернет-сервис поиска и бронирования лекарств, товаров для красоты и здоровья
          в аптеках вашего города. Вы можете найти наиболее выгодные предложения по цене
          на аптечные товары, бронировать их и выкупать в удобной для вас аптеке.
        </p>
      </div>

      <div className="Company__infoBlock">
        <h2 className='Company__title'>Аптеки партнёры</h2>
        <div className="Company__partners">
          <div className="Company__imgPartners-block">
            <img className='Company__imgPartners' src={blockImg} alt=""/>
            <p className="Company__imgPartners-label">Гармония здоровья</p>
          </div>
          <div className="Company__imgPartners-block">
            <img className='Company__imgPartners' src={blockImg} alt=""/>
            <p className="Company__imgPartners-label">Дешёвая аптека</p>
          </div>
          <div className="Company__imgPartners-block">
            <img className='Company__imgPartners' src={blockImg} alt=""/>
            <p className="Company__imgPartners-label">Аптека Всем</p>
          </div>
          <div className="Company__imgPartners-block">
            <img className='Company__imgPartners' src={blockImg} alt=""/>
            <p className="Company__imgPartners-label">Аптека Эвалар</p>
          </div>
        </div>
      </div>

      <div className="Company__infoBlock">
        <h2 className='Company__title'>Преимущества</h2>
        <div className="Company__advantage">

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={logoPrice} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Низкие цены</h4>
              <p className="Company__imgAdvantage-labelText">Вы можете выбирать
                минимальную цену из возможных</p>
            </div>
          </div>

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={company2} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Широкий ассортимент</h4>
              <p className="Company__imgAdvantage-labelText">Вы можете забронировать все товары,
                которые есть в наличии в аптеках</p>
            </div>
          </div>

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={company3} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Удобство и скорость</h4>
              <p className="Company__imgAdvantage-labelText">Для сбора заказа нам нужно
                всего 30 минут</p>
            </div>
          </div>

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={company4} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Гарантия качества</h4>
              <p className="Company__imgAdvantage-labelText">Мы работаем только с проверенными
                поставщиками и производителями</p>
            </div>
          </div>

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={company5} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Оплата бонусами</h4>
              <p className="Company__imgAdvantage-labelText">Вы можете оплатить до 50%
                заказа бонусами по карте Легко</p>
            </div>
          </div>

          <div className="Company__imgAdvantage-block">
            <img className='Company__imgAdvantage' src={company6} alt=""/>
            <div className="Company__imgAdvantage-labelBlock">
              <h4 className="Company__imgAdvantage-labelTitle">Акции и скидки</h4>
              <p className="Company__imgAdvantage-labelText">Мы регулярно проводим акции
                и снижаем цены на популярные товары</p>
            </div>
          </div>

        </div>
      </div>


    </div>
  )
}


export default Company