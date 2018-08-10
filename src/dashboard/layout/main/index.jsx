/**
 * @name: Main组件
 * @description: 主layout组件
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
// import classnames from 'classnames';
// import autobind from 'autobind-decorator';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import { Layout, Menu } from '../../../lib/antd';
import Connector from '../../connector';
import './style.scss';
import './layout.scss';

addLocaleData([...en, ...zh, ...ja, ...ko]);

const { Header, Content, Footer } = Layout;

class Main extends Component {
  render() {
    const { locale, messages, pathInfo } = this.props;
    const localePrefix = locale.split('-')[0];
    const { activeMenu } = pathInfo;
    return (
      <IntlProvider locale={localePrefix} key={locale} messages={messages}>
        <Layout className="layout">
          <Header className="layout-header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[activeMenu]}
            >
              <Menu.Item key="0"><a href="#/"><FormattedMessage id="menu_home" /></a></Menu.Item>
              <Menu.Item key="1"><a href="#/elements"><FormattedMessage id="menu_elements" /></a></Menu.Item>
              <Menu.Item key="2"><a href="#/console"><FormattedMessage id="menu_console" /></a></Menu.Item>
              <Menu.Item key="3"><a href="#/network"><FormattedMessage id="menu_network" /></a></Menu.Item>
              <Menu.Item key="4"><a href="#/info"><FormattedMessage id="menu_info" /></a></Menu.Item>
              <Menu.Item key="5"><a href="#/feature"><FormattedMessage id="menu_feature" /></a></Menu.Item>
              <Menu.Item key="6"><a href="#/tracker"><FormattedMessage id="menu_tracker" /></a></Menu.Item>
            </Menu>
            <Connector />
          </Header>
          <Content className="layout-content">
            <div className="layout-page">
              {this.props.children}
            </div>
          </Content>
          <Footer className="layout-footer">
            BitRabbit ©2018 Created by BitRabbit UED
          </Footer>
        </Layout>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ utils }) {
  return {
    pathname: utils.pathname,
    locale: utils.locale,
    messages: utils.i18n,
    pathInfo: utils.pathInfo,
  };
}

export default withRouter(connect(mapStateToProps)(Main));
