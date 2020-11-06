import React from "react";
import {useMediaQuery} from 'react-responsive'
import App from "./App";
import AppMobile from "./AppMobile/AppMobile";

const MobileOrDesktop = () => {

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  return (
    isMobile ? <AppMobile/> : <App/>
  )

}

export default MobileOrDesktop