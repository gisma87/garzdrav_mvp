import React from "react";
import './ArticlesBlock.scss'
import TitleSection from "../UI/TitleSection/TitleSection";
import calendarIcon from '../../img/calendar-alt-regular.svg'

const ArticleCard = ({image, title, description}) => {
  return (
    <div className='ArticleCard'>
      <img src={image}
           className="ArticleCard__image" alt='фото для статьи'/>
      <div className="ArticleCard__content">
        <h3 className="ArticleCard__title">{title}</h3>

        <p className="ArticleCard__description">
          {description}
        </p>
      </div>
      <div className="ArticleCard__date">
        <img src={calendarIcon} alt="calendar icon"/>
        <span>8 октября 2020 г.</span>
      </div>
    </div>
  )
}

const ArticlesBlock = () => {
  return (
    <div className='ArticlesBlock wrapper'>
      <TitleSection title='Статьи' link="/articles/"/>
      <div className='ArticlesBlock__container'>
        <ArticleCard title='Вегетарианство: польза или вред?'
                     description='Более миллиарда людей по всему миру выбирают для себя путь
          вегетарианства, и с каждым днём таких людей становится всё больше.'
                     image='https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/2efae72b6523169bca5c91d237363e3a.jpg'/>
        <ArticleCard title='Как правильно ухаживать за кожей лица?'
                     description='Пришло время позаботиться о коже!'
                     image='https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/b0855ca6f18d9187a5567aad203f4c45.jpg'/>
        <ArticleCard title='Приятный запах в доме: 8 советов'
                     description='Мы собрали для вас несколько советов, которые помогут вам устранить возможные источники неприятных запахов и добавить свежести в свой дом.'
                     image='https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/4554b91c015f4ee8c439ceee307e034f.jpg'/>
        <ArticleCard title='Очки с поляризацией: кому и зачем нужны?'
                     description='Чем поляризационные очки отличаются от других и действительно ли они необходимы?'
                     image='https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/84fa33cede7d34e0567978778f8aa0b6.jpg'/>
      </div>
    </div>
  )
}

export default ArticlesBlock