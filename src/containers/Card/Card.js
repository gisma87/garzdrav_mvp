import React, {useState} from "react";
import './Card.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import dataCatds from "../../testData/dataCards";

const Card = ({itemId}) => {
  const [like, setLike] = useState(false)
  const {title, maker, minPrice, img = undefined} = dataCatds[itemId - 1]
  return (
    <LayoutDesktop>
      <section className='Card'>
        <div className='Card__imageContainer'>
          {img !== undefined ? <img className='Card__image' src={img} alt=""/> :
            <div className='Card__image'><i className="fas fa-pills"/></div>}
        </div>

        <div className='Card__content'>
          <div className='Card__infoContainer'>
            <div className='Card__containerTitle'>
              <h1 className='Card__title'>{title}</h1>
              <div className='Card__additional'>
                <h4 className='Card__maker'>Производитель: <span>{maker}</span></h4>
                <p className='Card__amount'>Объём: <span>360мл</span></p>
              </div>
            </div>
            <div className='Card__priceContainer'>
              <div className='Card__priceContainer-header'>
                <p className='Card__price'>от {minPrice} р.</p>
                <span onClick={() => setLike(!like)} style={{color: "red", marginLeft: 10, fontSize: 26}}>
                <i className={"fa-heart " + (like ? "fas" : "far")}/>
              </span>
              </div>
              <p className='Card__priceContainer-description'>Цена зависит от выбранной аптеки</p>
              <button className='Card__cart'>
                <i className="fas fa-shopping-cart"/>
                <span>в корзину</span>
              </button>
            </div>
          </div>
          <div className='Card__description'>
            <h4>Особые условия: </h4>
            <p>Прежде, чем приступить к приему скипидарных ванн, необходимо проконсультироваться с врачом,
              чтобы правильно подобрать дозу бальзама в зависимости от показателей артериального давления,
              общего состояния организма и имеющегося диагноза
            </p>
          </div>
          <div className='Card__description'>
            <h4>Показания: </h4>
            <p>Оториноларингология: комплексное лечение острых и хронических отитов, гайморитов, тонзиллитов,
              ларингитов, фарингитов.
              У детей в возрасте от 3 до 14 лет применяется для комплексного лечения острого фарингита и/или обострения
              хронического тонзиллита.
              Стоматология: лечение и профилактика инфекционно-воспалительных заболеваний полости рта: стоматитов,
              гингивитов, пародонтитов, периодонтитов. Гигиеническая обработка съемных протезов.
              Хирургия, травматология: профилактика нагноений и лечение гнойных ран. Лечение гнойно-воспалительных
              процессов опорно-двигательного аппарата.
              Акушерство-гинекология: профилактика и лечение нагноений послеродовых травм, ран промежности и влагалища,
              послеродовых инфекций, воспалительных заболеваний (вульвовагинит, эндометрит).
              Комбустиология: лечение поверхностных и глубоких ожогов II и IIIA степени, подготовка ожоговых ран к
              дерматопластике.
              Дерматология, венерология: лечение и профилактика пиодермий и дерматомикозов, кандидозов кожи и слизистых
              оболочек, микозов стоп.
              Индивидуальная профилактика заболеваний, передаваемых половым путем (сифилис, гонорея, хламидиоз,
              трихомониаз, генитальный герпес, генитальный кандидоз и др.).
              Урология: комплексное лечение острых и хронических уретритов и уретропростатитов специфической (хламидиоз,
              трихомониаз, гонорея) и неспецифической природы.
            </p>
          </div>
          <div className='Card__description'>
            <h4>Противопоказания: </h4>
            <p>Противопоказан лицам с пониженным давлением - для них рекомендовано применение ванн на основе белого бальзама.
              Открытая форма туберкулеза;
              ишемическая болезнь сердца с явлениями стенокардии, аритмия;
              сердечная недостаточность выше первой стадии;
              гипертоническая болезнь IIБ - III стадии;
              хронический нефрит и нефроз;
              хронический гепатит и цирроз печени;
              острая экзема, чесотка;
              острый воспалительный процесс или обострение хронических заболеваний;
              злокачественные новообразования;
              вторая половина беременности;
              индивидуальная непереносимость скипидарных ванн.
              Возрастных противопоказаний ванны не имеют.
              Поскольку ванны действуют на весь организм, при выборе типа ванн важно учитывать показатели артериального давления.
              Полный перечень противопоказаний указан в инструкции.
            </p>
          </div>
          <div className='Card__description'>
            <h4>Способы применения и дозы: </h4>
            <p>Внутрь, не во время приема пищи. Таблетку следует держать во рту, не проглатывая, до полного растворения.
              Детям с 6 месяцев. При назначении препарата детям младшего возраста (от 6 месяцев до 3 лет) рекомендуется растворять таблетку в небольшом количестве (1 столовая ложка) кипяченой воды комнатной температуры.
              В 1-й день лечения принимают 8 таблеток по следующей схеме: по 1 таблетке каждые 30 минут в первые 2 часа (всего 5 таблеток за 2 часа), затем в течение этого же дня принимают еще по 1 таблетке 3 раза через равные промежутки времени. На 2-ой день и далее принимают по 1 таблетке 3 раза в день до полного выздоровления.
              Для профилактики вирусных инфекционных заболеваний – по 1-2 таблетки в день. Рекомендуемая продолжительность профилактического курса определяется индивидуально и может составлять 1-6 месяцев.
              При необходимости препарат можно сочетать с другими противовирусными и симптоматическими средствами.
            </p>
          </div>
        </div>
      </section>
    </LayoutDesktop>
  )
}

export default Card