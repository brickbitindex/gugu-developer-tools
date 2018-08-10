import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import { Icon, Input } from '../../../lib/antd';
import LogRow from './logRow';
import CommandRow from './commandRow';

import './style.scss';

class Console extends Component {
  state = {
    command: '',
  }
  getRow(row) {
    if (row.type === 'log') return <LogRow data={row.data} key={row.id} />;
    if (row.type === 'command') return <CommandRow data={row.data} key={row.id} />;
    return undefined;
  }
  @autobind
  handleCommandChange(e) {
    this.setState({
      command: e.target.value,
    });
  }
  @autobind
  handleCommandSubmit() {
    const payload = this.state.command;
    this.props.dispatch({
      type: 'connector/submitCommand',
      payload,
    });
    this.setState({
      command: '',
    });
  }
  render() {
    const { rows, commandPending } = this.props;
    return (
      <div id="console">
        <div className="rows">
          {rows.map(row => this.getRow(row))}
          <div className="row input">
            <div className="icon">
              <Icon type="right" className="right" />
            </div>
            <div className="content">
              <Input
                type="text"
                size="small"
                value={this.state.command}
                onChange={this.handleCommandChange}
                onPressEnter={this.handleCommandSubmit}
                disabled={commandPending}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    rows: connector.consoleRows,
    commandPending: connector.commandPending,
  };
}

export default connect(mapStateToProps)(Console);
