import {createStore} from 'vuex';

export default createStore({
  state: {
    data: {
      account: null,
      chainId: null,
      balance: null,
    },
    error: '',
    balanceError: '',
    isConnected: false,
    offers: [],
  },
  actions: {
    getConnect(context) {
      if (typeof window.ethereum !== 'undefined') {
        clearTimeout(this.ethTimer);
        this.ethTimer = setTimeout(() => {
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then((response) => {
              context.commit('updateAccount', response);
            })
            .catch((error) => {
              context.commit('updateError', error);
            })
            .then(
              window.ethereum.request({ method: 'eth_chainId' })
                .then((response) => {
                  context.commit('updateChainId', response);
                  context.commit('updateConnection');
                })
                .catch((error) => {
                  context.commit('updateError', error);
                }),
            );
        }, 0);
      }
    },
    /* getEthBalance(context) {
      if (context.state.data.account !== null) {
        const account = context.state.data.account;
        clearTimeout(this.balanceTimer);
        this.balanceTimer = setTimeout(() => {
          window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest'],
          })
            .then((response) => {
              context.commit('updateBalance', response);
            })
            .catch((error) => {
              context.commit('updateBalanceError', error);
            });
        }, 0);
      }
    }, */
  },
  mutations: {
    updateAccount(state, data) {
      state.data.account = data;
    },
    updateChainId(state, data) {
      state.data.chainId = parseInt(data, 16);
    },
    updateError(state, error) {
      state.error = error;
    },
    updateConnection(state) {
      if (state.data.chainId == 97) {
        state.isConnected = true;
      }
    },
    updateBalance(state, data) {
      state.data.balance = parseInt(data, 16) * (10 ** (-18));
    },
    updateBalanceError(state, error) {
      state.balanceError = error;
    },
    updateOffers(state, data) {
      state.offers = data;
    },
  },
});
