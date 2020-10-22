const initialState = {
  pills: [],
  loading: true,
  error: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PILLS_LOADED':
      return {
        pills: action.payload,
        loading: false,
        error: null
      };
    case 'PILLS_REQUESTED' :
      return {
        pills: [],
        loading: true,
        error: null
      };
    case 'PILLS_ERROR' :
      return {
        pills: [],
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export default reducer;