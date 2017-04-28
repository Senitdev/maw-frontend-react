import React, { Component, PropTypes } from 'react';
import { message } from 'antd';

import {LineWeekScheduler} from './LineWeekScheduler';
import './WeekScheduler.scss';

export default class WeekScheduler extends Component {

  static propTypes = {
    endTime: PropTypes.number,
    onChange: PropTypes.func,
    startTime: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      daysSwitch: {0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false}, //False pour désactiver par deffaut le jours concerné.
      daysSchedule: {
        0: {start: null, end: null},
        1: {start: null, end: null},
        2: {start: null, end: null},
        3: {start: null, end: null},
        4: {start: null, end: null},
        5: {start: null, end: null},
        6: {start: null, end: null},
      }
    };
  }

  componentDidMount() {
    //TODO adapté pour la semaine, actuellement n'est effectif que pour un jour.
    this.setState({
      daysSchedule: {
        0: {start: this.props.startTime, end: this.props.endTime}
      }
    });
  }

  onSwitchDay = (idDay, isActive) => {
    this.setState({
      daysSwitch: {
        ...this.state.daysSwitch,
        [idDay]: isActive,
      }
    });
  }

  onStartTimeChange = (idDay, time) => {
    if (this.state.daysSchedule[idDay].end != null) {
      if (time >= this.state.daysSchedule[idDay].end) {
        message.error('L\'horaire d\'allumage doit être plus petit que celui d\'extinction');
        return;
      }
    }

    const daysSchedule = {
      ...this.state.daysSchedule,
      [idDay]: {
        ...this.state.daysSchedule[idDay],
        start: time,
      }
    };

    this.setState({
      daysSchedule: daysSchedule,
    });

    this.props.onChange(daysSchedule);
  }

  onEndTimeChange = (idDay, time) => {
    if (this.state.daysSchedule[idDay].start != null) {
      if (time <= this.state.daysSchedule[idDay].start) {
        message.error('L\'horaire d\'extinction doit être plus grand que celui d\'allumage');
        return;
      }
    }

    const daysSchedule = {
      ...this.state.daysSchedule,
      [idDay]: {
        ...this.state.daysSchedule[idDay],
        end: time,
      }
    };

    this.setState({
      daysSchedule: daysSchedule
    });
    this.props.onChange(daysSchedule);
  }

  render() {
    var days = [];
    const daysName = ['sauvegarder']; //ici, on peut entrée les jours de la semaine pour avoirs un champ pour chaque jours.
    for (let i = 0; i < daysName.length; i++) {
      days.push(
        <LineWeekScheduler key={daysName[i]}
                           defaultChecked={this.state.daysSwitch[i]}
                           lineName={daysName[i]}
                           startTime={this.state.daysSchedule[i].start}
                           endTime={this.state.daysSchedule[i].end}
                           onEndTimeChange={(time) => this.onEndTimeChange(i, time)}
                           onStartTimeChange={(time) => this.onStartTimeChange(i, time)}
                           onSwitchDay={(isActive) => this.onSwitchDay(i, isActive)} />
      );
    }
    return (
      <table className='weekScheduler'>
        <tbody>
          <tr className='headerWeekScheduler'>
            {/*<th className='colOneWeekScheduler'></th>*/}
            <th className='colWeekScheduler'>Heure de mise en route</th>
            <th className='colWeekScheduler'>Heure d'extinction</th>
          </tr>
          {days}
        </tbody>
      </table>
    );
  }
}
