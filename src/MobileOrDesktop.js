import React, {useEffect} from "react";
import {useMediaQuery} from 'react-responsive'
import App from "./App";
import AppMobile from "./AppMobile/AppMobile";
import {fetchCartItems, fetchCities, loadingReset, refreshAuthentication, rewriteCart, setCatalog} from "./actions";
import {connect} from "react-redux";

const MobileOrDesktop = (props) => {

  // если Лоадер висит больше 15сек - удаляем его.
  useEffect(() => {
    let timer = null;
    if (props.loading) {
      const fn = () => {
        if (props.loading) {
          props.loadingReset()
        }
        timer = null;
      }
      timer = setTimeout(fn, 15000)
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

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  return (
    isMobile ? <AppMobile/> : <App/>
  )

}

const mapStateToProps = ({cart, loading}) => {
  return {cart, loading}
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCities: () => dispatch(fetchCities()),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    fetchCartItems: () => dispatch(fetchCartItems()),
    refreshAuthentication: () => dispatch(refreshAuthentication()),
    setCatalog: () => dispatch(setCatalog()),
    loadingReset: () => dispatch(loadingReset())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOrDesktop)