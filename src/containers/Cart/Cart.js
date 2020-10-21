import React, {useState} from "react"
import './Cart.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import dataCatds from "../../testData/dataCards";
import SvgCheck from "../../components/UI/icons/SvgCheck";
import CartItem from "../../components/CartItem";
import RetailCheckPanel from "../../components/RetailCheckPanel";
import BlockWrapper from "../../components/BlockWrapper";

const {id, img, title, maker, minPrice} = dataCatds[6]

const Cart = () => {
  const [active, setActive] = useState(false);
  return (
    <LayoutDesktop>
      <div className='Cart wrapper'>
        <h1>Корзина</h1>
        <section className='Cart__mainContainer'>

          <div className='Cart__itemContainer'>
            <CartItem item={dataCatds[6]} style={'Cart__item'}/>
            <CartItem item={dataCatds[5]} style={'Cart__item'}/>
            <CartItem item={dataCatds[4]} style={'Cart__item'}/>
            <CartItem item={dataCatds[3]} style={'Cart__item'}/>
          </div>

          <BlockWrapper style='Cart__pricePanel'>
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
          </BlockWrapper>
        </section>

        <section className='Cart__choiceRetail'>
          <h2 className='Cart__titleChoice'>Дешевле всего: </h2>
          <RetailCheckPanel/>
        </section>
      </div>
    </LayoutDesktop>
  )
}

export default Cart