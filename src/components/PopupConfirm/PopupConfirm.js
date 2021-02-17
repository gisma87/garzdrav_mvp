import React from "react";
import './PopupConfirm.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupConfirm = props => {
  return (
    <PopupWrapper onClick={props.onClose} active={props.show} classStyle='PopupConfirm'>
      <h3>Отмена заказа</h3>
      <div className='PopupConfirm__buyTrue'>

        <div className='PopupConfirm__buyTrueContent'>
          <p>Вы действительно желаете отменить заказ?</p>
          <p>Наши фармацевты почти собрали его.</p>
        </div>
        <div className="PopupConfirm__buttonContainer">
          <button type='button'
                  className={"PopupConfirm__button PopupConfirm__button_active"}
                  onClick={props.onConfirm}
          >
            Да
          </button>
          <button type='button'
                  className={"PopupConfirm__button PopupConfirm__button_active"}
                  onClick={props.onClose}
          >
            Нет
          </button>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default PopupConfirm