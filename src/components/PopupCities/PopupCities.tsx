import React, {useState} from "react"
import './PopupCities.scss'
import PopupWrapper from "../UI/PopupWrapper/PopupWrapper";
import Error from "../Error/Error";
import SearchForm from "../UI/SearchForm/SearchForm";
import PopupConfirm from "../PopupConfirm/PopupConfirm";
import {ObjType, TypeisCity} from "../../types";

type CitiesType = {
    guid: string,
    title: string,
    [key: string]: string | number | null | ObjType | (string | number | ObjType)[]
}[]

type RegionType = {
    regionGuid: string,
    regionTitle: string,
    cities: { guid: string, title: string }[]
}

type Props = {
    active: boolean,
    isCity: TypeisCity,
    regions: RegionType[],
    cities: CitiesType,
    onClick(): void,
    clearCart(): void,
    onSelectCity(itemGuid: string): void

}

const PopupCities: React.FC<Props> = props => {

    const [value, setValue] = useState('')
    const [filterCity, setFilterCity] = useState<CitiesType>([])
    const [popupConfirmActive, setPopupConfirmActive] = useState(false)
    const [itemGuid, setItemGuid] = useState<string>('')

    const {isCity, regions, cities} = props

    const [activeRegion, setActiveRegion] = useState('3a25bb73-7fe3-432f-839b-859da67a5347')

    const getItemActiveRegion = (): RegionType | undefined => {
        return regions.find(item => item.regionGuid === activeRegion)
    }

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
                       className={item.guid === isCity.guid ? 'PopupCities__itemActive' : ''}
            >{item.title}</li>
        })
    }

    const renderRegions = (arr: RegionType[]) => {
        return arr.map((item) => {
            return <li key={item.regionGuid}
                       onClick={() => setActiveRegion(item.regionGuid)}
                       className={item.regionGuid === isCity.regionGuid ? 'PopupCities__itemActive' : ''}
            >{item.regionTitle}</li>

        })
    }

    function renderSearchResult() {
        if (filterCity.length) {
            return <ul className="PopupCities__form">{renderItems(filterCity)}</ul>
        }
        if (value.trim().length) {
            return 'Город не найден измените запрос или выберите город из списка вручную'
        }
        return null
    }

    const confirmMessage = <><p>При смене города корзина будет очищена.</p>
        <p>Желаете сменить город?</p></>

    return (
        <PopupWrapper onClick={props.onClick} active={props.active} classStyle='PopupCities'>
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


            {!regions.length
                ? <Error/>
                : <div className='PopupCities__container'>

                    {value.trim().length ? renderSearchResult() :
                        <>
                            <div className='PopupCities__column'>
                                <h3 className="PopupCities__title">Регион</h3>
                                <ul className="PopupCities__form">
                                    {renderRegions(regions)}
                                </ul>
                            </div>
                            <div className='PopupCities__column'>
                                <h3 className="PopupCities__title">Город</h3>
                                <ul className="PopupCities__form">
                                    {renderItems(getItemActiveRegion()!?.cities)}
                                </ul>
                            </div>
                        </>}
                </div>
            }
            <PopupConfirm show={popupConfirmActive}
                          title={'Внимание!'}
                          message={confirmMessage}
                          onConfirm={() => {
                              props.clearCart()
                              props.onSelectCity(itemGuid)
                          }}
                          onClose={() => {
                              setPopupConfirmActive(false)
                              props.onClick()
                          }}/>
        </PopupWrapper>
    )
}

export default PopupCities