import React from "react";
import './CountButton.scss'
import SvgPlus from "../icons/SvgPlus";
import SvgMinus from "../icons/SvgMinus";

type Props = {
    onIncrement(): void,
    onDecrement(): void,
    isLastCount: boolean,
    count: number
}

const CountButton: React.FC<Props> = props => {

    return (
        <div className='CountButton'>
            <button className='CountButton__decrement' onClick={props.onDecrement}><SvgMinus/></button>
            <p className='CountButton__count' style={props.isLastCount ? {fontWeight: 'bold'} : {}}>{props.count}</p>
            <button className='CountButton__increment'
                    onClick={() => {
                        if (!props.isLastCount) props.onIncrement();
                    }}
                    style={props.isLastCount ? {background: 'rgba(144, 0, 32, .3'} : {}}
            ><SvgPlus/>
            </button>
        </div>
    )
}

export default CountButton