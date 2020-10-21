import React from "react";
import './BlockWrapper.scss'

const BlockWrapper = ({
                        children, style = '', onClick = () => {}
                      }) => {
  return (
    <div className={'BlockWrapper ' + `${style}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default BlockWrapper