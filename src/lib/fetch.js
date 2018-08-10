import qs from 'qs';
import { message } from './antd';
import '../assets/lib/fetch';

// const $token = document.querySelector('meta[name=csrf-token]');
// let token = '';
// if ($token) {
//   token = $token.getAttribute('content');
// }

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401 || response.status === 403) {
    window.location.href = `/${window.locale.toLowerCase()}?open=signin&redirect_to=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
  }
  const { status, statusText } = response;
  throw new Error(`[${status}] ${statusText}`);
}

function parseJSON(response) {
  return response.json();
}

function processData(data) {
  if (data.success === false) {
    data.errors.forEach(e => message.error(e.message ? e.message : e));
  }
  return data;
}

function catchError(error) {
  message.error(error.message);
  return {
    success: false,
  };
}

const fetchlib = window.fetch;

const fetch = {
  post(url, data, options = {}, form = false) {
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
        locale: window.locale,
      });
    }
    return fetchlib(url, {
      headers: {
        // Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'X-CSRF-Token': token,
        'Content-Type': 'application/json',
      },
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(processData)
    .catch(catchError);
  },
  put(url, data, options = {}, form = false) {
    let body;
    if (form) {
      data.append('locale', window.locale);
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
        locale: window.locale,
      });
    }
    return fetchlib(url, {
      headers: {
        // Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'X-CSRF-Token': token,
        'Content-Type': 'application/json',
      },
      ...options,
      body,
      method: 'PUT',
      credentials: 'include',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(processData)
    .catch(catchError);
  },
  delete(url, options = {}) {
    return fetchlib(url, {
      headers: {
        // Accept: '*/*',
        // 'X-CSRF-Token': token,
        'Content-Type': 'application/json',
      },
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(processData)
    .catch(catchError);
  },
  get(url, data, options = {}) {
    let queryUrl = url;
    const params = data ? qs.stringify({ ...data, locale: window.locale }) : qs.stringify({ locale: window.locale });
    queryUrl += '?' + params;
    return fetchlib(queryUrl, {
      headers: {
        // Accept: '*/*',
        // 'X-CSRF-Token': token,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      ...options,
      method: 'GET',
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(processData)
    .catch(catchError);
  },
};

export default fetch;
