import React, {useEffect, useRef, useState} from "react";
import './CardPage.scss'
import SvgCheck from "../../components/UI/icons/SvgCheck";
import notPhoto from "../../img/notPhoto.svg"
import {Link} from 'react-scroll'
import BlockWrapper from "../../components/BlockWrapper";
import Error from "../../components/Error/Error";
import {
  addedToCart,
  allItemRemovedFromCart,
  itemRemovedFromCart,
  fetchProductInfo, setActiveCategory, getPromoItem, getProductsFromSearchLimit
} from "../../actions";
import {getDataForPromoItem} from "../Cart/cartUtils";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {useMediaQuery} from 'react-responsive'
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import SetToFavorites from "../../components/SetToFavorites/SetToFavorites";
import CardItem from "../../components/CardItem";
import CountButton from "../../components/UI/CountButton/CountButton";
import SvgCartIcon from "../../img/SVGcomponents/SvgCartIcon";
import num_word from "../../utils/numWord";
import RetailsBlock from "../../components/RetailsBlock/RetailsBlock";
import {scrollToElement} from "../../utils/scrollToElement";

const CardPage = (props) => {
  const {
    itemId,
    cart,
    productInfo,
    error,
  } = props;

  const imgData = () => [...props.itemsForPromoBlock1, ...props.seasonItemsForPromoBlock2, ...props.popularItemsForPromoBlock3]
  const img = imgData()?.find(elem => elem.guid === itemId)?.img || null
  const itemIndex = cart.findIndex((item) => item.itemId === itemId);
  const isActive = itemIndex >= 0;
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  const [count, setCount] = useState(0)
  const [countLast, setCountLast] = useState(1)
  const [showCitiesList, setShowCitiesList] = useState(false)
  const [minPrice, setMinPrice] = useState(0)

  const mapRef = useRef(null);

  useEffect(() => {
    props.fetchProductInfo(itemId)
    props.getPromoItem([itemId])
  }, [itemId])// eslint-disable-line

  useEffect(() => {
    if (props.catalog && props.productInfo !== '') {
      props.setActiveCategory(getActiveItemCategory())
    }
    // eslint-disable-next-line
  }, [props.catalog, props.productInfo])

  useEffect(() => {
    const thisCount = props.cart.find(itemCart => itemCart.itemId === itemId)?.count
    if (thisCount > 0) {
      setCount(thisCount)
      const thisCountLast = props.productInfo.retails?.sort((a, b) => a.countLast > b.countLast ? -1 : 1)?.[0]?.countLast;
      if (thisCountLast) setCountLast(thisCountLast);
    }
  }, [props.productInfo, itemId, props.cart])

  useEffect(() => {
    setMinPrice(minPriceRetail())
    // eslint-disable-next-line
  }, [productInfo])

  const minPriceRetail = () => {
    if (typeof productInfo === 'string' || (typeof productInfo === 'object' && productInfo?.length === 0)) {
      return 0
    } else {
      const retails = [...productInfo?.retails]

      let index = 0;
      retails.sort((a, b) => a.priceRetail > b.priceRetail ? 1 : -1)

      while ((index < (retails.length - 1)) && (retails[index].priceRetail === 0)) {
        index++
      }
      const result = retails[index].priceRetail

      return !isNaN(result) ? result : 0
    }
  }

  const getActiveItemCategory = () => {
    let result = null

    function searchElement(element) {
      if (result) return result

      for (let i = 0; i < element.child.length; i++) {
        const item = element.child[i]
        if (item.child.length) {
          searchElement(item) // спускаемся на самое дно
        } else {
          const isElement = item.guid === props.productInfo.categoryGuid
          if (isElement) {
            result = item
          }
        }
      }

      if (result) {
        return result
      } else return 'категория не найдена'
    }

    searchElement(props.catalog)
    return result
  }

  const thisCategoryPath = (index) => {

    let activeItem = [props.catalog]
    const title = [props.catalog.title]

    for (let i = 1; i < props.activeCategory.historyGuid.length; i++) {
      activeItem.push(activeItem[i - 1].child.find(item => item.guid === props.activeCategory.historyGuid[i]))
      title.push(activeItem[i].title)
    }
    return {title: title[index], activeItem: activeItem[index]}
  }

  const goToCardsPage = () => {
    props.getProductsFromSearchLimit({productName: productInfo.manufacturer})
    props.history.push('/Cards/')
  }

  return (
    <section className='CardPage wrapper'>
      {error
        ? <Error/>
        : <ErrorBoundary>
          {!productInfo?.manufacturer
            ? <div style={{fontSize: 18, padding: 15,}}>
              <p>Подробная информация по данному товару отсутствует. </p>
              <p style={{padding: '10px 0'}}>Возможно произошла ошибка.</p>
              <p style={{fontWeight: 'bold'}}>Попробуйте повторить поиск.</p>
            </div>
            : <>
              {/*===    ПУТЬ К ТОВАРУ ПО КАТАЛОГУ   ===============================*/}
              {props.activeCategory && <div style={isMobile ? {} : {paddingBottom: 15}}>
                {props.activeCategory.historyGuid.map((item, i) => {
                  return (
                    <p key={item} className='CardPage__pathname'>
                      <NavLink to={'/catalog/' + thisCategoryPath(i).activeItem.guid + '/'}
                               className='CardPage__pathItem'
                        // onClick={() => props.setActiveCategory(thisCategoryPath(i).activeItem)}
                      >
                        {thisCategoryPath(i).title}
                      </NavLink>
                      <span className='CardPage__pathArrow'> &gt; </span>
                    </p>
                  )
                })}
              </div>}
              {/*===================================================================*/}

              {/* ДЛЯ DESKTOP ВЕРСИИ */}
              {
                !isMobile &&
                <div className='CardPage__topBlock'>
                  <BlockWrapper classStyle='CardPage__cardProduct'>
                    <div className='CardPage__titleContainer'>
                      <h1 className='CardPage__title'>{productInfo.product}
                        <SetToFavorites productGuid={productInfo.guid} classStyle='CardPage__like'/>
                      </h1>
                      <p>Спрей, 10 мл, 22,5 мкг/доза</p>
                    </div>

                    <div className='CardPage__contentContainer'>
                      <div className='CardPage__imageContainer'>
                        {img
                          ? <img className='CardPage__image' src={img} alt="фото лекарство"/>
                          : <img src={notPhoto} alt="pills icon" className='CardPage__image'/>}
                        <p className='CardPage__caption'>Внешний вид товара может отличаться от изображения на
                          сайте</p>
                      </div>

                      <div className='CardPage__infoBlock'>
                        <div className='CardPage__descriptionContainer'>
                          <p className='CardPage__maker CardPage__description'>
                            <span>Производитель</span>
                            <span className='CardPage__link' onClick={goToCardsPage}>{productInfo.manufacturer}</span>
                          </p>
                          <p className='CardPage__substance CardPage__description'>
                            <span>Действующее вещество:</span>
                            <NavLink className='CardPage__link' to={props.history.location}>Оксиметазолин</NavLink>
                          </p>
                          <div style={{textAlign: 'right', opacity: 0}}>
                            <Link to="anchor" smooth={true} offset={-150} duration={500}>Инструкция</Link>
                          </div>


                        </div>
                        <div className='CardPage__priceContainer'>
                          <div className='CardPage__priceContent'>
                            {
                              !minPrice
                                ? <p className='CardPage__priceText'>Временно нет в наличии</p>
                                : <>
                                  <p className='CardPage__priceText'>Цена в наших аптеках: </p>
                                  <p className='CardPage__price'>от {minPrice} ₽</p>
                                </>
                            }
                          </div>

                          <div className='CardPage__buttons'>
                            {
                              isActive
                                ? <CountButton
                                  count={count}
                                  isLastCount={!(countLast > count)}
                                  onIncrement={() => props.addedToCart(itemId)}
                                  onDecrement={() => props.itemRemovedFromCart(itemId)}
                                />
                                : <button
                                  className={'CardPage__button CardPage__buttonToCart' + (isActive ? ' CardPage__buttonToCart_active' : '')}
                                  onClick={() => props.addedToCart(itemId)}>
                                  {isActive ? <><SvgCheck style={{color: 'white', marginRight: 15}}/> В
                                    корзине</> : 'Добавить в корзину'}
                                </button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </BlockWrapper>

                  {/*================== Рекламный блок ===================================*/}
                  {
                    props.promoItems !== null
                      ? <div className='CardPage__promoContainer'>
                        <p className="CardPage__titlePanel">Вам пригодится</p>
                        <CardItem onItemSelected={(itemId, event) => {
                          if (!event.target.closest('button')) props.history.push(`/Card/${itemId}`);
                        }}
                                  classStyle='Cart__promoBlock'
                                  itemProps={getDataForPromoItem(props, [props.productInfo])}
                        />
                      </div>
                      : undefined
                  }

                </div>
              }


              {/* ДЛЯ MOBILE ВЕРСИИ */}
              {isMobile && <section className='CardPage__mobile'>
                <div className='CardPage__titleContainer'>
                  <h1 className='CardPage__title'>{productInfo.product}</h1>
                  <p>Спрей, 10 мл, 22,5 мкг/доза</p>
                </div>
                <div className='CardPage__imageContainer'>
                  {img
                    ? <img className='CardPage__image' src={img} alt="фото лекарства"/>
                    : <img src={notPhoto} alt="pills icon" className='CardPage__image'/>}
                  <p className='CardPage__caption'>Внешний вид товара может отличаться от изображения на
                    сайте</p>
                  <SetToFavorites productGuid={productInfo.guid} classStyle='CardPage__like'/>
                </div>

                <div className='CardPage__contentContainer'>


                  <div className='CardPage__priceContainer'>
                    <div className='CardPage__priceContent'>
                      {
                        !minPrice
                          ? <p className='CardPage__priceText'>Временно нет в наличии</p>
                          : <>
                            <p className='CardPage__priceText'>Цена в наших аптеках: </p>
                            <p className='CardPage__price'>от {minPrice} ₽</p>
                          </>
                      }
                    </div>

                    <div className='CardPage__buttons'>
                      {
                        isActive
                          ? <CountButton
                            count={count}
                            isLastCount={!(countLast > count)}
                            onIncrement={() => props.addedToCart(itemId)}
                            onDecrement={() => props.itemRemovedFromCart(itemId)}
                          />
                          : <button className='CardItem__cart' onClick={() => props.addedToCart(itemId)}>
                            <SvgCartIcon style={{fontSize: 28, color: '#fff'}}/>
                          </button>
                      }
                    </div>
                  </div>

                  <div className='CardPage__descriptionContainer'>
                    <p className='CardPage__retails CardPage__description'>
                      <span>В наличии: </span>
                      <span className='CardPage__link' onClick={() => {
                        if (mapRef && mapRef.current) {
                          scrollToElement({element: mapRef.current, offset: -100, smooth: true})
                        }
                      }
                      }>
                        в {productInfo.retails.length} {num_word(productInfo.retails.length, ['аптеке', 'аптеках', 'аптеках'])}
                      </span>
                    </p>
                    <p className='CardPage__maker CardPage__description'>
                      <span>Производитель</span>
                      <span className='CardPage__link' onClick={goToCardsPage}>{productInfo.manufacturer}</span>
                    </p>
                    {/*<p className='CardPage__substance CardPage__description'>*/}
                    {/*  <span>Действующее вещество:</span>*/}
                    {/*  <NavLink className='CardPage__link' to={props.history.location}>Оксиметазолин</NavLink>*/}
                    {/*</p>*/}
                    <p className='CardPage__characteristic CardPage__description'>
                      <span>Общее описание:</span>
                      {/*<span className='CardPage__textCharacteristic'>Сосудосуживающий препарат для местного применения. При нанесении на воспаленную слизистую оболочку полости носа уменьшает ее отечность и выделения из носа. Восстанавливает носовое дыхание. Устранение отека слизистой оболочки полости носа способствует восстановлению аэрации придаточных пазух полости носа, полости среднего уха, что уменьшает вероятность возникновения бактериальных осложнений (гайморита, синусита, среднего отита). При местном интраназальном применении в терапевтических концентрациях не раздражает и не вызывает гиперемию слизистой оболочки полости носа. При местном интраназальном применении оксиметазолин не обладает системным действием. Оксиметазолин начинает действовать быстро, в течение нескольких минут. Продолжительность действия препарата Називин Сенситив - до 12 ч.</span>*/}
                      <Link to="anchor"
                            smooth={true}
                            offset={-150}
                            duration={500}>
                        Инструкция
                      </Link>
                    </p>

                  </div>
                </div>
              </section>}

              <BlockWrapper classStyle='CardPage__moreInfo'>
                <div className='CardPage__instruction'>
                  <h3 id="anchor">Инструкция</h3>
                  <div className='CardPage__instructionBlock' style={{fontSize: 24}}>
                    Ведутся технические работы. Скоро здесь появится информация.
                  </div>
                  {false &&
                  <>
                    <div className='CardPage__instructionBlock'>
                      <h4>Состав</h4>
                      <p>В 1 дозе: флутиказона фуроат микронизированный 27.5 мкг. Вспомогательные вещества:
                        декстроза - 2750
                        мкг/доза, целлюлоза диспергируемая* - 825 мкг/доза, полисорбат 80 - 13.75 мкг/доза,
                        бензалкония хлорида
                        раствор** - 16.5 мкг***, динатрия эдетат - 8.25 мкг/доза, вода очищенная - до 50 мкл.*
                        вязкость 65 сПз,
                        содержит 11% кармеллозы натрия;** содержит 50% бензалкония хлорида;*** содержание
                        бензалкония хлорида
                        составляет 8.25 мкг/доза или 0.015% (вес/вес) в суспензии.
                      </p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Фармакологические свойства</h4>
                      <p>ГКС для местного применения. Флутиказона фуроат - синтетический трифторированный ГКС с
                        высокой
                        аффинностью к глюкокортикоидным рецепторам, обладает выраженным противовоспалительным
                        действием.
                      </p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Показания к применению</h4>
                      <p>
                        Взрослые и подростки (в возрасте от 12 лет и старше)
                        Лечение назальных и глазных симптомов сезонного аллергического ринита
                        Лечение назальных симптомов круглогодичного аллергического ринита. Дети (в возрасте от 2
                        до 11 лет)
                        Лечение назальных симптомов сезонного и круглогодичного аллергического ринита
                      </p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Противопоказания</h4>
                      <p>Повышенная чувствительность к флутиказона фуроату и другим компонентам препарата.</p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Применение при беременности и в период грудного вскармливания</h4>
                      <p>Данных о применении флутиказона фуроата при беременности и в период грудного
                        вскармливания
                        недостаточно. ФертильностьНет данных о влиянии препарата на фертильность человека.
                        БеременностьНет
                        данных о применении флутиказона фуроата у беременных женщин. Как было показано в
                        исследованиях на
                        животных, ГКС вызывали пороки развития, включая расщелины неба и задержку
                        внутриутробного развития.
                        Маловероятно, что эти данные релевантны для людей, получающих ГКС интраназально в
                        рекомендуемых
                        терапевтических дозах (см. подраздел Фармакокинетика). Флутиказона фуроат можно
                        применять при
                        беременности только в случаях, когда ожидаемая польза терапии для матери превышает
                        потенциальный риск
                        для плода. Период грудного вскармливанияЭкскреция флутиказона фуроата с женским грудным
                        молоком не
                        изучалась. Флутиказона фуроат может применяться у кормящих женщин только в случае, если
                        ожидаемая польза
                        для матери превышает потенциальный риск для ребенка
                      </p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Способ применения и дозы</h4>
                      <p>а в глаза, тщательно промыть их водой. Уход за распылителемПосле каждого применения: 1.
                        Промокнуть
                        наконечник и внутреннюю поверхность колпачка сухой чистой салфеткой. Избегать попадания
                        воды.2. Не
                        пытаться прочистить отверстие наконечника булавкой или другими острыми предметами.3.
                        Следует всегда
                        закрывать флакон и хранить его закрытым. Колпачок защищает распылитель от пыли и
                        засорения,
                        герметизирует флакон, предотвращает случайное нажатие на кнопку. В случае если
                        распылитель не работает:
                        1. Проверить уровень оставшегося препарата во флаконе через смотровое окно. Если
                        осталось совсем
                        небольшое количество жидкости, ее может быть недостаточно для работы распылителя.2.
                        Проверить флакон на
                        наличие повреждений.3. Проверить, не засорилось ли отверстие наконечника. Не пытаться
                        прочистить
                        отверстие наконечника булавкой или другими острыми предметами.4. Попытаться привести
                        устройство в
                        действие, повторив процедуру подготовки назального спрея к применению.</p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Побочное действие</h4>
                      <p>Нежелательные явления, представленные ниже, перечислены в соответствии с поражением
                        органов и систем
                        органов и частотой встречаемости. Частота встречаемости определяется следующим образом:
                        очень часто
                        (≥1/10); часто (≥1/100, меньше1/10); нечасто (≥1/1000, меньше1/100); редко (≥1/10 000,
                        меньше1/1000);
                        очень редко (меньше1/10 000, включая отдельные случаи). Нежелательные явления,
                        наблюдавшиеся в
                        клинических исследованияхСо стороны дыхательной системы, органов грудной клетки и
                        средостения: очень
                        часто - носовое кровотечение. У взрослых и подростков случаи носового кровотечения
                        отмечались чаще при
                        длительном применении (более 6 недель), чем при коротком курсе (до 6 недель).
                        Исследованиях у детей при
                        продолжительности терапии до 12 недель количество случаев носовых кровотечений было
                        сходным в группе
                        флутиказона фуроата и плацебо. Часто - изъязвления слизистой оболочки полости носа. Со
                        стороны
                        костно-мышечной системы и соединительной ткани: частота неизвестна - задержка роста у
                        детей. Результаты
                        исследования, проводимого в течение года у детей препубертатного возраста, которые
                        получали
                        флутиказонафуроат в дозе 110 мкг 1 раз/сут, не позволяют определить статистическую
                        частоту проявления
                        данного нежелательного явления, поскольку невозможно вычислить влияние препарата на
                        показатели
                        окончательного роста у детей, принимавших участие в исследовании. Задержка роста скелета
                        у детей
                        относится к системным нежелательным явлениям, характерным для ГКС при длительном
                        пероральном или
                        парентеральном введении. Нежелательные явления, наблюдавшиеся при пострегистрационном
                        наблюденииСо
                        стороны иммунной системы редко - реакции гиперчувствительности, включая анафилаксию,
                        отек Квинке, сыпь,
                        крапивницу. Со стороны нервной системы: часто - головная боль. Со стороны дыхательной
                        системы, органов
                        грудной клетки и средостения: нечасто - риналгия, дискомфорт в носу (включая жжение,
                        раздражение в носу
                        и болезненность), сухость в носу; очень редко - перфорация носовой перегородки. Со
                        стороны органа
                        зрения: частот неизвестна - преходящие нарушения зрения. Возможно появление системных
                        побочных эффектов,
                        характерных для ГКС (см. раздел Особые указания).</p>
                    </div>
                    <div className='CardPage__instructionBlock'>
                      <h4>Передозировка</h4>
                      <p>Симптомы: в исследовании биодоступности препарата интраназально применялись дозы в 24
                        раза выше
                        рекомендованной дозы для взрослых в течение более 3 дней, при этом нежелательных
                        системных реакций не
                        наблюдалось. Лечение: маловероятно, что острая передозировка потребует другого лечения,
                        кроме
                        медицинского наблюдения.</p>
                    </div>
                  </>
                  }
                </div>
              </BlockWrapper>
              {
                isMobile &&
                <div ref={mapRef}>
                  <RetailsBlock showCitiesList={showCitiesList}
                                setShowCitiesList={(boolean) => setShowCitiesList(boolean)}
                                retails={props.productInfo.retails}
                  />
                </div>
              }

            </>
          }
        </ErrorBoundary>}
    </section>
  )
}


const mapStateToProps = (
{
  cart,
    favorites,
    productInfo,
    error,
    catalog,
    activeCategory,
    TOKEN,
    isCity,
    promoItems,
    loadingFavorites,
    itemsForPromoBlock1,
    seasonItemsForPromoBlock2,
    popularItemsForPromoBlock3
}
) =>
{
  return {
    cart,
    favorites,
    productInfo,
    error,
    catalog,
    activeCategory,
    TOKEN,
    isCity,
    promoItems,
    loadingFavorites,
    itemsForPromoBlock1,
    seasonItemsForPromoBlock2,
    popularItemsForPromoBlock3
  }
}

const mapDispatchToProps = (dispatch) =>
{
  return {
    getPromoItem: (productGuid) => dispatch(getPromoItem(productGuid)),
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    fetchProductInfo: (productId) => dispatch(fetchProductInfo(productId)),
    setActiveCategory: (categoryItem) => dispatch(setActiveCategory(categoryItem)),
    getProductsFromSearchLimit: (data) => dispatch(getProductsFromSearchLimit(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CardPage))