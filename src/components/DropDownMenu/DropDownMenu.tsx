import React from "react";
import './DropDownMenu.scss'
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

type Props = {
    data: {
        title: string,
        callback(): void
    }[],
    isActive: boolean
}

const DropDownMenu: React.FC<Props> = props => {

    return (
        <ErrorBoundary>
            <div className={'DropDownMenu ' + (props.isActive ? 'DropDownMenu__active' : '')}>
                <ul className='DropDownMenu__itemContainer'>
                    {props.data.map((item, id) => {
                        return (<li key={id} className='DropDownMenu__item' onClick={item.callback}>{item.title}</li>)
                    })}
                </ul>
            </div>
        </ErrorBoundary>
    )
}


export default DropDownMenu