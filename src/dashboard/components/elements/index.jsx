import React, { Component } from 'react';
import { connect } from 'dva';
import Box from './box';
import ComputedStyle from './computedStyle';
import Structure from './structure';
import StyleSheet from './styleSheet';
import ElementStyle from './elementStyle';

import './style.scss';

class Elements extends Component {
  render() {
    const { elements } = this.props;
    return (
      <div id="elements">
        <div className="left">
          <Structure data={elements && elements.info && elements.info.structure} />
          {elements && elements.info && (
            <ElementStyle data={elements.info.styleAttr} />
          )}
          {elements && elements.info && elements.info.styleSheets && elements.info.styleSheets.map((s, i) => (
            <StyleSheet data={s} key={i} />
          ))}
        </div>
        <div className="right">
          <Box data={elements && elements.info} />
          <ComputedStyle data={elements && elements.info && elements.info.computedStyle} />
        </div>
      </div>
    );
  }
}


function mapStateToProps({ connector }) {
  return {
    elements: connector.elements,
  };
}

export default connect(mapStateToProps)(Elements);
