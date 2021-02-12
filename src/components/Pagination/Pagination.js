import React, {useEffect, useState} from "react";
import './Pagination.scss'
import SvgArrowLightRight from "../../img/SVGcomponents/SvgArrowLightRight";
import {useMediaQuery} from "react-responsive";
import {withRouter} from "react-router-dom";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

const Pagination = props => {


  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  const {
    totalRecords = 0, // length массива всех карточек
    pageLimitItems = 30, // количество карточек на странице
    pageNeighbours = isMobile ? 1 : 2, // количество соседей у текущей страницы, если 1 - то слева и справа будет по 1 соседу.
  } = props

  const [currentPageState, setCurrentPage] = useState(1) // текущая страница

  const totalPages = Math.ceil(totalRecords / pageLimitItems); // общее количество страниц

  const calcPageNumbers = () => {
    const startPage = Math.max(1, currentPageState - pageNeighbours);
    const endPage = startPage === 1
      ? Math.min(totalPages, (pageNeighbours * 2 + 1))
      : Math.min(totalPages, currentPageState + pageNeighbours);

    if (endPage === totalPages) {
      let start = Math.max(1, (totalPages - (pageNeighbours * 2)));
      return range(start, totalPages)
    }

    return range(startPage, endPage)
  }

  const goToPage = (page = 1) => {
    props.history.push(`${page}` + (props.match.params.sort ? `/${props.match.params.sort}` : ''))
    const currentPage = Math.max(0, Math.min(page, totalPages));
    setCurrentPage(currentPage)
  }

  useEffect(() => {
    if (props.setStartPage) goToPage(1);
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (props.page) {
      setCurrentPage(props.page)
    }
  }, [props.page])


  const pages = calcPageNumbers()

  if (!totalRecords || totalPages === 1) return null;

  return (
    <div className='Pagination'>
      <ul className="Pagination__list">
        <p className='Pagination__item Pagination__itemText' onClick={() => goToPage(1)}>Первая</p>

        <span className='Pagination__item'
              onClick={() => goToPage(currentPageState > 1 ? currentPageState - 1 : 1)}>
          <SvgArrowLightRight className='Pagination__arrow'/>
        </span>

        {
          pages.map(page => <li key={page}
                                onClick={() => goToPage(page)}
                                className={`Pagination__item${+props.page === +page ? ' active' : ''}`}
          >
            {page}
          </li>)
        }

        <span className='Pagination__item'
              style={{transform: 'rotate(180deg)'}}
              onClick={() => goToPage(currentPageState < totalPages ? currentPageState + 1 : totalPages)}>
          <SvgArrowLightRight className='Pagination__arrow'/>
        </span>

        <p className='Pagination__item Pagination__itemText Pagination__lastItem'
           onClick={() => goToPage(totalPages)}>Последняя</p>
      </ul>
      {
        currentPageState &&
        <div className="Pagination__currentPage">
          <p><span>{currentPageState}</span> из <span>{totalPages}</span></p>
        </div>
      }
    </div>
  )
}

export default withRouter(Pagination)