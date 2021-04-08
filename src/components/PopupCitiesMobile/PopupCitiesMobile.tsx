import React, {useState} from "react";
import './PopupCitiesMobile.scss';
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import Error from "../Error/Error";
import SearchForm from "../UI/SearchForm/SearchForm";
import PopupConfirm from "../PopupConfirm/PopupConfirm";
import {TypeisCity} from "../../types";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

type Props = {
    active: boolean,
    isCity: TypeisCity,
    cities: TypeisCity[],
    onClick(): void,
    clearCart(): void,
    onSelectCity(itemGuid: string): void

}

const PopupCitiesMobile: React.FC<Props> = props => {

    const [value, setValue] = useState('')
    const [filterCity, setFilterCity] = useState<TypeisCity[]>([])
    const [popupConfirmActive, setPopupConfirmActive] = useState(false)
    const [itemGuid, setItemGuid] = useState<string>('')

    const {isCity, cities} = props

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value)
        const arrIncludes = cities.filter(item => {
            if (e.target.value.trim() === '') {
                return false
            }
            return item.title.toUpperCase().startsWith(e.target.value.trim().toUpperCase())
        })
        setFilterCity(arrIncludes)
    }

    const renderItems = (arr: { guid: string, title: string }[]) => {
        return arr.map((item) => {
            return <li key={item.guid}
                       onClick={() => {
                           setItemGuid(item.guid)
                           setPopupConfirmActive(true)
                       }}
                       className={item.guid === isCity.guid ? 'PopupCitiesMobile__itemActive' : ''}
            >{item.title}</li>
        })
    }

    function renderSearchResult() {
        if (filterCity.length) {
            return <ul className="PopupCitiesMobile__form">{renderItems(filterCity)}</ul>
        }
        if (value.trim().length) {
            return 'Город не найден измените запрос или выберите город из списка вручную'
        }
        return null
    }

    const confirmMessage = <><p>При смене города корзина будет очищена.</p>
        <p>Желаете сменить город?</p></>

    return (
        <ErrorBoundary>
            <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupCitiesMobile'>
                <div className='PopupCitiesMobile__searchForm-container'>
                    <SearchForm setFocus={() => {
                    }}
                                keyPress={() => {
                                }}
                                isMobile={false}
                                onSubmit={(e) => {
                                    e.preventDefault()
                                }}
                                idInput="searchCity"
                                placeholder='Поиск по городу'
                                onChange={onChangeHandler}
                                value={value}
                    />
                </div>


                {!cities.length
                    ? <Error/>
                    : <div className='PopupCitiesMobile__container'>

                        {value.trim().length ? renderSearchResult() :
                            <div className='PopupCitiesMobile__column'>
                                <h3 className="PopupCitiesMobile__title">Город</h3>
                                <ul className="PopupCitiesMobile__form">
                                    {renderItems(cities)}
                                </ul>
                            </div>
                        }
                    </div>
                }
                <PopupConfirm show={popupConfirmActive}
                              title={'Внимание!'}
                              message={confirmMessage}
                              onConfirm={() => {
                                  props.clearCart()
                                  props.onSelectCity(itemGuid)
                                  setPopupConfirmActive(false)
                              }}
                              onClose={() => {
                                  setPopupConfirmActive(false)
                                  props.onClick()
                              }}/>
            </PopupWrapper>
        </ErrorBoundary>
    )
}

export default PopupCitiesMobile