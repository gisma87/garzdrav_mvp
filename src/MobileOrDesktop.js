import React, {useEffect} from "react";
import {useMediaQuery} from 'react-responsive'
import App from "./App";
import AppMobile from "./AppMobile/AppMobile";
import {fetchCartItems, fetchCities, refreshAuthentication, rewriteCart, setCatalog} from "./actions";
import {connect} from "react-redux";

const MobileOrDesktop = (props) => {

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

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

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
    setCatalog: () => dispatch(setCatalog())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileOrDesktop)