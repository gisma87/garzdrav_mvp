import React from "react";
import './DropDownMenu.scss'

type Props = {
    data: {
        title: string,
        callback(): void
    }[],
    isActive: boolean
}

const DropDownMenu: React.FC<Props> = props => {

    return (
        <div className={'DropDownMenu ' + (props.isActive ? 'DropDownMenu__active' : '')}>
            <ul className='DropDownMenu__itemContainer'>
                {props.data.map((item, id) => {
                    return (<li key={id} className='DropDownMenu__item' onClick={item.callback}>{item.title}</li>)
                })}
            </ul>
        </div>
    )
}


export default DropDownMenu