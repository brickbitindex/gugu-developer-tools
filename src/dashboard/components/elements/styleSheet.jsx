import React from 'react';

import './styleSheet.scss';

export default function StyleSheet(props) {
  const data = props.data;
  return (
    <div className="stylesheet">
      <div>{data.selector} {'{'}</div>
      {Object.keys(data.style).map(key => (
        <div className="style" key={key}><span>{key}</span>: {data.style[key]};</div>
      ))}
      <div>{'}'}</div>
    </div>
  );
}
