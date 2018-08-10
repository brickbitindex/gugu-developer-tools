import React from 'react';
import { Icon } from '../../../lib/antd';

function renderArg(data) {
  if (typeof data === 'string') {
    return <div className="log-arg string">{'"'}<span>{data}</span>{'"'}</div>;
  }
  if (typeof data === 'number') {
    return <div className="log-arg number">{data}</div>;
  }
  if (typeof data === 'boolean') {
    return <div className="log-arg boolean">{data}</div>;
  }
  if (data instanceof [].constructor) {
    return <div className="log-arg array">{JSON.stringify(data)}</div>;
  }
  if (typeof data === 'object') {
    return <div className="log-arg object">{JSON.stringify(data)}</div>;
  }
  return <div className="log-arg">{data.toString()}</div>;
}

function getErrorSign(str, columnNumber) {
  if (columnNumber === 0) {
    return str;
  }
  return <span>{str.slice(0, columnNumber - 1)}<span className="error-sigin">{str[columnNumber - 1]}</span>{str.slice(columnNumber)}</span>;
}

export default function CommandRow(props) {
  const data = props.data;

  let command;
  if (data.pending) {
    command = <div className="command">{data.command}<Icon type="loading" className="pending" /></div>;
  } else if (data.success) {
    command = <div className="command">{data.command}</div>;
  } else {
    command = <div className="command">{getErrorSign(data.command, data.response.columnNumber)}</div>;
  }

  return (
    <div className="row command" key={data.id}>
      <div className="icon">
        <Icon type="arrow-up" className="up" />
      </div>
      <div className="content">
        {command}
        {!data.pending && data.success && (
          <div className="response">
            <div className="response-icon">
              <Icon type="arrow-down" className="down" />
            </div>
            {renderArg(data.response)}
          </div>
        )}
        {!data.pending && !data.success && (
          <div className="response error">
            <div className="response-icon">
              <Icon type="close" className="error" />
            </div>
            <div className="error-message">{data.response.message}</div>
            {data.response.stack.split('\n').map((str, i) => (
              <div className="error-stack" key={i}><pre>{str}</pre></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
