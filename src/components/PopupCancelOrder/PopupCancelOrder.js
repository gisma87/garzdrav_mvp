import React from "react";
import './PopupCancelOrder.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupCancelOrder = props => {
  return (
    <PopupWrapper onClick={props.onClose} active={props.show} classStyle='PopupCancelOrder'>
      <h3>Отмена заказа</h3>
      <div className='PopupCancelOrder__buyTrue'>

        <div className='PopupCancelOrder__buyTrueContent'>
          <p>Вы действительно желаете отменить заказ?</p>
          <p>Наши фармацевты почти собрали его.</p>
        </div>
        <div className="PopupCancelOrder__buttonContainer">
          <button type='button'
                  className={"PopupCancelOrder__button PopupCancelOrder__button_active"}
                  onClick={props.onCancel}
          >
            Да
          </button>
          <button type='button'
                  className={"PopupCancelOrder__button PopupCancelOrder__button_active"}
                  onClick={props.onClose}
          >
            Нет
          </button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default PopupCancelOrder