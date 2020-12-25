import React from "react";
import './PromoBlock2.scss'

const PromoBlock2 = props => {

  function openPopup(e) {
    function closePopup(event) {
      if (!event.target.closest('popup')) {
        e.target.classList.remove('openPopup')
        document.removeEventListener('click', closePopup)
      }
    }

    e.target.classList.add('openPopup');
    document.addEventListener('click', closePopup)
  }


  const {classStyle = '', style = {}} = props;
  return (
    <div className={'PromoBlock2' + classStyle} style={style}>
      <p>Тут могла бы быть ваша реклама...</p>
    </div>
  )
}

export default PromoBlock2