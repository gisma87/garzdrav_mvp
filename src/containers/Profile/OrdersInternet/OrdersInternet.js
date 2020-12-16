import React, {useState} from "react";
import './OrdersInternet.scss'
import apiService from "../../../service/ApiService";
import BlockWrapper from "../../../components/BlockWrapper";
import PopupCancelOrder from "../../../components/PopupCancelOrder/PopupCancelOrder";
import OrderInternetContent from "./OrderInternetContent/OrderInternetContent";
import {connect} from "react-redux";
import {getInternetSales, loadingFalse, loadingTrue, setError} from "../../../actions";

const OrdersInternet = props => {
  const [showPopupCancel, setShowPopupCancel] = useState(false)
  const [cancelOrderGuid, setCancelOrderGuid] = useState(null)
  let delay = 0;

  async function onCancel() {
    props.loadingTrue()
    try {
      const response = await apiService.cancelOrder(cancelOrderGuid, props.TOKEN.accessToken)
      if (response.status === 200) {
        console.log('Успешно удалён заказ ', cancelOrderGuid)
        props.getInternetSales()
      }
      props.loadingFalse()
    } catch (e) {
      props.setError(e)
    }
    setShowPopupCancel(false)
  }

  return (
    <>
      <BlockWrapper classStyle='OrderHistory'>
        <h2>Заказы: </h2>
        {props.internetSales.length > 0 &&
        props.internetSales.map(item => {
          delay += .09
          return <OrderInternetContent key={item.orderGuid} item={item} delay={delay}
                                       cancelOrder={() => {
                                         setCancelOrderGuid(item.orderGuid)
                                         setShowPopupCancel(true)
                                       }}/>
        })
        }

      </BlockWrapper>
      <PopupCancelOrder show={showPopupCancel}
                        onCancel={onCancel}
                        onClose={() => setShowPopupCancel(false)}/>
    </>
  )
}

const mapStateToProps = ({TOKEN, internetSales}) => {
  return {TOKEN, internetSales}
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInternetSales: () => dispatch(getInternetSales()),
    loadingTrue: () => dispatch(loadingTrue()),
    loadingFalse: () => dispatch(loadingFalse()),
    setError: (e) => dispatch(setError(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInternet)