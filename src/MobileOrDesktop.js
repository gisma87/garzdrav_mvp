import React, {useEffect, useState} from "react";
import {useMediaQuery} from 'react-responsive'
import App from "./App";
import AppMobile from "./AppMobile/AppMobile";
import {
  fetchCartItems,
  fetchCities,
  loadingReset,
  refreshAuthentication,
  rewriteCart,
  setCatalog,
  setFalseIsDelCartItems
} from "./actions";
import {connect} from "react-redux";
import Alert from "./components/UI/Alert/Alert";

const MobileOrDesktop = (props) => {

  // если Лоадер висит больше 20сек - удаляем его.
  useEffect(() => {
    let timer = null;
    if (props.loading) {
      const fn = () => {
        if (props.loading) {
          props.loadingReset()
        }
        timer = null;
      }
      timer = setTimeout(fn, 20000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line
  }, [props.loading])

  useEffect(() => {
    props.fetchCities();
    props.setCatalog()

    if (localStorage.getItem("TOKEN")) {
      props.refreshAuthentication()
    }

    if (localStorage.getItem("cart")) {
      props.rewriteCart(JSON.parse(localStorage.getItem("cart")))

      // серия запросов - формируется массив элементов корзины
      props.fetchCartItems()
    }
  }, [])// eslint-disable-line

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(props.cart));
  }, [props.cart])

  useEffect(() => {
    if (props.isDelCartItem) {
      props.setFalseIsDelCartItems()
      setAlertShow(true)
    }// eslint-disable-next-line
  }, [props.isDelCartItem])

  const [alertShow, setAlertShow] = useState(false)

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  return (
    <>
      {isMobile ? <AppMobile/> : <App/>}
      <Alert show={alertShow} onClose={() => setAlertShow(false)} title='Информируем: '>
        <p>Часть товаров из корзины была удалена, т.к. их нет в наличии в вашем городе.</p>
      </Alert>
    </>
  )

}

const mapStateToProps = (
  {
    cart, loading, isDelCartItem
  }
) => {
  return {cart, loading, isDelCartItem}
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCities: () => dispatch(fetchCities()),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    fetchCartItems: () => dispatch(fetchCartItems()),
    refreshAuthentication: () => dispatch(refreshAuthentication()),
    setCatalog: () => dispatch(setCatalog()),
    loadingReset: () => dispatch(loadingReset()),
    setFalseIsDelCartItems: () => dispatch(setFalseIsDelCartItems())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOrDesktop)