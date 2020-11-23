import React from "react";
import './BlockWrapper.scss'

const BlockWrapper = ({children, classStyle = '', onClick = () => {}}) => {
    return (
        <div className={'BlockWrapper ' + classStyle} onClick={onClick}>
            {children}
        </div>
    )
}

export default BlockWrapper