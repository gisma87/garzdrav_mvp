import React from "react";
import './ArticlesBlock.scss'
import TitleSection from "../UI/TitleSection/TitleSection";
import ArticleCard from "../ArticleCard";

const articleCardData = [
  {
    title: 'Вегетарианство: польза или вред?',
    description: 'Более миллиарда людей по всему миру выбирают для себя путь вегетарианства, и с каждым днём таких людей становится всё больше.',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/2efae72b6523169bca5c91d237363e3a.jpg'
  },
  {
    title: 'Как правильно ухаживать за кожей лица?',
    description: 'Пришло время позаботиться о коже!',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/b0855ca6f18d9187a5567aad203f4c45.jpg'
  },
  {
    title: 'Приятный запах в доме: 8 советов',
    description: 'Мы собрали для вас несколько советов, которые помогут вам устранить возможные источники неприятных запахов и добавить свежести в свой дом.',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/4554b91c015f4ee8c439ceee307e034f.jpg'
  },
  {
    title: 'Очки с поляризацией: кому и зачем нужны?',
    description: 'Чем поляризационные очки отличаются от других и действительно ли они необходимы?',
    image: 'https://xn--n1aalg.xn--80ae2aeeogi5fxc.xn--p1ai/article/84fa33cede7d34e0567978778f8aa0b6.jpg'
  }
]

const ArticlesBlock = (props) => {

  return (
    <div className='ArticlesBlock wrapper'>
      <TitleSection size={props.sizeTitle} title='Статьи' link="/articles/"/>
      <div className='ArticlesBlock__container'>
        {articleCardData.map((card, index) => <ArticleCard key={index} item={card}/>)}
      </div>
    </div>
  )
}

export default ArticlesBlock