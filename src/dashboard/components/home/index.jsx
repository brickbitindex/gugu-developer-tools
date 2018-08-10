import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import { Input, Icon, Button } from '../../../lib/antd';

import './style.scss';

class Home extends Component {
  state = {
    uuid: '',
  }

  @autobind
  handleConnect() {
    this.props.dispatch({
      type: 'connector/connect',
      payload: this.state.uuid,
    });
  }
  render() {
    const { uuid } = this.state;
    const { state } = this.props;
    return (
      <div id="home">
        <div><img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3431954863,1945330254&fm=116&gp=0.jpg" alt="" /></div>
        <h1><FormattedMessage id="welcome" /></h1>
        <div className="form">
          <div className="row">
            <Input
              prefix={<Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="UUID"
              value={uuid}
              onChange={e => this.setState({ uuid: e.target.value })}
            />
          </div>
          <div className="row">
            <Button
              type="primary"
              disabled={state === 'connected'}
              loading={state === 'pending'}
              onClick={this.handleConnect}
            ><FormattedMessage id="home_connect" /></Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ connector }) {
  return {
    state: connector.state,
  };
}

export default connect(mapStateToProps)(Home);

