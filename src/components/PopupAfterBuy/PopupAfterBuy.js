import React from "react";
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupAfterBuy = props => {
  return (
    <PopupWrapper onClick={props.onClose} active={props.show} classStyle='PopupOrder'>
      <h3 className="PopupOrder__title">Заказ принят к исполнению</h3>
      <div className='PopupOrder__buyTrue'>

        <div className='PopupOrder__buyTrueContent'>
          <p>Ваш заказ N-{props.OrderNumber} принят к исполнению.</p>
          <p>Об изменении статуса заказа будет сообщено по СМС</p>
        </div>
        <button type='button'
                className={"PopupOrder__button PopupOrder__button_active"}
                onClick={props.onClose}
        >
          ОК
        </button>
      </div>
    </PopupWrapper>
  )
}

export default PopupAfterBuy