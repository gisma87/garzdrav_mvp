import React from "react";
import './PromoBlock2.scss'

const PromoBlock2 = props => {

  const {classStyle = '', style = {}} = props;
  return (
    <div className={'PromoBlock2' + classStyle} style={style}>
      <p>Тут могла бы быть ваша реклама...</p>
    </div>
  )
}

export default PromoBlock2