import React, {useState} from "react"
import './Cart.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import pillsIcon from "../../img/pills.svg";
import dataCatds from "../../testData/dataCards";
import SvgCheck from "../../components/UI/icons/SvgCheck";

const {id, img, title, maker, minPrice} = dataCatds[6]

const Cart = () => {
  const [active, setActive] = useState(false);
  return (
    <LayoutDesktop>
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        <section className='Cart__mainContainer'>
          <div className='Cart__item Cart__block'>
            <div className='Cart__descriptionContainerTop'>
              <div className='Cart__imageContainer'>
                {img !== undefined ? <img className='Cart__image' src={img} alt=""/> :
                  <img src={pillsIcon} alt="pills icon" className='CardPage__image'/>}

              </div>

              <div className='Cart__descriptionContainer'>
                <h3>{title}</h3>
                <p className='Cart__maker'>{maker}</p>
                <div className='Cart__buttonToDescription'>
                  <button>В избранное</button>
                  <button>Удалить</button>
                </div>
              </div>

              <div className='Cart__itemPrice'>
                <p className='Cart__price'>от {minPrice} ₽</p>

                <div className='Cart__countButtons'>
                  <button className='Cart__countButtonMinus Cart__countButton'>-</button>
                  <input className='Cart__countInput' type="text" value='1'/>
                  <button className='Cart__countButtonPlus Cart__countButton'>+</button>
                </div>

              </div>
            </div>
            <p className='Cart__caption'>Внешний вид товара может отличаться от изображения на сайте</p>
          </div>

          <div className='Cart__pricePanel Cart__block'>
            <div className='Cart__resultPrice'>Итого: 2 товара на сумму 580 ₽</div>
            <div className='Cart__retail'>
              <p>Забрать из аптеки:</p>
              <span>г. Красноярск, ул. Дмитрия Мартынова, 24</span>
            </div>
            <button className='Cart__button Cart__buttonToCart' onClick={() => {
              setActive(state => !state)
            }}>
              {active ? <SvgCheck style={{color: 'white'}}/> : 'Выбрать аптеку'}
            </button>
          </div>
        </section>

        <section className='Cart__choiceRetail'>
          <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
          <div className='Cart__block'>adsfasdf</div>
        </section>
      </div>
    </LayoutDesktop>
  )
}

export default Cart