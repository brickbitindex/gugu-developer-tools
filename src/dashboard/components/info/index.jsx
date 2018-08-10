/* eslint no-confusing-arrow: 0 */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
// import autobind from 'autobind-decorator';
import { Form } from '../../../lib/antd';

import './style.scss';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};


function getBoxSize(screenStr, viewportStr) {
  const screen = screenStr.split('*').map(n => n.trim());
  const viewport = viewportStr.split('*').map(n => n.trim());
  screen[0] = [screen[0] / screen[1], screen[0]];
  screen[1] = [1, screen[1]];
  viewport[0] = [viewport[0] / screen[1][1], viewport[0]];
  viewport[1] = [viewport[1] / screen[1][1], viewport[1]];
  return {
    screen,
    viewport,
  };
}

const boxHeight = 150;

class Info extends Component {
  render() {
    const { info } = this.props;
    const box = (info.screen && info.viewport) ? getBoxSize(info.screen, info.viewport) : null;
    return (
      <div id="info">
        {box && (
          <div className="info-box">
            <div className="text">
              <Form>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="info_screen" />}
                >
                  {info.screen}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="info_viewport" />}
                >
                  {info.viewport}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="info_useragent" />}
                >
                  {info.userAgent}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="info_location" />}
                >
                  {info.location}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="info_pixelratio" />}
                >
                  {info.pixelRatio}
                </FormItem>
              </Form>
            </div>
            <div className="screen" style={{ width: boxHeight * box.screen[0][0], height: boxHeight }}>
              <div className="screen-w" style={{ width: boxHeight * box.screen[0][0] }}>{box.screen[0][1]}</div>
              <div className="screen-h" style={{ width: boxHeight }}>{box.screen[1][1]}</div>
              <div className="viewport" style={{ width: boxHeight * box.viewport[0][0], height: boxHeight * box.viewport[1][0] }}>{info.viewport}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    info: connector.info,
  };
}

export default connect(mapStateToProps)(Info);
