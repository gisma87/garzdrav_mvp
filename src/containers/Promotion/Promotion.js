import React from "react";
import './Promotion.scss'
import Article1 from "./articles1/Article1";
import {Redirect, withRouter} from "react-router-dom";
import Article2 from "./articles2/Articles2";


const Promotion = ({itemId}) => {
  switch (+itemId) {
    case 1:
      return <Article1/>
    case 2:
      return <Article2/>
    default:
      return <Redirect to={'/'}/>
  }
}

export default withRouter(Promotion)