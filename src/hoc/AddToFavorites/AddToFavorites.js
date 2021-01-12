import React, {useState} from "react";
import {setFavoritesToStore} from "../../actions";
import {connect} from "react-redux";
import apiService from "../../service/ApiService";
import PopupLogin from "../../components/PopupLogin/PopupLogin";

const AddToFavorites = props => {

  const [isLike, setIsLike] = useState(false)
  const [showPopupLogin, setShowPopupLogin] = useState(false)

  // const isFavorites = this.props.favorites.includes(item.guid);

  function addToFavorites() {
    if (props.TOKEN) {
      setIsLike(!isLike)
      apiService.addToFavorites(props.TOKEN.accessToken, props.productGuid)
        .then(response => console.log(response))
    } else {
      setShowPopupLogin(true)
    }
  }

  return (
    <>
      <div onClick={addToFavorites}>
        {React.cloneElement(
          props.children,
          [{
            active: isLike
          }],
          null
        )}
      </div>
      <PopupLogin active={showPopupLogin}
                  onClick={() => setShowPopupLogin(false)}
      />
    </>
  )
}

const mapStateToProps = ({favorites, TOKEN}) => {
  return {favorites, TOKEN}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFavoritesToStore: (favoritesObject) => dispatch(setFavoritesToStore(favoritesObject))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToFavorites)