import {createStore} from 'vuex';

export default createStore({
  state: {
    offersNumber: null,
    account: null,
  },
  mutations: {
    updateOffersNumber(state, data) {
      state.offersNumber = data;
    },
    updateAccount(state, data) {
      state.account = data;
    },
  },
});
