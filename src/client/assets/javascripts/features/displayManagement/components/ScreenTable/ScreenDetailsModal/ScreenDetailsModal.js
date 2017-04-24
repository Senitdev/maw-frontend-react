import React, { Component, PropTypes } from 'react';
import AgendaSelector from '../AgendaSelector';
import WeekScheduler from '../WeekScheduler';

export default class ScreenDetailsModal extends Component {

  static propTypes = {
    agendas: PropTypes.object.isRequired,
    relationsById: PropTypes.object.isRequired,
    screens: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    // Génères les horaires d'ativité et de mise à jours par default.
    // Localement, ces horaires sont des matrice de 7*96 qui contient un object de type event
    // un event = {event: '******', color: '******'}
    let activityDays = [];
    for (let i = 0; i < 7; i += 1) {
      const day = [];
      for (let j = 0; j < 96; j += 1) {
        day.push({event: 'innactif'});
      }
      activityDays.push(day);
    }
    let updateDays = [];
    for (let k = 0; k < 7; k += 1) {
      const day = [];
      for (let l = 0; l < 96; l += 1) {
        day.push({event: 'noUpdate'});
      }
      updateDays.push(day);
    }

    this.state = {
      ids: [-1],
      agendaId: -1,
      activityPlanning: activityDays,
      updatePlanning: updateDays,
    };
  }

  /**
   *  Le composant reçoit une liste de screen. Il doit afficher les informations identique a tout le screen reçu.
   *  Si une informations n'est pas commune, elle est remplaçé par celle par default.
   */
  componentDidUpdate(lastProps) {
    if (!(lastProps.screens === this.props.screens)) {

      let ids = [];

      let agendaId = -1;
      let isAgendaEgalForAllScreens = true;
      if (this.props.screens[0].relationsWithGuests.length > 0)
        agendaId = this.props.relationsById[this.props.screens[0].relationsWithGuests[0]].guestMediaId;

      for (let i = 0; i < this.props.screens.length; i++) {
        ids.push(this.props.screens[i].id);

        if (this.props.screens[i].relationsWithGuests.length > 0) {
          if (this.props.relationsById[this.props.screens[i].relationsWithGuests[0]].guestMediaId !== agendaId) {
            isAgendaEgalForAllScreens = false;
          }
        } else {
          if (agendaId != -1) {
            isAgendaEgalForAllScreens = false;
          }
        }
      }

      if (!isAgendaEgalForAllScreens) {
        agendaId = -1;
      }

      this.setState({
        ids: ids,
        agendaId: agendaId,
        //TODO extraire planning
      });
    }
  }

  /**
   *  Fait suivre à l'écran l'agenda sur lequel l'utilisateur à cliqué.
   */
  onChangeAgenda = (value) => {
    this.setState({
      agendaId: value,
    });
    /*
    if (agendaId == -1) {
      if (this.getCurrentAgendaId() != undefined)
        this.props.actions.deleteRelation(this.props.mediaById[this.props.screenId].relationsWithGuests[0]);
      return;
    }
    const relation = {
      hostMediaId: this.props.screenId,
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
    this.props.actions.attachScreenToAgenda(this.props.mediaById[this.props.screenId], relation)
    .then(() => this.props.actions.fetchMediaDetails(this.props.mediaById[this.props.screenId], 'screen'));
    */
  }

  onActivitySchedulingChange = (scheduling) => {
    console.log(scheduling);
  }

  render() {
    return (
      <div>
        <div>
          <b>Agenda:</b> <AgendaSelector agendas={this.props.agendas} value={this.state.agendaId} onChange={this.onChangeAgenda} />
        </div>
        <br/>
        <WeekScheduler onActivitySchedulingChange={this.onActivitySchedulingChange} />
      </div>
    );
  }
}
/*
<div style={{width: '50%', display: 'inline-block'}}>
  <b>heures d'activités:</b>
  <WeeklyScheduler defaultEvent={{event: 'actif', color: 'green'}}
                   selectedEvent={{event: 'actif', color: 'green'}}
                   events={[{event: 'actif', color: 'green'}, {event: 'innactif'}]}
                   currentSchedule={this.state.activityPlanning}
                   ref={(activityPlanning) => { this.activityPlanning = activityPlanning; }} />
</div>
<div style={{width: '50%', display: 'inline-block', right: 0}}>
  <b>heures de mise à jours:</b>
  <WeeklyScheduler defaultEvent={{event: 'update', color: 'green'}}
                   selectedEvent={{event: 'update', color: 'green'}}
                   events={[{event: 'update', color: 'green'}, {event: 'noUpdate'}]}
                   currentSchedule={this.state.updatePlanning}
                   ref={(updatePlanning) => { this.updatePlanning = updatePlanning; }} />
</div>
*/
