import React, { Component, PropTypes } from 'react';
import { Input, Icon } from 'antd';

export class EditableCell extends Component {

  static propTypes = {
    field: PropTypes.string,
    file: PropTypes.object,
    onEdit: PropTypes.func,
  }
  state = {
    value: this.props.file[this.props.field],
    editable: false,
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }
  edit = () => {
    this.setState({ editable: true });
  }
  onEdit = () => {
    const editedFile = {
      ...this.props.file,
      [this.props.field]: this.state.value
    };
    this.props.onEdit(editedFile);
    this.setState({ editable: false });
  }
  render() {
    const { editable, value } = this.state;

    return (
      <div className="editable-cell">
        {
          editable ?
          <div className="editable-cell-input-wrapper">
            <Input
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.onEdit}
            />
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.onEdit}
            />
          </div>
          :
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={this.edit}
            />
          </div>
        }
      </div>);
  }
}
