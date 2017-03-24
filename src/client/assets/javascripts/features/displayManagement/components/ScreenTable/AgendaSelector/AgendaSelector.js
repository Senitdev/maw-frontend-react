import React, { Component, PropTypes } from 'react';
import { Select } from 'antd';
const { Option } = Select;

export default class AgendaSelector extends Component {

  static propTypes = {
    agendas: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.number,
  };

  render() {
    let { agendas, ...otherProps } = this.props;
    if (otherProps.value != null) {
      otherProps.value = String(otherProps.value);
    }

    return (
      <Select {...otherProps} dropdownMatchSelectWidth={false}>
        <Option key="-1">- vide -</Option>
        { agendas.map((agenda) => (
        <Option key={String(agenda.id)}>{agenda.name}</Option>
        ))}
      </Select>
    );
  }
}
