import React, { Component, PropTypes } from 'react';
import { Select } from 'antd';
const { Option } = Select;

export default class AgendaSelector extends Component {

  static propTypes = {
    agendas: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
  };

  render() {
    const agendasRender = Object.keys(this.props.agendas).map((agendaId) => (
              <Option key={String(agendaId)}>{this.props.agendas[agendaId].name}</Option>
            ));

    return (
      <Select value={String(this.props.value)}
              defaultValue='-1'
              dropdownMatchSelectWidth={false}
              onChange={(value) => this.props.onChange(Number(value))}
              showSearch
              optionFilterProp="children"
              style={{width: '150px'}}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
        <Option key="-1">- vide -</Option>
        {agendasRender}
      </Select>
    );
  }
}
