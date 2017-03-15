import React, { Component, PropTypes } from 'react';
import { Menu, Dropdown, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';
import './ScreenListContainer.scss';

@connect((state) => {
  const { mediaById, relationsById, agenda, isFetchingDetails } = state[displayManagementName];
  const agendas = agenda.items;

  return {
    agendas,
    mediaById,
    relationsById,
    isFetchingDetails,
  };

}, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export class AgendaSelectorContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    agendas: PropTypes.array.isRequired,
    isFetchingDetails: PropTypes.bool,
    mediaById: PropTypes.object.isRequired,
    relationsById: PropTypes.object.isRequired,
    screen: PropTypes.object.isRequired,
  };


  componentWillMount() {
    const idScreen = Number(this.props.screen.id);
    this.props.actions.fetchMediaDetails(idScreen, 'screen');
  }

  getCurrentAgenda() {
    if (this.props.relationsById[this.props.screen.relationsWithGuests[0]] != undefined) {
      return this.props.mediaById[this.props.relationsById[this.props.screen.relationsWithGuests[0]].guestMediaId];
    } else {
      return {name: 'no-set'};
    }
  }

  onItemMenuClick = (agenda) => {
    const relation = {
      hostMediaId: this.props.screen.id,
      guestMediaId: parseInt(agenda.key),
      boxLeft: 0,
      boxTop: 0,
      boxWidth: 100,
      boxHeight: 100,
      guestLeft: 0,
      guestTop: 0,
      guestWidth: 100,
      guestHeight: 100,
      startTimeOffset: 0
    };
    this.props.actions.attachScreenToAgenda(this.props.screen, relation)
    .then(() => this.props.actions.fetchMediaDetails(this.props.screen.id, 'screen'));
  }

  render() {
    var agendaItems = [];
    for (let i=0; i < this.props.agendas.length; i++) {
      const agenda = this.props.mediaById[this.props.agendas[i]];
      agendaItems.push(<Menu.Item key={agenda.id}>{agenda.name}</Menu.Item>);
    }
    const agendaMenu = (
      <Menu onClick={this.onItemMenuClick}>
        {agendaItems}
      </Menu>
    );
    return (
      <Dropdown overlay={agendaMenu} trigger={['click']}>
        <Button style={{ width: '140px' }} loading={this.props.isFetchingDetails}>
          {this.getCurrentAgenda().name}<Icon type="down" style={{ float: 'right' }} />
        </Button>
      </Dropdown>
    );
  }
}
