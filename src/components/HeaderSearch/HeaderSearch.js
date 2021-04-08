import React from "react";
import './HeaderSearch.scss'
import SearchPanel from "../SearchPanel/SearchPanel";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const HeaderSearch = () => {
  return (
    <ErrorBoundary>
      <div className='HeaderSearch'>
        <div className='HeaderSearch__wrapper wrapper'>
          <SearchPanel/>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default HeaderSearch