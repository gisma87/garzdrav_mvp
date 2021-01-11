import React, {useEffect, useState} from "react"
import './Profile.scss'
import BlockWrapper from "../../components/BlockWrapper";
import {Link, Redirect, withRouter} from "react-router-dom";
import {
  addedToCart,
  allItemRemovedFromCart,
  fetchUserData,
  getInternetSales,
  itemRemovedFromCart,
  logout,
  setSales
} from "../../actions";
import {connect} from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";
import devMessage from "../../img/devtMessage.svg";
import OrdersInternet from "./OrdersInternet/OrdersInternet";
import OrderHistory from "./OrderHistory/OrderHistory";
import ProfileSetting from "./ProfileSetting/ProfileSetting";
import Bonus from "./Bonus/Bonus";
import Favorites from "./Favorites/Favorites";

const Profile = (props) => {

  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = props;
  const [changeData, setChangeData] = useState(false)

  const [block, setBlock] = useState('main');

  useEffect(() => {
    if (props.TOKEN) {
      if (!props.userData) {
        props.fetchUserData(props.TOKEN.accessToken)
      }
      props.setSales()
      props.getInternetSales()
    }
  }, [])// eslint-disable-line

  if (props.TOKEN) {
    return (
      <ErrorBoundary>
        <section className='Profile wrapper'>
          <h1>Личный кабинет</h1>
          {!props.userData ? <Loader/> :

            <div className='Profile__mainContainer'>

              {/*раздел Бонусы*/}
              {block === 'main' && <Bonus userData={props.userData}/>}

              {/*раздел Интернет Заказы*/}
              {block === 'order' &&
              <OrdersInternet getInternetSales={props.getInternetSales}
                              internetSales={props.internetSales}
                              cancelOrder={props.cancelOrder}
              />}

              {/*раздел История заказов*/}
              {block === 'historyOrder' && <OrderHistory sales={props.sales}/>}

              {/*раздел Избранное*/}
              {block === 'favorites' &&
              <Favorites item={{addedToCart, itemRemovedFromCart, cart, history, favorites}}/>}

              {block === 'favoriteRetail' && <img src={devMessage} alt="В разработке"/>}

              {/*раздел Настройка профиля*/}
              {
                block === 'profileSettings' && <ProfileSetting
                  userData={props.userData}
                  TOKEN={props.TOKEN}
                  fetchUserData={props.fetchUserData}
                  changeData={changeData}
                  setChangeData={setChangeData}
                />
              }


              <BlockWrapper classStyle='Profile__menu'>
                <ul className='Profile__items'>
                  <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
                  <li className='Profile__item' onClick={() => setBlock('order')}>Интернет заказы</li>
                  <li className='Profile__item' onClick={() => setBlock('historyOrder')}>История покупок</li>
                  <li className='Profile__item' onClick={() => setBlock('favorites')}>Избранное <span
                    style={{color: 'red', fontSize: 12}}>в разработке</span></li>
                  <li className='Profile__item' onClick={() => setBlock('favoriteRetail')}>Любимая аптека <span
                    style={{color: 'red', fontSize: 12}}>в разработке</span></li>
                  <li className='Profile__item' onClick={() => {
                    setChangeData(false)
                    setBlock('profileSettings')
                  }}>Настройка профиля</li>
                </ul>

                <Link to='/' className='Profile__btnOut'
                      onClick={props.logout}
                >Выход из аккаунта</Link>
              </BlockWrapper>
            </div>
          }
        </section>
      </ErrorBoundary>
    )
  }
  return <Redirect to="/"/>
}


const mapStateToProps = ({TOKEN, cart, favorites, userData, sales}) => {
  return {TOKEN, cart, favorites, userData, sales}
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchUserData: () => dispatch(fetchUserData()), // данные пользователя
    getInternetSales: () => dispatch(getInternetSales()), // интернет заказы
    setSales: () => dispatch(setSales()), // история покупок
    addedToCart: (item) => dispatch(addedToCart(item)), // добавить idProduct в корзину
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)), // удалить idProduct из корзины (count = count - 1)
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)), // удаляет idProduct из корзины (все экземпляры)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))