import React, {useEffect, useState} from "react"
import './Profile.scss'
import BlockWrapper from "../../components/BlockWrapper";
import {Link, Redirect, withRouter} from "react-router-dom";
import {
  addedToCart,
  allItemRemovedFromCart, delToFavorites,
  fetchUserData, getDataProfile,
  getInternetSales,
  itemRemovedFromCart, loadingFalse, loadingTrue,
  logout, refreshAuthentication, setFavoritesProductInfo,
  setSales, setToken, setUserData
} from "../../actions";
import {connect} from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";
import OrdersInternet from "./OrdersInternet/OrdersInternet";
import OrderHistory from "./OrderHistory/OrderHistory";
import ProfileSetting from "./ProfileSetting/ProfileSetting";
import Bonus from "./Bonus/Bonus";
import Favorites from "./Favorites/Favorites";
import service from "../../service/service";

const Profile = (props) => {

  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = props;
  const [changeSetting, setChangeSetting] = useState('setting')

  const [block, setBlock] = useState('main');

  const delFavorites = (guid) => {
    console.log('delFavorites: ', guid)
    service.wrapperRefreshToken(() => props.delToFavorites(guid), props.refreshAuthentication)
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [changeSetting, block])

  useEffect(() => {
    if (props.TOKEN) {
      props.getDataProfile()
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
              <Favorites isCity={props.isCity}
                         data={{addedToCart, itemRemovedFromCart, cart, history, favorites, delFavorites}}
                         setFavoritesProductInfo={props.setFavoritesProductInfo}
                         favoritesProductInfo={props.favoritesProductInfo}
                         loadingTrue={props.loadingTrue}
              />}

              {/*{block === 'favoriteRetail' && <img src={devMessage} alt="В разработке"/>}*/}

              {/*раздел Настройка профиля*/}
              {
                block === 'profileSettings' && <ProfileSetting
                  userData={props.userData}
                  TOKEN={props.TOKEN}
                  fetchUserData={props.fetchUserData}
                  changeSetting={changeSetting}
                  setChangeSetting={setChangeSetting}
                  refreshAuthentication={props.refreshAuthentication}
                  setToken={setToken}
                  loadingTrue={props.loadingTrue}
                  loadingFalse={props.loadingFalse}
                  logout={props.logout}
                  setUserData={props.setUserData}
                />
              }


              <BlockWrapper classStyle='Profile__menu'>
                <ul className='Profile__items'>
                  <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
                  <li className='Profile__item' onClick={() => setBlock('order')}>Интернет заказы</li>
                  <li className='Profile__item' onClick={() => setBlock('historyOrder')}>История покупок</li>
                  <li className='Profile__item' onClick={() => setBlock('favorites')}>Избранное</li>

                  {/*<li className='Profile__item' onClick={() => setBlock('favoriteRetail')}>Любимая аптека <span*/}
                  {/*  style={{color: 'red', fontSize: 12}}>в разработке</span></li>*/}

                  <li className='Profile__item' onClick={() => {
                    setChangeSetting('setting')
                    setBlock('profileSettings')
                  }}>Настройка профиля
                  </li>
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


const mapStateToProps = ({TOKEN, cart, favorites, userData, sales, error, isCity, favoritesProductInfo}) => {
  return {TOKEN, cart, favorites, userData, sales, error, isCity, favoritesProductInfo}
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    loadingFalse: () => dispatch(loadingFalse()),
    setFavoritesProductInfo: (favoritesObject) => dispatch(setFavoritesProductInfo(favoritesObject)), // подробная информация об избранных товарах
    setUserData: (data) => dispatch(setUserData(data)),
    loadingTrue: (info) => dispatch(loadingTrue(info)),
    setToken: (newToken) => dispatch(setToken(newToken)),
    refreshAuthentication: () => dispatch(refreshAuthentication()),
    getDataProfile: () => dispatch(getDataProfile()),
    delToFavorites: (productGuid) => dispatch(delToFavorites(productGuid)), // удаляет из избранного
    fetchUserData: () => dispatch(fetchUserData()), // данные пользователя
    getInternetSales: () => dispatch(getInternetSales()), // интернет заказы
    setSales: () => dispatch(setSales()), // история покупок
    addedToCart: (item) => dispatch(addedToCart(item)), // добавить idProduct в корзину
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)), // удалить idProduct из корзины (count = count - 1)
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)), // удаляет idProduct из корзины (все экземпляры)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))