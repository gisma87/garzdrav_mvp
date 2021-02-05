import React from "react";
import './Development.scss'
import Logo from "../UI/Logo/Logo";
import {Link} from "react-router-dom";
import Burger from "../UI/Burger/Burger";
import FooterDesktop from "../FooterDesktop";
import dev from "../../img/dev.jpg"
import {useMediaQuery} from "react-responsive";

const Development = () => {
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  return (
    <div className='Development'>
      {isMobile &&
      <div className='indexMobile__logoPanel'>
        <Logo/>
        <Link to={'/catalog'}>Каталог <Burger/></Link>
      </div>
      }
      <main className='Development__main'>
        <img src={dev} alt="В Разработке"/>
      </main>
      {isMobile && <FooterDesktop/>}
    </div>
  )
}

export default Development