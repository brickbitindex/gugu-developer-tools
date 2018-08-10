import { getUuid } from '../utils';

export default {
  namespace: 'connector',
  state: {
    uuid: null,
    state: 'disconnect',
    connection: { tick: 0, connections: {} },
    online: false,
    elements: null,
    consoleRows: [],
    commandPending: false,
    resources: [],
    xhr: [],
    info: {},
    feature: {},
    featureDocId: -1,
    record: null,
  },
  effects: {
    * connect({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          state: 'pending',
          uuid: payload,
        },
      });
    },
    * updateOnlineState({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          online: payload,
        },
      });
    },
    * selectDom({ payload }, { select }) {
      const selectDom = yield select(({ connector }) => connector.selectDom);
      if (selectDom) {
        selectDom(payload);
      }
    },
    * updateElementStyle({ payload }, { select }) {
      const updateElementStyle = yield select(({ connector }) => connector.updateElementStyle);
      if (updateElementStyle) {
        updateElementStyle(payload);
      }
    },
    * addConsoleRow({ payload }, { select, put }) {
      let consoleRows = yield select(({ connector }) => connector.consoleRows);
      consoleRows = [...consoleRows];
      consoleRows.push(payload);
      yield put({
        type: 'updateState',
        payload: {
          consoleRows,
        },
      });
    },
    * submitCommand({ payload }, { select, put }) {
      const submitCommand = yield select(({ connector }) => connector.submitCommand);
      if (submitCommand) {
        submitCommand(payload);
      }
      yield put({
        type: 'updateState',
        payload: {
          commandPending: true,
        },
      });
    },
    * sendCommand({ payload }, { select }) {
      const submitCommand = yield select(({ connector }) => connector.submitCommand);
      if (submitCommand) {
        submitCommand(payload);
      }
    },
    * recieveCommandResponse({ payload }, { select, put }) {
      let consoleRows = yield select(({ connector }) => connector.consoleRows);
      consoleRows = [...consoleRows];
      const i = consoleRows.findIndex(row => row.id === payload.id);
      if (i > -1) {
        consoleRows[i] = {
          ...consoleRows[i],
          data: payload,
        };
      }
      yield put({
        type: 'updateState',
        payload: {
          consoleRows,
          commandPending: payload.pending,
        },
      });
    },
    * updateResource({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          resources: payload,
        },
      });
    },
    * updateXhr({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          xhr: payload,
        },
      });
    },
    * updateInfo({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          info: payload,
        },
      });
    },
    * updateFeature({ payload }, { put, select }) {
      const docId = yield select(({ connector }) => connector.featureDocId);
      if (docId !== payload.docId) return;
      if (docId !== payload.resultId) return;
      yield put({
        type: 'updateState',
        payload: {
          feature: JSON.parse(payload.result),
        },
      });
    },
    * detectFeature({ payload }, { select, put }) {
      const detectFeature = yield select(({ connector }) => connector.detectFeature);
      const docId = getUuid();
      if (detectFeature) {
        detectFeature(payload, docId);
      }
      yield put({
        type: 'updateState',
        payload: {
          featureDocId: docId,
        },
      });
    },
    * updateRecord({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          record: payload,
        },
      });
    },
    * replayRecord({ payload }, { select }) {
      const replayRecord = yield select(({ connector }) => connector.replayRecord);
      if (replayRecord) {
        replayRecord(payload);
      }
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
