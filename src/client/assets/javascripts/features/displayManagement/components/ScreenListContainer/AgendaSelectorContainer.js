import React, { Component, PropTypes } from 'react';
import { Menu, Dropdown, Button, Tooltip } from 'antd';
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

  /**
   *  On monte le composent en allant chercher les informations relatif à l'écran.
   *  ainsi on sait que l'état redux va se mettre à jours, et qu'on y trouvera la relation
   *  entre cet écran et l'agenda qu'il suit actuellement.
   **/
  componentWillMount() {
    const idScreen = Number(this.props.screen.id);
    this.props.actions.fetchMediaDetails(idScreen, 'screen');
  }

  /**
   *  Va piocher dans l'état redux l'agenda actuellement suivit par l'écran.
   **/
  getCurrentAgenda() {
    if (this.props.relationsById[this.props.screen.relationsWithGuests[0]] != undefined) {
      return this.props.mediaById[this.props.relationsById[this.props.screen.relationsWithGuests[0]].guestMediaId];
    } else {
      return {name: '--aucun--'};
    }
  }

  /**
   *  Fait suivre à l'écran l'agenda sur lequel l'utilisateur à cliqué.
   */
  onItemMenuClick = (agenda) => {
    if (agenda.key == -1) {
      if (this.getCurrentAgenda().id != undefined)
        this.props.actions.deleteRelation(this.props.screen.relationsWithGuests[0]);
      return;
    }
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
    //Donne l'ordre de créer la relation, puis refresh les informations de l'écran.
    this.props.actions.attachScreenToAgenda(this.props.screen, relation)
    .then(() => this.props.actions.fetchMediaDetails(this.props.screen.id, 'screen'));
  }

  render() {
    var currentAgenda = this.getCurrentAgenda().name;
    var agendaItems = [];
    for (let i=0; i < this.props.agendas.length; i++) {
      const agenda = this.props.mediaById[this.props.agendas[i]];
      agendaItems.push(<Menu.Item key={agenda.id}>{agenda.name}</Menu.Item>);
    }
    agendaItems.push(<Menu.Item key={-1}>--aucun--</Menu.Item>);
    const agendaMenu = (
      <Menu onClick={this.onItemMenuClick}>
        {agendaItems}
      </Menu>
    );
    return (
      <Dropdown overlay={agendaMenu} trigger={['click']}>
        <Tooltip title={currentAgenda} placement="top" mouseEnterDelay={0.6}>
          <Button className='buttonAgendaSelector' icon='down' loading={this.props.isFetchingDetails}>
            {currentAgenda}
          </Button>
        </Tooltip>
      </Dropdown>
    );
  }
}
