import React, { Component, PropTypes } from 'react';
import { Switch, TimePicker  } from 'antd';

import './WeekScheduler.scss';

export class LineWeekScheduler extends Component {

  static propTypes = {
    defaultChecked: PropTypes.bool.isRequired,
    endTimeDefault: PropTypes.object,
    lineName: PropTypes.string.isRequired,
    onEndTimeChange: PropTypes.func.isRequired,
    onStartTimeChange: PropTypes.func.isRequired,
    onSwitchDay: PropTypes.func.isRequired,
    startTimeDefault: PropTypes.object,
  };

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <tr className='lineWeekScheduler'>
        <th className='colOneWeekScheduler'>
          <Switch defaultChecked={this.props.defaultChecked}
                  onChange={(checked) => this.props.onSwitchDay(checked)}
                  checkedChildren={this.props.lineName}
                  unCheckedChildren={this.props.lineName}/>
        </th>
        <th className='colWeekScheduler'>
          <TimePicker disabled={!this.props.defaultChecked}
                      onChange={(moment) => this.props.onStartTimeChange(moment)}
                      value={this.props.startTimeDefault} />
        </th>
        <th className='colWeekScheduler'>
          <TimePicker disabled={!this.props.defaultChecked}
                      onChange={(moment) => this.props.onEndTimeChange(moment)}
                      value={this.props.endTimeDefault} />
        </th>
      </tr>
    );
  }
}
