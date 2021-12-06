import home from "pages/logined/home/initialState"

const initialState = {
  reduxTokenAuth: {
    currentUser: {
      isSignedIn: false,
      attributes: {
        id: 'id',
        name: 'name',
      },
    },
  },
  home,
};

export default initialState;