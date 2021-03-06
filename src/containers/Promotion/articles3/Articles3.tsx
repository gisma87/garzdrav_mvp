import React from "react";
import './Articles3.scss'
import img_01 from "../../../img/articllesImg/promotion3/img_01.jpg";
import img_02 from "../../../img/articllesImg/promotion3/img_02.jpg";
import img_03 from "../../../img/articllesImg/promotion3/img_03.jpg";

import {Link} from "react-router-dom";

const Article3 = () => {
  return (
    <section className='Article3 wrapper'>
      <h1 className='Article3__mainTitle'>Простуда: что делать и какие препараты добавить в аптечку?</h1>
      <p className='Article3__description'>Чаще всего простуда настигает нас в самый неподходящий момент.
        Мы собрали для вас 5 простых шагов, что делать при первых симптомах простуды, а также список необходимых
        препаратов от простуды и гриппа.
      </p>
      <h2 className='Article3__secondaryTitle'>Шаг 1. Принимаем жаропонижающее</h2>
      <p className='Article3__description'>Один из первых симптомов простуды – повышенная температура тела. Поэтому в
        сезон простуд лучше заранее запастись жаропонижающими средствами, препараты снимут болезненные симптомы и
        температуру, избавят от головной боли, отеков и красноты в горле.
      </p>
      <img src={img_01} alt="Колдакт"/>
      <p className='Article3__titleImg'>Что купить:</p>
      <div className='Article3__linkBlock'>
        <Link to='/Card/49172f77-7a3e-4ac4-ba6e-83c605c28fb4'>КОЛДАКТ ФЛЮ ПЛЮС №10 КАПС</Link>
        <Link to='/Card/f476dc75-339e-4ba2-9b57-8be245c3261e'>ТЕРАФЛЮ ЛИМОН ОТ ГРИППА И ПРОСТУДЫ №4 ПОР. ПАК</Link>
        <Link to='/Card/f03947e9-bbc7-4efd-b7fc-d77368c931c2'>РИНЗА №10 ТАБ.</Link>
        <Link to='/Card/fc42a44a-d400-4d8d-9e3b-7f8c56d7c496'>ОРВИС ФЛЮ ЛИМОН+ИМБИРЬ 500МГ.+25МГ.+200МГ. №10 ПОР. Д/Р-РА
          Д/ПРИЕМА ВНУТРЬ ПАК</Link>
        <Link to='/Card/b26928ea-b4e2-4daf-b5ae-fcf3f846a256'>СТОПГРИПАН ЛИМОН №10 ПОР. Д/ПРИГ. Р-РА</Link>
      </div>

      <h2 className='Article3__secondaryTitle'>Шаг 2. Промываем и очищаем нос</h2>
      <img src={img_02} alt="СНУП"/>
      <p className='Article3__description'>Самый частый симптом простуды – насморк, болезнь начинается с «текущего» носа
        – обильного выделения мокроты. На 2–3 день болезни нос, напротив, «закладывает» так, что невозможно дышать.
        Поэтому в противопростудной аптечке должно быть несколько средств от насморка.

        Если из носа «течет», следует промыть носовые пазухи раствором на основе морской воды, это поможет очистить
        пазухи от микробов.
        Если нос «заложен», потребуются сосудосуживающие капли или спреи на основе ксилометазолина, вещество снимает
        отек в пазухах и ускоряет выведение слизи. Сосудосуживающие препараты вызывают привыкание. Если применять их
        постоянно больше 5–7 дней, насморк может перейти в хроническую форму.

      </p>
      <p className='Article3__titleImg'>Что купить:</p>
      <div className='Article3__linkBlock'>
        <Link to='/Card/e72f6764-00f1-40d0-bf8b-904c93a6d059'>СНУП 0,1% 90МКГ/ДОЗА 15МЛ. НАЗАЛ.СПРЕЙ</Link>
        <Link to='/Card/957a0abe-8d6b-4e4f-b701-1588f7c9e06d'>РИНОНОРМ-ТЕВА 0,1% 20МЛ. НАЗАЛ.СПРЕЙ</Link>
        <Link to='/Card/e6a5a753-fe4f-4c25-be36-076da79722ac'>КСИЛЕН 0,1% 10МЛ. №1 НАЗАЛ.КАПЛИ ФЛ./КАП.</Link>
        <Link to='/Card/ccbb3d5c-4498-436d-9f2f-0eba55a05271'>ТИЗИН КЛАССИК 0,1% 10МЛ. НАЗАЛ.СПРЕЙ</Link>
        <Link to='/Card/e689bd25-0aad-46f0-8b83-3a9819616521'>АКВАЛОР СОФТ 150МЛ. НАЗАЛ.СПРЕЙ</Link>
        <Link to='/Card/cfcd4758-8a84-4fea-b476-d01df083553e'>АКВА МАРИС НОРМ ИНТЕНСИВ. ПРОМЫВАНИЕ</Link>
      </div>

      <h2 className='Article3__secondaryTitle'>Шаг 3. Устраняем боль в горле</h2>
      <img src={img_03} alt="Гексорал"/>
      <p className='Article3__description'>В самом начале простуды с болью и саднящими ощущениями в горле справятся
        леденцы и пастилки с экстрактами трав и эфирных масел. Если победить болезнь в зачатке не удалось, понадобятся
        спреи и растворы для полоскания горла. Они заживляют ткани, снимают отечность, борются с инфекциями.
      </p>
      <p className='Article3__titleImg'>Что купить:</p>
      <div className='Article3__linkBlock'>
        <Link to='/Card/a2f28ea5-456a-4c8b-991a-202c734331f7'>ЛИЗОБАКТ №30 ТАБ. Д/РАСС. СУБЛИН</Link>
        <Link to='/Card/166a6f6a-8bae-4137-8860-9f35972e3562'>ИНГАЛИПТ 30МЛ. АЭРОЗОЛЬ /ФАРМСТАНДАРТ-ЛЕКСРЕДСТВА</Link>
        <Link to='/Card/27c524aa-6f8a-411f-bc10-58077beb7b20'>ФУРАЦИЛИН АВЕКСИМА 20МГ. №10 ШИП.ТАБ. Д/ПРИГ.Р-РА</Link>
        <Link to='/Card/13e32e18-2808-4cd9-a8b2-f9b01c6e39ae'>ГЕКСОРАЛ 0,2% 40МЛ. АЭРОЗОЛЬ Д/МЕСТ.ПРИМ.</Link>
        <Link to='/Card/75534fd2-663b-4559-b392-60136e689e98'>ТАНТУМ ВЕРДЕ 0,255МКГ/ДОЗА 30МЛ. СПРЕЙ Д/МЕСТ.ПРИМ.
          ДОЗИР</Link>
        <Link to='/Card/f8f6b8ec-72b5-4608-b0bf-52d1f153f9f7'>ГРАММИДИН НЕО С АНЕСТЕТИКОМ №18 ТАБ</Link>
        <Link to='/Card/0b4b33c8-481b-423b-9ebb-335267a7d05b'>ФУРАЦИЛИН 20МГ. №20 ТАБ. /ОБНОВЛЕНИЕ/</Link>
        <Link to='/Card/4cca6bfd-6c6a-4728-963d-a93305771fca'>АНГИДАК 0,255МГ/ДОЗА 30МЛ. СПРЕЙ Д/МЕСТ.ПРИМ. ДОЗИР.
          /ГРОТЕКС/</Link>
        <Link to='/Card/95a815f4-88d2-47ec-bda9-78b8e488fad2'>ФАРИНГОСЕПТ 10МГ. №20 ТАБ</Link>
        <Link to='/Card/be1ea34e-5379-4803-bfb7-4ea35705d877'>СЕПТОЛЕТЕ ТОТАЛ №16 ТАБ. ЛИМОН+МЕД Д/РАСС. /KRKA/</Link>
      </div>

      <h2 className='Article3__secondaryTitle'>Шаг 4. Идем спать. Спим как можно дольше</h2>
      <p className='Article3__description'>Лучшее средство от простуды – сон. Хорошо, если на следующий день вам удастся
        поспать 8–9 часов и встать без будильника. Жаропонижающее, лекарства от насморка и боли в горле должны облегчить
        засыпание. Но если вы испытываете проблемы со сном, можно выпить на ночь фиточай из мяты или плодов шиповника
        Такой чай богат витаминами С, В, Е: он успокоит нервную систему и будет дополнительной поддержкой организму.
      </p>

      <h2 className='Article3__secondaryTitle'>Шаг 5. Идём к врачу</h2>
      <p className='Article3__description'>Если простуда не отступает, важно не затягивать и как можно скорее обратиться
        к врачу. </p>

    </section>
  )
}

export default Article3