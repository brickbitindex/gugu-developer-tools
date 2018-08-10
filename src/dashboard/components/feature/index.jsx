/* eslint no-confusing-arrow: 0 */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import autobind from 'autobind-decorator';

import './style.scss';

const { TextArea } = Input;

function FeatureBlock(props) {
  const { name, data } = props;
  let type = '';
  let text = '';
  if (data === true) {
    type = 'support';
    text = 'Support';
  }
  if (data === false) {
    type = 'not-support';
    text = 'Not Support';
  }
  if (data !== true && data) {
    type = 'partial';
    text = 'Partial support';
  }
  return (
    <div className="block">
      <div className={'content ' + type}>
        <div className="name">{name}</div>
        <div className="result">{text}</div>
      </div>
    </div>
  );
}

class Feature extends Component {
  state = {
    code: '',
  }

  @autobind
  handleSubmitCode() {
    const code = this.state.code;
    this.props.dispatch({
      type: 'connector/detectFeature',
      payload: code,
    });
  }
  render() {
    const { feature } = this.props;
    const { code } = this.state;
    return (
      <div id="feature">
        <h1><FormattedMessage id="feature_input" /></h1>
        <div className="input-area">
          <TextArea rows={5} value={code} onChange={e => this.setState({ code: e.target.value })} />
          <Button type="primary" onClick={this.handleSubmitCode}><FormattedMessage id="feature_submit" /></Button>
        </div>
        <div className="features">
          {Object.keys(feature).map(f => <FeatureBlock key={f} name={f} data={feature[f]} />)}
        </div>
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    feature: connector.feature,
  };
}

export default connect(mapStateToProps)(Feature);
