import React, { Component } from 'react';
import classnames from 'classnames';
import { Input, Icon, Checkbox } from '../../../lib/antd';
import defComputedStyle from '../../utils/defComputedStyle.json';

import './computedStyle.scss';

export default class ComputedStyle extends Component {
  state = {
    filter: '',
    showall: false,
  }
  processData() {
    let data = this.props.data;
    if (!data) return [];
    if (this.state.showall) {
      data = {
        ...defComputedStyle,
        ...data,
      };
    }
    let dataNames = Object.keys(data);
    if (this.state.filter.length > 0) {
      dataNames = dataNames.filter(n => n.startsWith(this.state.filter));
    }
    dataNames.sort();
    data = dataNames.map(name => ({
      name,
      value: data[name],
      isDefault: data[name] === defComputedStyle[name],
    }));

    return data;
  }
  render() {
    const data = this.processData();
    return (
      <div className="computed-styles">
        <div>
          <Input
            className="filter-input"
            placeholder="Filter"
            prefix={<Icon type="filter" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={this.state.filter}
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <Checkbox
            className="showall-check"
            checked={this.state.showall}
            onChange={e => this.setState({ showall: e.target.checked })}
          >Show All</Checkbox>
        </div>
        <div className="rows">
          {data.map(row => (
            <div key={row.name} className={classnames('row', { default: row.isDefault })}>
              <div className="name">{row.name}</div>
              <div className="value">{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

