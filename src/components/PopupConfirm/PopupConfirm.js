import React from "react";
import './PopupConfirm.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";

const PopupConfirm = props => {

  const message = props.message || <><p>Вы действительно желаете отменить заказ?</p>
    <p>Наши фармацевты почти собрали его.</p></>
  const title = props.title || 'Отмена заказа'
  return (
    <PopupWrapper onClick={props.onClose} active={props.show} classStyle='PopupConfirm'>
      <h3>{title}</h3>
      <div className='PopupConfirm__buyTrue'>

        <div className='PopupConfirm__buyTrueContent'>
          {message}
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