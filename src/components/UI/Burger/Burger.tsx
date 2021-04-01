import React from "react"
import './Burger.scss'

type Props = {
    theme?: string,
    isActive: boolean,
    onClick(): void
}


const Burger: React.FC<Props> = props => {

    return (
        <div className={'burger ' + (props.theme === 'dark' ? 'burger__dark' : '')} onClick={props.onClick}>
            <div className={'burger__span' + (props.isActive ? ' active' : '')}>
                <span/>
            </div>
        </div>
    )
}

export default Burger