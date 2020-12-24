import React from "react";
import './HeaderSearch.scss'
import SearchPanel from "../SearchPanel/SearchPanel";

const HeaderSearch = () => {
  return (
    <div className='HeaderSearch'>
      <div className='HeaderSearch__wrapper wrapper'>
        <SearchPanel/>
      </div>
    </div>
  )
}

export default HeaderSearch