import React, { Component, PropTypes } from 'react';
import { Input, Icon } from 'antd';

export class EditableCell extends Component {

  static propTypes = {
    editMedia: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    media: PropTypes.object.isRequired,
  }

  state = {
    isEditing: false,
    editedValue: ''
  }

  handleChange = (e) => {
    this.setState({ editedValue: e.target.value });
  }

  edit = () => {
    this.setState({
      isEditing: true,
      editedValue: this.props.media[this.props.field]
    });
  }

  onEdit = () => {
    const editedMedia = {
      ...this.props.media,
      [this.props.field]: this.state.editedValue
    };
    this.props.editMedia(editedMedia);
    this.setState({ isEditing: false });
  }

  render() {

    const { isEditing } = this.state;

    return (
      <div className="editable-cell">
        {
          isEditing ?
          <div className="editable-cell-input-wrapper">
            <Input
              value={this.state.editedValue}
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
            {this.props.media[this.props.field]}
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
