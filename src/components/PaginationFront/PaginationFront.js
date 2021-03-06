import React, {useEffect, useState} from "react";
import '../Pagination/Pagination.scss'
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

const PaginationFront = props => {


  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  const pageLimitItems = typeof props.pageLimitItems === 'number' ? props.pageLimitItems : 30; // количество карточек на странице
  const totalRecords = typeof props.totalRecords === 'number' ? props.totalRecords : 0; // length массива всех карточек
  const pageNeighbours = isMobile ? 1 : 2; // количество соседей у текущей страницы, если 1 - то слева и справа будет по 1 соседу.
  const totalPages = Math.ceil(totalRecords / pageLimitItems); // общее количество страниц

  const [currentPageState, setCurrentPage] = useState(1) // текущая страница

  useEffect(() => {
    if (props.reset.status) {
      gotoPage(1)
      props.reset.off()
    }// eslint-disable-next-line
  }, [props.reset])

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

  const gotoPage = page => {
    const {onPageChanged = f => f} = props;
    const currentPage = Math.max(0, Math.min(page, totalPages));
    const paginationData = {
      currentPage,
      totalPages,
      pageLimitItems,
      totalRecords
    }

    setCurrentPage(currentPage)
    onPageChanged(paginationData)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    if (props.onPageChanged) gotoPage(1);
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
        <p className='Pagination__item Pagination__itemText' onClick={() => gotoPage(1)}>Первая</p>

        <span className='Pagination__item'
              onClick={() => gotoPage(currentPageState > 1 ? currentPageState - 1 : 1)}>
          <SvgArrowLightRight className='Pagination__arrow'/>
        </span>

        {
          pages.map(page => <li key={page}
                                onClick={() => gotoPage(page)}
                                className={`Pagination__item${+currentPageState === +page ? ' active' : ''}`}
          >
            {page}
          </li>)
        }

        <span className='Pagination__item'
              style={{transform: 'rotate(180deg)'}}
              onClick={() => gotoPage(currentPageState < totalPages ? currentPageState + 1 : totalPages)}>
          <SvgArrowLightRight className='Pagination__arrow'/>
        </span>

        <p className='Pagination__item Pagination__itemText Pagination__lastItem'
           onClick={() => gotoPage(totalPages)}>Последняя</p>
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

export default withRouter(PaginationFront)
