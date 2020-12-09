import React, {useEffect, useRef, useState} from "react"
import './Profile.scss'
import BlockWrapper from "../../components/BlockWrapper";
import FavoriteItem from "../../components/FavoriteItem";
import {Link, Redirect, withRouter} from "react-router-dom";
import {useMediaQuery} from 'react-responsive'
import SvgCheck from "../../components/UI/icons/SvgCheck";
import {addedToCart, allItemRemovedFromCart, fetchUserData, itemRemovedFromCart, logout, setSales} from "../../actions";
import {connect} from "react-redux";
import CardItemMobile from "../../components/CardItemMobile";
import dataCatds from "../../testData/dataCards";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";
import SvgAngleUpSolid from "../../img/SVGcomponents/SvgAngleUpSolid";


// раздел Настройка профиля
const ProfileSetting = (props) => {

  return (
    <BlockWrapper classStyle='ProfileSetting'>
      <h4>Настройки профиля</h4>
      <form>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Телефон</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>+7{props.userData.phone}</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>E-mail</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>{props.userData.email}</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Имя</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>
              {`${props.userData.lastName} ${props.userData.firstName} ${props.userData.middleName}`}
            </p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Дата рождения</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>{props.userData.birthDate.match(/\d{4}-\d\d-\d\d/g)}</p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Пол</p>

          <div className='ProfileSetting__itemContainer'>
            <div>

              <input type="radio"
                     readOnly
                     id="genderChoice1"
                     name="gender"
                     value="male"
                     checked={props.userData.gender}
              />
              <label htmlFor="genderChoice1">Мужской</label>
            </div>

            <div>
              <input type="radio" id="genderChoice2"
                     name="gender" value="female"
                     readOnly
                     checked={!props.userData.gender}
              />
              <label htmlFor="genderChoice2">Женский</label>
            </div>
          </div>


        </BlockWrapper>
        <p className='ProfileSetting__changePass'>Сменить пароль</p>
        <button type='submit' className='ProfileSetting__submit'>Сохранить изменения</button>
      </form>
    </BlockWrapper>
  )
}

// раздел Избранное
const Favorites = ({item}) => {
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = item;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }
  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {!isMobile &&
        favorites.map((item) => {

          return <FavoriteItem key={item + Math.random()}
                               itemId={item}
                               item={{addedToCart, itemRemovedFromCart, cart, handlerToCards}}/>
        })
        }

        {isMobile && favorites.map((itemId) => {
          const itemIndex = cart.findIndex((item) => +item.itemId === +itemId);
          const isActive = itemIndex >= 0;
          const {img, title, maker, minPrice, id} = dataCatds[itemId - 1];
          return <CardItemMobile onItemSelected={handlerToCards}
                                 updateToCart={() => {
                                   !isActive ? addedToCart(id) : itemRemovedFromCart(id);
                                 }}
                                 active={isActive}
                                 key={itemId}
                                 id={itemId}
                                 title={title}
                                 maker={maker}
                                 img={img}
                                 minPrice={minPrice}
                                 favoriteButton={true}

          />
        })}

      </div>
    </BlockWrapper>
  )
}

// раздел Бонусы
const Bonus = props => {
  return (
    <BlockWrapper classStyle='ProfileSetting'>
      <h4>Бонусы: </h4>
      <BlockWrapper classStyle='ProfileSetting__item'>
        <p className='ProfileSetting__itemTitle'>Бонусная карта</p>
        <p className='ProfileSetting__info'>№ {props.userData.barcode}</p>

      </BlockWrapper>
      <BlockWrapper classStyle='ProfileSetting__item'>
        <p className='ProfileSetting__itemTitle'>Накоплено бонусов за всё время</p>
        <div className='ProfileSetting__itemContent'>
          <p className='ProfileSetting__info'>{props.userData.accumulationBalance}</p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='ProfileSetting__item'>
        <p className='ProfileSetting__itemTitle'>Текущий баланс</p>
        <div className='ProfileSetting__itemContent'>
          <p className='ProfileSetting__info'>
            {props.userData.currentBalance}
          </p>
        </div>
      </BlockWrapper>
      <BlockWrapper classStyle='ProfileSetting__item'>
        <p className='ProfileSetting__itemTitle'>Вместе с картой вы совершили покупок на общую сумму:</p>
        <p className='ProfileSetting__info'> {props.userData.saleBalance} ₽</p>
      </BlockWrapper>


      <p className='Bonus__signature'>Подробную историю зачисления / списания бонусов можно посмотреть в
        истории ваших заказов</p>

    </BlockWrapper>
  )
}

// раздел Заказы (текущие)
const Orders = props => {
  return (
    <BlockWrapper classStyle='ProfileSetting'>
      <h4>Заказы: </h4>
      <BlockWrapper classStyle='ProfileSetting__item'>
        <p className='ProfileSetting__itemTitle'>Текущие заказы</p>
        <p className='ProfileSetting__info'>в разработке</p>
      </BlockWrapper>
    </BlockWrapper>
  )
}


const OrderContent = props => {

  const [contentDisabled, setContentDisabled] = useState(false)
  const [height, setHeight] = useState(0)
  const [styleContent, setStyleContent] = useState({})
  const content = useRef(null)

  useEffect(() => {
    setHeight(content.current.clientHeight)
  }, [])

  const {item, delay} = props

  function calcAmount(product) {
    const sum = (product.priceRetail - product.spendBonus - product.discount) * product.quantity
    return Math.round(sum * 100) / 100
  }

  function animationHeightContent(t) {
    setStyleContent({height: height})
    setTimeout(() => setStyleContent({}), t)
  }

  function collapse() {
    let a = 0
    let timer = setInterval(() => {
      if (a < height) {
        if (a < 100) {
          setStyleContent({height: a, visibility: 'hidden'})
        } else {
          setStyleContent({height: a})
        }
        a += 15
      }
    }, 1)

    setTimeout(() => {
      clearInterval(timer)
      setStyleContent({})
    }, 200);
  }

  function expand() {
    let a = height < 500 ? height : 500;
    const TIME_ANIMATION = 300
    const step =  a / TIME_ANIMATION // step px нужно увеличивать каждую 1ms
  }

  return (
    <div className='OrderHistory__wrapper' style={{animationDelay: `${delay}s`}}>
      <div className='OrderHistory__headerItem'>
        <p className='OrderHistory__title'>Заказ А-14344615 от {item.dateDocument}</p>
        <div className='OrderHistory__rightHeader'>
          {contentDisabled &&
          <p className='OrderHistory__priceHeader'>
            {item.sumDocument} ₽
          </p>}
          <div className={'OrderHistory__iconContainer' + (contentDisabled ? ' rotate' : '')}
               onClick={() => {
                 !contentDisabled
                   ? animationHeightContent(100)
                   : collapse();
                 !contentDisabled
                   ? setContentDisabled(!contentDisabled)
                   : setTimeout(() => setContentDisabled(!contentDisabled), 150)
               }}
          >
            <SvgAngleUpSolid className='OrderHistory__arrowIcon'/>
          </div>
        </div>
      </div>
      <div
        className={'OrderHistory__content' + (contentDisabled ? ' OrderHistory__contentDisabled' : '')}
        ref={content}
        style={styleContent}
      >
        {item.items.map(product => <BlockWrapper classStyle='OrderHistory__product'>
            <p className='OrderHistory__productTitle'>{product.title}</p>
            <p className='OrderHistory__info'>Куплено: {product.quantity} шт по {product.priceRetail} ₽</p>
            <p className='OrderHistory__info'>Начислено бонусов: <span
              className='positive'>{product.accumulationBonus}</span></p>
            <p className='OrderHistory__info'>Списано бонусов: <span
              className={product.spendBonus > 0 ? 'negative' : ''}>{product.spendBonus}</span></p>
            {product.discount > 0 && <p className='OrderHistory__info'>Скидка: {product.discount}</p>}
            <p
              className='OrderHistory__sumProduct'>{calcAmount(product)} ₽</p>
          </BlockWrapper>
        )}
        <div className='OrderHistory__infoContainer'>
          <p className='OrderHistory__infoItem'>Начислено всего бонусов: <span
            className='positive'>{item.accumulationBonus}</span></p>
          <p className='OrderHistory__infoItem'>Потрачено всего бонусов: <span
            className={item.spendBonus > 0 ? 'negative' : ''}>{item.spendBonus}</span></p>
          <p className='OrderHistory__amount'>Итого: {item.sumDocument} ₽</p>
        </div>
      </div>
    </div>
  )
}

// раздел История заказов
const OrderHistory = props => {
  const orders = props.sales.filter(item => item.type === 'Реализация')
  console.log('ORDERS', orders);
  let delay = 0;
  return (
    <BlockWrapper classStyle='OrderHistory'>
      <h2>История заказов</h2>
      {
        orders.map(item => {
          delay += .07
          return <OrderContent key={item.dateDocument} item={item} delay={delay}/>
        })
      }

    </BlockWrapper>
  )
}


// страница Личный кабинет
const Profile = (props) => {

  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = props;

  const [block, setBlock] = useState('main');

  useEffect(() => {
    if (props.TOKEN) {
      if (!props.userData) {
        props.fetchUserData()
      }
      props.setSales()
    }
  }, [])// eslint-disable-line

  if (props.TOKEN) {
    return (
      <ErrorBoundary>
        {!props.userData ? <Loader/> :
          <section className='Profile wrapper'>
            <h1>Личный кабинет</h1>
            <div className='Profile__mainContainer'>

              {/*раздел Бонусы*/}
              {block === 'main' && <Bonus userData={props.userData}/>}

              {/*раздел Заказы*/}
              {block === 'order' && <Orders/>}

              {/*раздел История заказов*/}
              {block === 'historyOrder' && <OrderHistory sales={props.sales}/>}

              {/*раздел Избранное*/}
              {block === 'favorites' &&
              <Favorites item={{addedToCart, itemRemovedFromCart, cart, history, favorites}}/>}

              {block === 'favoriteRetail' && <BlockWrapper classStyle='Profile__menu'>
                <p>ЛЮБИМАЯ АПТЕКА</p>
              </BlockWrapper>}

              {/*раздел Настройка профиля*/}
              {block === 'profileSettings' && <ProfileSetting userData={props.userData}/>}


              <BlockWrapper classStyle='Profile__menu'>
                <ul className='Profile__items'>
                  <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
                  <li className='Profile__item' onClick={() => setBlock('order')}>Заказы</li>
                  <li className='Profile__item' onClick={() => setBlock('historyOrder')}>Истории заказов</li>
                  <li className='Profile__item' onClick={() => setBlock('favorites')}>Избранное</li>
                  <li className='Profile__item' onClick={() => setBlock('favoriteRetail')}>Любимая аптека</li>
                  <li className='Profile__item' onClick={() => setBlock('profileSettings')}>Настройка профиля</li>
                </ul>

                <Link to='/' className='Profile__btnOut'
                      onClick={props.logout}
                >Выход из аккаунта</Link>
              </BlockWrapper>
            </div>
          </section>}
      </ErrorBoundary>
    )
  }
  return <Redirect to="/"/>
}


const mapStateToProps = (
  {
    TOKEN, cart, favorites, userData, sales
  }
) => {
  return {TOKEN, cart, favorites, userData, sales}
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchUserData: () => dispatch(fetchUserData()),
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    setSales: () => dispatch(setSales())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))