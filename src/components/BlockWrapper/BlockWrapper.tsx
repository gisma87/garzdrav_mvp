import React from "react";
import './BlockWrapper.scss'

type Props = {
    classStyle?: string,
    onClick?: () => void
}

const BlockWrapper: React.FC<Props> = ({children, classStyle = '', onClick = () => {}}) => {
    return (
        <div className={'BlockWrapper ' + classStyle} onClick={onClick}>
            {children}
        </div>
    )
}

export default BlockWrapper