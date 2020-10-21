import React from "react";
import './BlockWrapper.scss'

const BlockWrapper = ({children, style = ''}) => {
  return (
    <div className={'BlockWrapper ' + `${style}`}>
      {children}
    </div>
  )
}

export default BlockWrapper