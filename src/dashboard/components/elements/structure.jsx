import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Breadcrumb } from '../../../lib/antd';

import './structure.scss';

function getTag(tagData) {
  const tag = tagData[0];
  const id = (tagData[1] && tagData[1].length > 0) ? (
    <span>&nbsp;<span className="attr">id</span>=&quot;<span className="attr-v">{tagData[1]}</span>&quot;</span>
  ) : undefined;
  const classes = (tagData[2] && tagData[2].length > 0) ? (
    <span>&nbsp;<span className="attr">class</span>=&quot;<span className="attr-v">{tagData[2]}</span>&quot;</span>
  ) : undefined;
  return (
    <code className="dom">&lt;<span className="tag">{tag}</span>{id}{classes} /&gt;</code>
  );
}

function getTagPair(tagData) {
  const tag = tagData[0];
  const id = (tagData[1] && tagData[1].length > 0) ? (
    <span>&nbsp;<span className="attr">id</span>=&quot;<span className="attr-v">{tagData[1]}</span>&quot;</span>
  ) : undefined;
  const classes = (tagData[2] && tagData[2].length > 0) ? (
    <span>&nbsp;<span className="attr">class</span>=&quot;<span className="attr-v">{tagData[2]}</span>&quot;</span>
  ) : undefined;
  return [(
    <code className="dom">&lt;<span className="tag">{tag}</span>{id}{classes}&gt;</code>
  ), (
    <code className="dom">&lt;/<span className="tag">{tag}</span>&gt;</code>
  )];
}

class ParentDom extends Component {
  handleSelectBrother(index) {
    this.props.dispatch({
      type: 'connector/selectDom',
      payload: ['element.select', 'brothers', index],
    });
  }
  handleSelectParent(index) {
    this.props.dispatch({
      type: 'connector/selectDom',
      payload: ['element.select', 'parent', index],
    });
  }

  render() {
    const data = this.props.data;
    if (!data) {
      return <div className="parent" />;
    }
    const lastParentIndex = data.parents.length - 1;
    const lastParent = data.parents[lastParentIndex];
    const tagPair = getTagPair(lastParent);
    if (data.parents.length === 1) {
      return (
        <div className="parent">
          <div className="name" onClick={this.handleSelectParent.bind(this, lastParentIndex)}>{tagPair[0]}</div>
          <div className="children">
            {data.brothers.map((bro, i) => (
              <div className={classnames('brother', { self: i === data.index })} key={i} onClick={this.handleSelectBrother.bind(this, i)}>{getTag(bro)}</div>
            ))}
          </div>
          <div className="name" onClick={this.handleSelectParent.bind(this, lastParentIndex)}>{tagPair[1]}</div>
        </div>
      );
    }
    const childrenData = {
      ...data,
    };
    const childrenParents = [...data.parents];
    childrenParents.pop();
    childrenData.parents = childrenParents;
    return (
      <div className="parent">
        <div className="name" onClick={this.handleSelectParent.bind(this, lastParentIndex)}>{tagPair[0]}</div>
        <div className="children">
          <ParentDom data={childrenData} dispatch={this.props.dispatch} />
        </div>
        <div className="name" onClick={this.handleSelectParent.bind(this, lastParentIndex)}>{tagPair[1]}</div>
      </div>
    );
  }
}

function getSelectorStr(data) {
  let ret = data[0];
  if (data[1] && data[1].length > 0) {
    ret += '#' + data[1];
  }
  if (data[2] && data[2].length > 0) {
    ret += '.' + data[2].replace(/\s+/g, '.');
  }
  return ret;
}

class Structure extends Component {
  handleSelectParent(index) {
    const i = this.props.data.parents.length - index - 1;
    this.props.dispatch({
      type: 'connector/selectDom',
      payload: ['element.select', 'parent', i],
    });
  }
  render() {
    const { data, dispatch } = this.props;
    let path = [];
    if (data && data.parents) {
      path = [...data.parents];
      path.reverse();
      path.push(data.brothers[data.index]);
    }
    return (
      <div className="structure">
        <div className="doms">
          <ParentDom data={data} dispatch={dispatch} />
        </div>
        <div>
          <Breadcrumb separator=">">
            {path.map((dom, i) => (
              <Breadcrumb.Item key={i}>{i < path.length - 1 ? (
                <a onClick={this.handleSelectParent.bind(this, i)}>{getSelectorStr(dom)}</a>
              ) : (getSelectorStr(dom))}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Structure);
