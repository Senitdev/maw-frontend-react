import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as displayManagementActions, NAME as displayManagementName } from 'features/displayManagement';
import AgendaSelector from '../AgendaSelector';

function mapStateToProps(state) {
  const { mediaById, relationsById, agenda } = state[displayManagementName];
  const agendas = agenda.items.map((id) => mediaById[id]);

  return {
    agendas,
    mediaById,
    relationsById,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(displayManagementActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AgendaSelectorContainer extends Component {

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
    this.props.actions.fetchMediaDetails(this.props.screen.id, 'screen');
  }

  /**
   *  Va piocher dans l'état redux l'agenda actuellement suivit par l'écran.
   **/
  getCurrentAgendaId() {
    if (this.props.relationsById[this.props.screen.relationsWithGuests[0]] != undefined) {
      return this.props.mediaById[this.props.relationsById[this.props.screen.relationsWithGuests[0]].guestMediaId].id;
    } else {
      return -1;
    }
  }

  /**
   *  Fait suivre à l'écran l'agenda sur lequel l'utilisateur à cliqué.
   */
  onChange = (agendaId) => {
    if (agendaId == -1) {
      if (this.getCurrentAgendaId() != undefined)
        this.props.actions.deleteRelation(this.props.screen.relationsWithGuests[0]);
      return;
    }
    const relation = {
      hostMediaId: this.props.screen.id,
      guestMediaId: parseInt(agendaId),
      boxLeft: 0,
      boxTop: 0,
      boxWidth: 100,
      boxHeight: 100,
      guestLeft: 0,
      guestTop: 0,
      guestWidth: 100,
      guestHeight: 100,
      startTimeOffset: 0,
      zIndex: 0
    };
    //Donne l'ordre de créer la relation, puis refresh les informations de l'écran.
    this.props.actions.attachScreenToAgenda(this.props.screen, relation)
    .then(() => this.props.actions.fetchMediaDetails(this.props.screen.id, 'screen'));
  }

  render() {
    return (
      <AgendaSelector agendas={this.props.agendas} value={this.getCurrentAgendaId()} onChange={this.onChange} />
    );
  }
}
