import React, { Component, PropTypes } from 'react';
import { Tooltip, Button } from 'antd';

import MediaTable from '../MediaTable';
import AgendaSelectorContainer from './AgendaSelectorContainer';
import ScreenClaimModal from './ScreenClaimModal';

import './ScreenTable.scss';

export default class ScreenTable extends Component {

  static propTypes = {
    onAgendaEdit: PropTypes.func,
    onNameEdit: PropTypes.func,
  };

  static dangerTimeWithoutPull = 1000 * 60 * 15; // 15 min
  static warningTimeWithoutPull = 1000 * 60 * 5; // 5 min

  static ColumnModel = {
    status: {
      title: 'Status',
      key: 'status',
      className: 'screen-status',
      render: (text, screen) => {
        if (screen.lastPull) {
        if (Date.now() - screen.lastPull.getTime() > ScreenTable.dangerTimeWithoutPull) {
          return (
            <Tooltip title="Écran déconnecté" mouseEnterDelay={0.5}>
              <Button type="danger" icon="desktop" size="small" />
            </Tooltip>
          );
        }
        if (Date.now() - screen.lastPull.getTime() > ScreenTable.warningTimeWithoutPull) {
          return (
            <Tooltip title="Écran potentiellement déconnecté" mouseEnterDelay={0.5}>
              <Button className="warning" icon="desktop" size="small" />
            </Tooltip>
          );
        }
        }
        return (
          <Tooltip title="Écran connecté" mouseEnterDelay={0.5}>
            <Button className="connected" icon="desktop" size="small" />
          </Tooltip>
        );
      }
    },
    agenda: {
      title: 'Agenda',
      key: 'agenda',
      render: (text, screen) => <AgendaSelectorContainer screen={screen} />
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      claimModalVisible: false,
    };
  }

  openClaimModal = () => {
    this.setState({
      claimModalVisible: true
    });
  }

  closeClaimModal = () => {
    this.setState({
      claimModalVisible: false
    });
  }

  render() {
    const { onNameEdit } = this.props;
    const columns = [
      MediaTable.ColumnModel.name(onNameEdit),
      ScreenTable.ColumnModel.status,
      ScreenTable.ColumnModel.agenda,
      MediaTable.ColumnModel.ratio,
      MediaTable.ColumnModel.createdAt,
      MediaTable.ColumnModel.updatedAt,
    ];

    return (
      <div>
        <MediaTable title="Écrans" columns={columns} onAdd={this.openClaimModal} {...this.props} />
        <ScreenClaimModal
          visible={this.state.claimModalVisible}
          onCancel={this.closeClaimModal}
          onClaimSuccess={this.closeClaimModal} />
      </div>
    );
  }
}
