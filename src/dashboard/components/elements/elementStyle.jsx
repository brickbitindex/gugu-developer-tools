import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { Input, Button } from '../../../lib/antd';

import './elementStyle.scss';

class ElementStyle extends Component {
  state = {
    edit: false,
    editStyle: [],
  }
  getData() {
    const { data } = this.props;
    if (!data) return [];
    let arr = data.split(';');
    arr = arr.map(style => style.split(':').map(t => t.trim())).filter(style => style.length === 2);
    return arr;
  }
  @autobind
  handleEdit() {
    if (this.edit) return;
    const editStyle = this.getData();
    this.setState({
      edit: true,
      editStyle,
    });
  }
  handleChangeKey(index, e) {
    const editStyle = [...this.state.editStyle];
    editStyle[index][0] = e.target.value;
    this.setState({
      editStyle,
    });
  }
  handleChangeValue(index, e) {
    const editStyle = [...this.state.editStyle];
    editStyle[index][1] = e.target.value;
    this.setState({
      editStyle,
    });
  }
  @autobind
  handleAddStyle() {
    const editStyle = [...this.state.editStyle];
    editStyle.push(['', '']);
    this.setState({
      editStyle,
    });
  }
  @autobind
  handleSubmit() {
    const editStyle = this.state.editStyle.filter(e => e[0].length > 0 && e[1].length > 0);
    const stylestr = editStyle.map(s => `${s[0]}:${s[1]}`).join(';');
    this.props.dispatch({
      type: 'connector/updateElementStyle',
      payload: ['element.style', stylestr],
    });
    this.setState({
      edit: false,
    });
  }
  render() {
    const style = this.getData();
    return (
      <div className="stylesheet elementstyle">
        <div onClick={this.handleEdit}><span className="self">element.style</span> {'{'}</div>
        {this.state.edit ? (
          <div>
            {this.state.editStyle.map((s, i) => (
              <div className="style edit" key={i}><Input className="key" value={s[0]} size="small" onChange={this.handleChangeKey.bind(this, i)} />: <Input className="value" value={s[1]} size="small" onChange={this.handleChangeValue.bind(this, i)} />;</div>
            ))}
            <div className="opt">
              <Button size="small" onClick={this.handleAddStyle}>+</Button><Button size="small" type="primary" onClick={this.handleSubmit}><FormattedMessage id="elements_style_submit" /></Button>
            </div>
          </div>
        ) : (
          <div onClick={this.handleEdit}>
            {style.map(s => (
              <div className="style" key={s[0]}><span>{s[0]}</span>: {s[1]};</div>
            ))}
          </div>
        )}
        <div onClick={this.handleEdit}>{'}'}</div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(ElementStyle);
