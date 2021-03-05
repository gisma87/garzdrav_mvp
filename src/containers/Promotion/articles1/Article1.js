import React from "react";
import './Article1.scss'
import {Link} from "react-router-dom";
import img1 from '../../../img/articllesImg/promotion1/img1.jpg'
import img2 from '../../../img/articllesImg/promotion1/img2.jpg'
import img3 from '../../../img/articllesImg/promotion1/img3.jpg'
import img4 from '../../../img/articllesImg/promotion1/img4.jpg'
import img5 from '../../../img/articllesImg/promotion1/img5.jpg'
import img6 from '../../../img/articllesImg/promotion1/img6.jpg'
import img7 from '../../../img/articllesImg/promotion1/img7.jpg'
import img8 from '../../../img/articllesImg/promotion1/img8.jpg'
import img9 from '../../../img/articllesImg/promotion1/img9.jpg'
import img10 from '../../../img/articllesImg/promotion1/img10.jpg'

const Article1 = () => {
  return (
    <section className='Article1 wrapper'>
      <h1 className='Article1__mainTitle'>За подарками – в аптеку!</h1>
      <p className='Article1__description'>Чаще всего мы обращаемся в аптеку, когда подхватили вирус или что-то
        беспокоит. Мало кто знает, но в
        современных аптеках помимо лекарственного ассортимента можно найти широкий выбор полезных подарков для родных и
        близких.
      </p>
      <h2 className='Article1__secondaryTitle'>ТОП 10 полезных подарков на 8 марта для прекрасных дам.</h2>
      <ol className='Article1__list'>
        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Электрическая зубная щетка и ирригатор</h3>
          <p className='Article1__itemParagraph'>
            Подарок придется по душе девушкам любых возрастов. Это компактный и легкий прибор, простой и удобный в
            использовании, а красивый дизайн никого не оставит равнодушным.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img1} alt="зубная щётка"/>
          <div className='Article1__linkBlock'>
            <Link to='/Card/a6669f0d-8b00-47d1-8e91-64868067927b'>МЕДИКА СОНИК ПУЛЬСАР ЗУБ.ЩЕТКА CS-167-B ЧЕРН. [OMRON
              CS MEDICA]</Link>
            <Link to='/Card/3d3ffd3b-a26f-419e-bd86-cddbabd7b11e'>МЕДИКА СОНИК ПУЛЬСАР ЗУБ.ЩЕТКА CS-167-B ЧЕРН. [OMRON
              CS MEDICA]</Link>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Тонометр </h3>
          <p>
            Отличный подарок для мам и бабушек, удобная и компактная модель на запястье будет актуальная для путешествий
            и поездок.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img2} alt="Тонометр"/>
          <div className='Article1__linkBlock'>
            <Link to='/Card/6b8f7600-dbe0-47a1-866e-6175680096bd'>ОМРОН ТОНОМЕТР RS1 АВТОМАТ /АРТ.HEM-6120-RU/
              [OMRON]</Link>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Лечебная и уходовая косметика</h3>
          <p>
            Этот подарок актуален в любой праздник. А к 8 Марта аптеки готовят специальные подарочные наборы, в которых
            будут новые и актуальные для весны средства.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img3} alt="Тонометр"/>
          <div className='Article1__linkBlock'>
            <p>ЛИБРИДЕРМ вся линейка</p>
            <p>ЛЯ РОШ ПОЗЕ вся линейка</p>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Средства по уходу за волосами</h3>
          <p>
            Весной девушки перестают носить шапки. А это значит, что причёска их должна быть просто идеальной. Набор для
            ухода за волосами придаст им гладкость и сделает их послушными и блестящими.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img4} alt="Средства по уходу за волосами"/>
          <div className='Article1__linkBlock'>
            <p>АЛЕРАНА вся линейка</p>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Витамины</h3>
          <p>
            Отличным подарком для женщин могут стать витаминные комплексы — весной минералы и витамины так необходимы
            для красоты!
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img5} alt="5.	Витамины "/>
          <div className='Article1__linkBlock'>
            <p>ЛЕДИС ФОРМУЛА вся линейка</p>
            <Link to='/Card/f070e86e-748b-4b2a-b264-5451adebe5dc'>ДОППЕЛЬГЕРЦ БЬЮТИ КОЛЛАГЕН ДЫНЯ+ЛИЧИ 25МЛ. №30
              ФЛ.</Link>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Набор для ароматерапии</h3>
          <p>
            В подарок коллегам, знакомым и родственницам лучше подобрать что-то универсальное, например ароматические
            лампы с набором масел.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img6} alt="Набор для ароматерапии"/>
          <div className='Article1__linkBlock'>
            <p>ОЛЕОС вся линейка масел</p>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Массажер</h3>
          <p>
            Из ассортимента медтехники женщину может порадовать, например, массажер. Это подарок из разряда – «для
            дома», которым сможет пользоваться не только сама женщина, но и все члены семьи, в том числе подрастающее
            поколение.
          </p>
          <img src={img7} alt="Массажер"/>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Ортопедическая подушка</h3>
          <p>
            Качественный сон оказывает колоссальное влияние на наше здоровье и самочувствие. Ортопедическая подушка
            станет хорошем вкладом в здоровье любимого человека.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img8} alt="Ортопедическая подушка"/>
          <div className='Article1__linkBlock'>
            <Link to='/Card/8440e051-7ee2-49c1-b832-2668517b013c'>ТРИВЕС ПОДУШКА ОРТОПЕД. Д/ВЗР. ТОП-119 (M) ЭФФЕКТ.ПАМЯТИ</Link>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Ирригатор</h3>
          <p>
            В дополнение к электрической зубной щетке хорошим подарком будет ирригатор.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img9} alt="Ирригатор"/>
          <div className='Article1__linkBlock'>
            <Link to='/Card/6f8c156c-1325-4502-bb5e-535b0fc55387'>ИРРИГАТОР Д/ПОЛОСТИ РТА AQUAJET LD-A8</Link>
          </div>
        </li>

        <li className='Article1__item'>
          <h3 className='Article1__itemTitle'>Маски для рук, лица и пяточек</h3>
          <p>
            В качестве подарка для коллег могут подойти косметические маски для ухода за лицом, руками и пяточками.
          </p>
          <p className='Article1__titleImg'>Что купить:</p>
          <img src={img10} alt="Маски для рук, лица и пяточек"/>
          <div className='Article1__linkBlock'>
            <Link to='/Card/76883fe3-8765-434a-9777-f474b13a1280'>СКИНЛАЙТ-275 МАСКА-НОСКИ Д/НОГ ОТШЕЛ. Р.35-40 [SKINLITE]</Link>
            {/*<Link to='/Card/76883fe3-8765-434a-9777-f474b13a1280'>АКУЛИЙ ЖИР ЖОЖОБА МАСКА Д/ЛИЦА ЛИФТ. 10МЛ</Link>*/}
            <Link to='/Card/6e816308-6bbf-494d-a7f3-689ff3feefa8'>АКУЛИЙ ЖИР ЖЕНЬШЕНЬ МАСКА Д/ЛИЦА КОЛЛАГЕН 10МЛ.</Link>
            <Link to='/Card/74fdeb93-d2cc-4abf-a90b-894c37011cea'>ФЛОРЕСАН ФИТНЕС-БОДИ ТЕРМО-МАСКА ГРЯЗЕВАЯ 500МЛ. Ф-171 [FLORESAN]</Link>
          </div>
        </li>
      </ol>
    </section>
  )
}

export default Article1