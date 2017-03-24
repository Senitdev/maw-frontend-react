import React, { Component, PropTypes } from 'react';
import { Icon, Tooltip } from 'antd';

import MediaTable from '../MediaTable';
import AgendaSelectorContainer from './AgendaSelectorContainer';
import ScreenClaimModal from './ScreenClaimModal';

export default class ScreenTable extends Component {

  static propTypes = {
    onAgendaEdit: PropTypes.func,
    onNameEdit: PropTypes.func,
  };

  static maxTimeWithoutPull = 1000 * 60 * 5;

  static ColumnModel = {
    status: {
      title: 'Status',
      key: 'status',
      className: 'screen-status',
      render: (text, screen) => {
        if (Date.now() - screen.lastPull.getTime() > ScreenTable.maxTimeWithoutPull) {
          return (
            <Tooltip title="Écran déconnecté" mouseEnterDelay={0.5}>
              <div className="ant-alert-error"><Icon type="laptop" /></div>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="Écran connecté" mouseEnterDelay={0.5}>
            <div className="ant-alert-success"><Icon type="laptop" /></div>
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
      MediaTable.ColumnModel.id,
      MediaTable.ColumnModel.name(onNameEdit),
      //ScreenTable.ColumnModel.status,
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
