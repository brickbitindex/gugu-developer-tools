/* eslint no-confusing-arrow: 0 */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import autobind from 'autobind-decorator';
import { Input, Button } from '../../../lib/antd';

import './style.scss';

const { TextArea } = Input;

class Tracker extends Component {
  state = {
    code: '',
  }
  @autobind
  handleGetCode() {
    this.setState({
      code: JSON.stringify(this.props.record, undefined, 2),
    });
  }
  @autobind
  handleReplayCode() {
    const checkedRecord = this.parseCode();
    if (checkedRecord) {
      this.props.dispatch({
        type: 'connector/replayRecord',
        payload: checkedRecord,
      });
    }
  }
  parseCode() {
    try {
      const record = JSON.parse(this.state.code);
      if (!record.startAt || !record.endAt || !record.startPos || !record.events) return null;
      return record;
    } catch (e) {
      return null;
    }
  }
  renderRow(data) {
    switch (data.type) {
      case 'mousedown':
        return <FormattedMessage id="tracker_mousedown" />;
      case 'mouseup':
        return <FormattedMessage id="tracker_mouseup" />;
      case 'touchstart':
        return <FormattedMessage id="tracker_touchstart" />;
      case 'touchend':
        return <FormattedMessage id="tracker_touchend" />;
      case 'scroll':
        return <FormattedMessage id="tracker_scroll" values={{ x: data.data[0], y: data.data[1] }} />;
      case 'focus':
        return <FormattedMessage id="tracker_focus" />;
      case 'blur':
        return <FormattedMessage id="tracker_blur" />;
      case 'input':
        return <FormattedMessage id={`tracker_input_${data.data[0]}`} values={{ str: data.data[1] }} />;
      default:
        break;
    }
    return undefined;
  }
  render() {
    const checkedRecord = this.parseCode();
    return (
      <div id="tracker">
        <div className="content">
          {checkedRecord ? (
            <div className="parse">
              <div className="row"><FormattedMessage id="tracker_scroll" values={{ x: checkedRecord.startPos[0], y: checkedRecord.startPos[1] }} /></div>
              {checkedRecord.events.map((event, i) => (
                <div className="row" key={i}>{this.renderRow(event)}</div>
              ))}
            </div>
          ) : (
            <div className="parse">
              <FormattedMessage id="tracker_parse_error" />
            </div>
          )}
          <div className="input-area">
            <TextArea value={this.state.code} onChange={e => this.setState({ code: e.target.value })} />
          </div>
        </div>
        <div className="opt">
          <Button type="primary" onClick={this.handleGetCode}><FormattedMessage id="tracker_get" /></Button>
          <Button type="primary" onClick={this.handleReplayCode}><FormattedMessage id="tracker_replay" /></Button>
        </div>
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    record: connector.record,
  };
}

export default connect(mapStateToProps)(Tracker);
