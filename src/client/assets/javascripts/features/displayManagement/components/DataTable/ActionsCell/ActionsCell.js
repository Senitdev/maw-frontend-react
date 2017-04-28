import React, { Component, PropTypes } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';

export default class ActionsCell extends Component {

  static propTypes = {
    onCalendar: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onPreview: PropTypes.func,
    onSchedule: PropTypes.func,
    record: PropTypes.object.isRequired,
  };

  render() {
    const { onCalendar,onDelete, onEdit, onPreview, onSchedule, record } = this.props;
    return (
      <div className="maw-actions-cell">
        { onPreview &&
        <Tooltip title="Prévisualiser" placement="bottom" mouseEnterDelay={0.6}>
          <Button icon="eye" onClick={() => onPreview(record)} />
        </Tooltip> }
        { onEdit &&
        <Tooltip title="Modifier" placement="bottom" mouseEnterDelay={0.6}>
          <Button icon="edit" onClick={() => onEdit(record)} />
        </Tooltip> }
        { onSchedule &&
        <Tooltip title="Horraires d'activité" placement="bottom" mouseEnterDelay={0.6}>
          <Button icon="clock-circle-o" onClick={() => onSchedule(record)} />
        </Tooltip> }
        { onCalendar &&
        <Tooltip title="Agenda" placement="bottom" mouseEnterDelay={0.6}>
          <Button icon="calendar" onClick={() => onCalendar(record)} />
        </Tooltip> }
        { onDelete &&
        <Tooltip title="Supprimer" placement="bottom" mouseEnterDelay={0.6}>
          <Popconfirm title="Supprimer ?" onConfirm={() => onDelete(record)} okText="Oui" cancelText="Non">
            <Button icon="delete" loading={record.isDeleting} />
          </Popconfirm>
        </Tooltip> }
      </div>
    );
  }
}
