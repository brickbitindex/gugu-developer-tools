import React from 'react';

import './box.scss';

const empty = {
  mt: '-',
  ml: '-',
  bt: '-',
  bl: '-',
  pt: '-',
  pl: '-',
  pr: '-',
  pb: '-',
  br: '-',
  bb: '-',
  mr: '-',
  mb: '-',
};

export default function Box(props) {
  const data = props.data || empty;

  return (
    <div id="marginBox" className="box">
      <div id="marginTop" className="box-top">{data.mt || '-'}</div>
      <div id="marginCenter" className="box-middle">
        <div id="marginLeft" className="box-left">{data.ml || '-'}</div>
        <div id="borderBox" className="box box-content">
          <div id="borderTop" className="box-top">{data.bt || '-'}</div>
          <div id="borderCenter" className="box-middle">
            <div id="borderLeft" className="box-left">{data.bl || '-'}</div>
            <div id="paddingBox" className="box box-content">
              <div id="paddingTop" className="box-top">{data.pt || '-'}</div>
              <div id="paddingCenter" className="box-middle">
                <div id="paddingLeft" className="box-left">{data.pl || '-'}</div>
                <div id="contentBox" className="box box-content">&nbsp;</div>
                <div id="paddingRight" className="box-right">{data.pr || '-'}</div>
              </div>
              <div id="paddingBottom" className="box-bottom">{data.pb || '-'}</div>
            </div>
            <div id="borderRight" className="box-right">{data.br || '-'}</div>
          </div>
          <div id="borderBottom" className="box-bottom">{data.bb || '-'}</div>
        </div>
        <div id="marginRight" className="box-right">{data.mr || '-'}</div>
      </div>
      <div id="marginBottom" className="box-bottom">{data.mb || '-'}</div>
    </div>
  );
}
