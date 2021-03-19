import React from "react";
import './Alert.scss'
import PopupWrapper from "../PopupWrapper/PopupWrapper";

type Props = {
    onClose(): void,
    show: boolean,
    title: string
}

const Alert: React.FC<Props> = props => {
    return (
        <PopupWrapper onClick={props.onClose} active={props.show} classStyle='Alert'>
            <h3>{props.title}</h3>
            <div className='Alert__buyTrue'>

                <div className='Alert__buyTrueContent'>
                    {props.children}
                </div>

                <button type='button' className="Alert__button Alert__button_active" onClick={props.onClose}>OK</button>

            </div>
        </PopupWrapper>
    )
}

export default Alert