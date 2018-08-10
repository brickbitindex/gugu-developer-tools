import React from 'react';
import { Icon } from '../../../lib/antd';

function renderArg(data, key) {
  if (typeof data === 'string') {
    return <div className="log-arg string" key={key}>{'"'}<span>{data}</span>{'"'}</div>;
  }
  if (typeof data === 'number') {
    return <div className="log-arg number" key={key}>{data}</div>;
  }
  if (typeof data === 'boolean') {
    return <div className="log-arg boolean" key={key}>{data}</div>;
  }
  if (data instanceof [].constructor) {
    return <div className="log-arg array" key={key}>{JSON.stringify(data)}</div>;
  }
  if (typeof data === 'object') {
    return <div className="log-arg object" key={key}>{JSON.stringify(data)}</div>;
  }
  return <div className="log-arg" key={key}>{data.toString()}</div>;
}

export default function LogRow(props) {
  const data = props.data;
  const args = data.args;

  return (
    <div className="row log" key={data.id}>
      <div className="icon">
        <Icon type="arrow-down" className="down" />
      </div>
      <div className="content">
        {args.map((arg, i) => renderArg(arg, i))}
      </div>
      <div className="caller">
        {data.caller}
      </div>
    </div>
  );
}
