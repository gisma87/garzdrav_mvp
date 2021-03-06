import React, {useEffect, useState} from "react";
import {addToFavorites, delToFavorites, openPopupLogin, refreshAuthentication} from "../../actions";
import {connect} from "react-redux";
import {service} from "../../service/service";
import ButtonHeart from "../UI/ButtonHeart/ButtonHeart";
import LoaderCircle from "../UI/LoaderCircle/LoaderCircle";

const SetToFavorites = props => {

  const [isLike, setIsLike] = useState(false)

  const isFavorites = () => {
    if (props.favorites.length) {
      return props.favorites.some(item => item.guid === props.productGuid)
    }
    return false;
  };

  useEffect(() => {
    setIsLike(isFavorites)
    // eslint-disable-next-line
  }, [props.favorites])

  function setFavorites() {
    if (props.TOKEN) {
      if (isFavorites()) {
        setIsLike(false)
        service.wrapperRefreshToken(() => props.delToFavorites(props.productGuid), props.refreshAuthentication)
      } else {
        setIsLike(true)
        service.wrapperRefreshToken(() => props.addToFavorites(props.productGuid), props.refreshAuthentication)

      }
    } else {
      props.openPopupLogin()
    }
  }

  return (
    <>
      <div onClick={setFavorites} className={props.classStyle}>
        {
          props.loadingFavorites > 0
            ? <div style={{width: 20, height: 20}}><LoaderCircle/></div>
            : <ButtonHeart active={isLike}/>
        }
        <span>В избранное</span>
      </div>
    </>
  )
}

const mapStateToProps = ({favorites, TOKEN, loadingFavorites}) => {
  return {favorites, TOKEN, loadingFavorites}
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPopupLogin: () => dispatch(openPopupLogin()),
    addToFavorites: (productGuid) => dispatch(addToFavorites(productGuid)),
    delToFavorites: (productGuid) => dispatch(delToFavorites(productGuid)),
    refreshAuthentication: () => dispatch(refreshAuthentication())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetToFavorites)