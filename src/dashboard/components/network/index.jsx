/* eslint no-confusing-arrow: 0 */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
// import autobind from 'autobind-decorator';
import { Icon, Table, Modal, Divider } from '../../../lib/antd';

import './style.scss';

function renderTime(tt) {
  const t = parseFloat(tt);
  if (t > 1000) return (t / 1000).toFixed(2) + 's';
  return t.toFixed(2) + 'ms';
}

const resourcesColumns = [{
  title: <FormattedMessage id="network_res_table_name" />,
  dataIndex: 'name',
  key: 'name',
  render: (t, r) => <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>,
}, {
  title: <FormattedMessage id="network_res_table_type" />,
  dataIndex: 'initiatorType',
  key: 'initiatorType',
}, {
  title: <FormattedMessage id="network_res_table_duration" />,
  dataIndex: 'duration',
  key: 'duration',
  render: t => renderTime(t),
}];

const xhrColumns = [{
  title: <FormattedMessage id="network_xhr_table_name" />,
  dataIndex: 'name',
  key: 'name',
}, {
  title: <FormattedMessage id="network_xhr_table_method" />,
  dataIndex: 'method',
  key: 'method',
}, {
  title: <FormattedMessage id="network_xhr_table_status" />,
  dataIndex: 'status',
  key: 'status',
}, {
  title: <FormattedMessage id="network_xhr_table_size" />,
  dataIndex: 'size',
  key: 'size',
}, {
  title: <FormattedMessage id="network_xhr_table_type" />,
  dataIndex: 'type',
  key: 'type',
  render: (_, r) => `${r.type}/${r.subType}`,
}, {
  title: <FormattedMessage id="network_xhr_table_duration" />,
  dataIndex: 'duration',
  key: 'duration',
  render: (_, r) => r.done ? renderTime(r.endTime - r.startTime) : <Icon type="loading" />,
}];

class Network extends Component {
  state = {
    command: '',
    showModal: false,
    selectedXhr: {},
  }
  @autobind
  handleRowClick(record) {
    console.log(record);
    this.setState({
      showModal: true,
      selectedXhr: record,
    });
  }
  render() {
    const { resources, xhr } = this.props;
    const { selectedXhr } = this.state;
    return (
      <div id="network">
        <h1><FormattedMessage id="network_xhr_table" /></h1>
        <Table
          dataSource={xhr}
          columns={xhrColumns}
          rowKey={(_, i) => i}
          pagination={false}
          onRow={record => ({
            onClick: this.handleRowClick.bind(this, record),
          })}
        />
        <h1><FormattedMessage id="network_res_table" /></h1>
        <Table
          dataSource={resources}
          columns={resourcesColumns}
          rowKey={(_, i) => i}
          pagination={false}
        />
        <Modal
          className="network-xhr-modal"
          title={selectedXhr.name}
          visible={this.state.showModal}
          footer={null}
          onCancel={() => this.setState({ showModal: false })}
        >
          <div className="row">
            <Divider className="key" orientation="left"><FormattedMessage id="network_xhr_modal_fullurl" /></Divider>
            <div className="value">{selectedXhr.fullUrl}</div>
          </div>
          {selectedXhr.data && (
            <div className="row">
              <Divider className="key" orientation="left"><FormattedMessage id="network_xhr_modal_data" /></Divider>
              <div className="value">{selectedXhr.data}</div>
            </div>
          )}
          {selectedXhr.resHeaders && (
            <div className="row">
              <Divider className="key" orientation="left"><FormattedMessage id="network_xhr_modal_res_headers" /></Divider>
              <div className="value">{Object.keys(selectedXhr.resHeaders).map(row => (
                <div className="resheader" key={row}><span className="header">{row}</span>: <span className="value">{selectedXhr.resHeaders[row]}</span></div>
              ))}</div>
            </div>
          )}
          <div className="row">
            <Divider className="key" orientation="left"><FormattedMessage id="network_xhr_modal_res_txt" /></Divider>
            <div className="value"><pre>{selectedXhr.resTxt}</pre></div>
          </div>
        </Modal>
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    resources: connector.resources,
    xhr: connector.xhr,
  };
}

export default connect(mapStateToProps)(Network);
