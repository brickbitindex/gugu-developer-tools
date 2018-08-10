import React, { Component } from 'react';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import { FormattedMessage } from 'react-intl';
import { message, Icon, Tag } from '../../lib/antd';
import { getUuid, JSONDecoder } from '../utils';

import './style.scss';

const TICK_BLOCK = 3000;
const DISCONNECT_BLOCK = 10000;

const SELF_UUID = getUuid();


class Connector extends Component {
  componentWillReceiveProps(props) {
    if (props.uuid && props.uuid !== this.props.uuid) {
      // 新建連接
      this.handleConnect(props.uuid);
    }
  }

  componentWillUnmount() {
    clearInterval(this.tickWatcher);
  }

  tickWatcher: undefined
  connector = window.__gugu_connector__

  handleConnect(uuid = this.props.uuid) {
    const { i18n, dispatch } = this.props;
    const connector = this.connector;
    const key = 'connection/' + uuid;
    connector.getData(key).then((data) => {
      if (!data) {
        // 不存在
        message.error(i18n.connection_null);
        dispatch({
          type: 'connector/updateState',
          payload: { state: 'disconnect', uuid: null },
        });
        return;
      }
      if (new Date() - new Date(data.tick) > DISCONNECT_BLOCK) {
        // 離線
        message.error(i18n.connection_offline);
        dispatch({
          type: 'connector/updateState',
          payload: { state: 'disconnect', uuid: null },
        });
        connector.deleteData(key);
        return;
      }
      // 監聽連接
      this.startListen();
      this.startConnection();
      message.success(i18n.connection_online);
      // 注入一些回調
      dispatch({
        type: 'connector/updateState',
        payload: {
          state: 'connected',
          selectDom: this.selectDom,
          updateElementStyle: this.updateElementStyle,
          submitCommand: this.submitCommand,
          detectFeature: this.detectFeature,
          replayRecord: this.replayRecord,
        },
      });
    });
  }

  startConnection() {
    // 監聽遠端是否掉線
    this.tickWatcher = setInterval(this.checkConnection, TICK_BLOCK);
    this.checkConnection();
  }

  startListen() {
    const uuid = this.props.uuid;
    const connector = this.connector;
    connector.onDataChange('connection/' + uuid, this.connectionListener);
    connector.onDataChange('element/' + uuid, this.elementsListener);
    connector.onDataChange('log/' + uuid, this.logListener);
    connector.onDataChange('command/' + uuid, this.commandListener);
    connector.onDataChange('resource/' + uuid, this.resourceListener);
    connector.onDataChange('xhr/' + uuid, this.xhrListener);
    connector.onDataChange('info/' + uuid, this.infoListener);
    connector.onDataChange('feature/' + uuid, this.featureListener);
    connector.onDataChange('records/' + uuid, this.recordListener);
  }

  @autobind
  checkConnection() {
    const connector = this.connector;
    const now = new Date().getTime();
    const { uuid, connection } = this.props;
    this.props.dispatch({
      type: 'connector/updateOnlineState',
      payload: now - connection.tick < DISCONNECT_BLOCK,
    });
    // 傳回自己的心跳
    const connections = {
      ...connection.connections,
      [SELF_UUID]: now,
    };
    connector.updateData(`connection/${uuid}`, {
      connections,
    });
  }

  @autobind
  connectionListener(data) {
    if (!data) return;
    this.props.dispatch({
      type: 'connector/updateState',
      payload: { connection: { ...data } },
    });
  }

  @autobind
  elementsListener(data) {
    if (!data) return;
    if (!this.props.connection) return;
    if (data.connectionId !== this.props.connection.connectionId) return;
    this.props.dispatch({
      type: 'connector/updateState',
      payload: { elements: { ...data } },
    });
  }

  @autobind
  logListener(originData) {
    if (!originData) return;
    const data = {
      ...originData,
      args: originData.args.map(arg => JSONDecoder(arg)),
    };
    this.props.dispatch({
      type: 'connector/addConsoleRow',
      payload: {
        data,
        id: data.id,
        type: 'log',
      },
    });
  }

  @autobind
  commandListener(data) {
    if (!data) return;
    const connections = data.connections;
    const response = connections[SELF_UUID];
    if (!response) return;
    const payload = {
      ...response,
    };
    if (payload.success) {
      payload.response = JSONDecoder(response.response);
    }
    this.props.dispatch({
      type: 'connector/recieveCommandResponse',
      payload,
    });
  }

  @autobind
  resourceListener(data) {
    if (!data) return;
    if (!this.props.connection) return;
    if (data.connectionId !== this.props.connection.connectionId) return;
    this.props.dispatch({
      type: 'connector/updateResource',
      payload: data.resources,
    });
  }

  @autobind
  xhrListener(data) {
    if (!data) return;
    if (!this.props.connection) return;
    if (data.connectionId !== this.props.connection.connectionId) return;
    const payload = Object.keys(data.resources).map(key => data.resources[key]);
    payload.sort((a, b) => a.startTime - b.startTime);
    this.props.dispatch({
      type: 'connector/updateXhr',
      payload,
    });
  }

  @autobind
  infoListener(data) {
    if (!data) return;
    this.props.dispatch({
      type: 'connector/updateInfo',
      payload: data,
    });
  }

  @autobind
  featureListener(data) {
    if (!data) return;
    this.props.dispatch({
      type: 'connector/updateFeature',
      payload: data,
    });
  }

  @autobind
  recordListener(data) {
    if (!data) return;
    if (!this.props.connection) return;
    this.props.dispatch({
      type: 'connector/updateRecord',
      payload: data,
    });
  }

  @autobind
  selectDom(payload) {
    const { uuid } = this.props;
    this.connector.updateData(`element/${uuid}`, {
      command: payload,
    });
  }

  @autobind
  updateElementStyle(payload) {
    const { uuid } = this.props;
    this.connector.updateData(`element/${uuid}`, {
      command: payload,
    });
  }

  @autobind
  submitCommand(payload) {
    const { uuid } = this.props;
    const data = {
      command: payload,
      pending: true,
      success: false,
      response: null,
      id: getUuid(),
    };
    this.connector.updateData(`command/${uuid}`, {
      [`connections.${SELF_UUID}`]: {
        ...data,
      },
    });
    this.props.dispatch({
      type: 'connector/addConsoleRow',
      payload: {
        data,
        id: data.id,
        type: 'command',
      },
    });
  }

  @autobind
  detectFeature(payload, docId) {
    const { uuid } = this.props;
    this.connector.updateData(`feature/${uuid}`, {
      doc: payload,
      docId,
    });
    this.props.dispatch({
      type: 'connector/updateState',
      payload: {
        docId,
      },
    });
  }

  @autobind
  replayRecord(payload) {
    const { uuid } = this.props;
    this.connector.setData(`replay/${uuid}`, {
      ...payload,
      replayId: getUuid(),
    });
  }

  render() {
    return (
      <div id="connector">{this.props.online ? (
        <Tag color="green">
          <Icon type="smile-o" />
          <FormattedMessage id="connector_online" />
        </Tag>
      ) : (
        <Tag color="red">
          <Icon type="frown-o" />
          <FormattedMessage id="connector_offline" />
        </Tag>
      )}</div>
    );
  }
}

function mapStateToProps({ utils, connector }) {
  return {
    uuid: connector.uuid,
    i18n: utils.i18n,
    connection: connector.connection,
    online: connector.online,
  };
}

export default connect(mapStateToProps)(Connector);

