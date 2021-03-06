import React, {useEffect, useRef, useState} from "react";
import './RetailsListDropdown.scss'

type Props = {
    active: boolean,
    count: number,
    list: {
        guid: string,
        street: string,
        buildNumber: string,
        priceRetail: number,

    }[]
}

const RetailsListDropdown: React.FC<Props> = props => {

    const [styleContent, setStyleContent] = useState({})
    const content = useRef<HTMLDivElement>(null)
    const contentWrapper = useRef<HTMLDivElement>(null)

    useEffect(() => {
        animate()
        // eslint-disable-next-line
    }, [props.active, props.count])

    function animate() {
        props.active
            ? setStyleContent({height: `${(contentWrapper.current?.clientHeight ? contentWrapper.current?.clientHeight : 0) + 15}px`})
            : setStyleContent({height: 0})
    }

    const random = Math.random()

    return (
        <div ref={content}
             style={styleContent}
             className={'RetailsListDropdown' + (!props.active ? ' RetailsListDropdown_contentDisabled' : '')}>
            <div ref={contentWrapper} className='RetailsListDropdown__contentDropdown'>
                <h3 className='RetailsListDropdown__title'>В наличии в аптеке:</h3>
                {
                    props.list.map((item, index) => {
                        return (
                            <div className='RetailsListDropdown__item' key={item.guid + index + random}>
                                <p className='RetailsListDropdown__titleItem'>ул. {item.street} {item.buildNumber}</p>
                                <div className='RetailsListDropdown__priceContainer'>
                                    <p className='RetailsListDropdown__count'>{props.count}шт.
                                        * {item.priceRetail} ₽/шт.</p>
                                    <p
                                        className='RetailsListDropdown__price'>{(item.priceRetail * props.count).toFixed(2)} ₽</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default RetailsListDropdown