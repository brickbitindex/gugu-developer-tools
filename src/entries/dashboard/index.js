import dva from 'dva';
import Clipboard from 'clipboard';
import router from './router';
import models from '../../dashboard/models';
import { message } from '../../lib/antd';
import { I18N } from '../../dashboard/constants';


window.clipboard = new Clipboard('.clipboard-target');
window.clipboard.on('success', (e) => {
  message.success('複製成功');
  e.clearSelection();
});

window.clipboard.on('error', () => {
  message.success('複製失敗，請嘗試手動複製');
});

window.locale = 'zh-TW';

function render() {
  window.i18n = I18N;
  // 初始化
  const app = dva();
  Object.keys(models).forEach((key) => {
    app.model(models[key]);
  });
  app.router(router);
  app.start('#app');
}

if (!global.Intl) {
  require.ensure([
    'intl',
  ], (require) => {
    require('intl');

    render();
  });
} else {
  render();
}
