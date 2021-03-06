import React, {useEffect, useRef, useState} from "react";
import './ProductListDropdown.scss'

type Props = {
    active: boolean,
    list: {
        guid: string,
        product: string,
        count: number,
        priceRetail: number,
    }[]
}

const ProductListDropdown: React.FC<Props> = props => {

    const [styleContent, setStyleContent] = useState({})
    const content = useRef<HTMLDivElement>(null)
    const contentWrapper = useRef<HTMLDivElement>(null)

    useEffect(() => {
        animate()
        // eslint-disable-next-line
    }, [props.active])

    function animate() {
        props.active
            ? setStyleContent({height: `${(contentWrapper.current?.clientHeight ? contentWrapper.current?.clientHeight : 0) + 15}px`})
            : setStyleContent({height: 0})
    }

    return (
        <div ref={content}
             style={styleContent}
             className={'ProductListDropdown' + (!props.active ? ' ProductListDropdown_contentDisabled' : '')}>
            <div ref={contentWrapper} className='ProductListDropdown__contentDropdown'>
                <h3 className='ProductListDropdown__title'>В наличии в аптеке:</h3>
                {
                    props.list.map((item) => {
                        return (
                            <div className='ProductListDropdown__item' key={item.guid}>
                                <p className='ProductListDropdown__titleItem'>{item.product}</p>
                                <div className='ProductListDropdown__priceContainer'>
                                    {/*<p className='ProductListDropdown__count'><span>{item.count}</span> шт:</p>*/}
                                    <p className='ProductListDropdown__count'>{item.count}шт.
                                        * {item.priceRetail} ₽/шт.</p>
                                    <p
                                        className='ProductListDropdown__price'>{(item.priceRetail * item.count).toFixed(2)} ₽</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default ProductListDropdown