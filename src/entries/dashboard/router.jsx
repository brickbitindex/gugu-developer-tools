import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
// import dynamic from 'dva/dynamic';
// import injectTapEventPlugin from 'react-tap-event-plugin';

// 优先加载antd样式
import '../../lib/antd/style.less';

import Main from '../../dashboard/layout/main';  // 主视图
import Home from '../../dashboard/components/home';
import Elements from '../../dashboard/components/elements';
import Console from '../../dashboard/components/console';
import Network from '../../dashboard/components/network';
import Info from '../../dashboard/components/info';
import Feature from '../../dashboard/components/feature';
import Tracker from '../../dashboard/components/tracker';


const { ConnectedRouter } = routerRedux;

function welcome() {
  if (window.console && window.console.log) {
    window.console.log('%cFBI WARNING', 'color:#fff;font-size:40px;font-weight:600;background-color:red');
    window.console.log('%c网络一线牵，珍惜这段缘', 'text-shadow:3px 1px 1px grey;font-size:20px');
    window.console.log('请将简历投至：\n%csekai@ku-chain.com', 'color:red;text-shadow:3px 1px 1px pink;font-size:20px');
    window.console.log('%c请不要在开发者工具控制台内执行任何代码，这有可能对网站数据造成不必要的麻烦，给你造成损失哦！', 'font-size:16px');
  }
}

welcome();
export default function Routers({ history /* , app*/ }) {
  return (
    <ConnectedRouter history={history}>
      <Main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/elements" component={Elements} />
          <Route exact path="/console" component={Console} />
          <Route exact path="/network" component={Network} />
          <Route exact path="/info" component={Info} />
          <Route exact path="/feature" component={Feature} />
          <Route exact path="/tracker" component={Tracker} />
        </Switch>
      </Main>
    </ConnectedRouter>
  );
}
