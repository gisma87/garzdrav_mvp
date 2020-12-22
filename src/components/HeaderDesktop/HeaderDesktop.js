import React, {useRef} from 'react';
import './HeaderDesktop.scss'
import HeaderTop from "../HeaderTop";
import HeaderFixed from "../HeaderFixed";
import HeaderSearch from "../HeaderSearch/HeaderSearch";

const HeaderDesktop = () => {
  const headerDesktop = useRef({current: {clientHeight: 100}})

  return (
    <>
      <header ref={headerDesktop} className='HeaderDesktop'>
        <HeaderTop/>
        <HeaderFixed/>
        <HeaderSearch/>
      </header>

      <div
        style={{
          width: '100%',
          display: 'flex',
          height: headerDesktop.current?.clientHeight,
          marginBottom: 15
        }}>
      </div>
    </>
  )
}

export default HeaderDesktop