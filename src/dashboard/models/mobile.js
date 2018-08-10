function isMobile() {
  return window.innerWidth < 875;
}

export default {
  namespace: 'mobile',
  state: {
    showMenu: false,
    isMobile: false,
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'updateState',
        payload: {
          isMobile: isMobile(),
        },
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
