import React, { Component, PropTypes } from 'react';
import { message } from 'antd';

import {LineWeekScheduler} from './LineWeekScheduler';
import './WeekScheduler.scss';

export default class WeekScheduler extends Component {

  static propTypes = {
    getState: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      daysSwitch: {0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false},
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

  onSwitchDay = (idDay, isActive) => {
    this.setState({
      daysSwitch: {
        ...this.state.daysSwitch,
        [idDay]: isActive,
      }
    });
  }

  onStartTimeChange = (idDay, moment) => {
    if (this.state.daysSchedule[idDay].end != null) {
      if (moment >= this.state.daysSchedule[idDay].end) {
        message.error('L\'horaire d\'allumage doit être plus petit que celui d\'extinction');
        return;
      }
    }

    this.setState({
      daysSchedule: {
        ...this.state.daysSchedule,
        [idDay]: {
          ...this.state.daysSchedule[idDay],
          start: moment,
        }
      }
    });
  }

  onEndTimeChange = (idDay, moment) => {
    if (this.state.daysSchedule[idDay].start != null) {
      if (moment <= this.state.daysSchedule[idDay].start) {
        message.error('L\'horaire d\'extinction doit être plus grand que celui d\'allumage');
        return;
      }
    }

    this.setState({
      daysSchedule: {
        ...this.state.daysSchedule,
        [idDay]: {
          ...this.state.daysSchedule[idDay],
          end: moment,
        }
      }
    });
  }

  render() {
    var days = [];
    const daysName = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    for (let i = 0; i < daysName.length; i++) {
      days.push(
        <LineWeekScheduler key={daysName[i]}
                           defaultChecked={this.state.daysSwitch[i]}
                           lineName={daysName[i]}
                           startTimeDefault={this.state.daysSchedule[i].start}
                           endTimeDefault={this.state.daysSchedule[i].end}
                           onEndTimeChange={(moment) => this.onEndTimeChange(i, moment)}
                           onStartTimeChange={(moment) => this.onStartTimeChange(i, moment)}
                           onSwitchDay={(isActive) => this.onSwitchDay(i, isActive)} />
      );
    }
    return (
      <table className='weekScheduler'>
        <tbody>
          <tr className='headerWeekScheduler'>
            <th className='colOneWeekScheduler'>jours</th>
            <th className='colWeekScheduler'>Allumage</th>
            <th className='colWeekScheduler'>Extinction</th>
          </tr>
          {days}
        </tbody>
      </table>
    );
  }
}
