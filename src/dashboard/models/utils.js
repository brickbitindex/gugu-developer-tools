import { routerRedux } from 'dva/router';

const push = routerRedux.push;

const pathInfos = {
  '/': {
    activeMenu: '0',
  },
  '/elements': {
    activeMenu: '1',
  },
  '/console': {
    activeMenu: '2',
  },
  '/network': {
    activeMenu: '3',
  },
  '/info': {
    activeMenu: '4',
  },
  '/feature': {
    activeMenu: '5',
  },
  '/tracker': {
    activeMenu: '6',
  },
};


export default {
  namespace: 'utils',
  state: {
    pathname: '',
    history: null,
    locale: '',
    pathInfo: undefined,
    i18n: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 设置locale
      dispatch({
        type: 'updateState',
        payload: {
          locale: window.locale,
          i18n: window.i18n,
        },
      });

      history.listen(({ pathname }) => {
        dispatch({ type: 'updateCurrentPathName', pathname, history });
      });
    },
  },
  effects: {
    * goBack(_, { select }) {
      const history = yield select(({ utils }) => utils.history);
      history.goBack();
    },
    * goto({ goto }, { put }) {
      yield put(push(goto));
    },
  },
  reducers: {
    updateCurrentPathName(state, { pathname, history }) {
      const pathInfo = pathInfos[pathname];
      return { ...state, pathname, history, pathInfo };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
