import React, { Component, PropTypes } from 'react';
import { Switch, TimePicker  } from 'antd';
import moment from 'moment';

import './WeekScheduler.scss';

export class LineWeekScheduler extends Component {

  static propTypes = {
    defaultChecked: PropTypes.bool.isRequired,
    endTime: PropTypes.number,
    lineName: PropTypes.string.isRequired,
    onEndTimeChange: PropTypes.func.isRequired,
    onStartTimeChange: PropTypes.func.isRequired,
    onSwitchDay: PropTypes.func.isRequired,
    startTime: PropTypes.number,
  };

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <tr className='lineWeekScheduler'>
        {/*<th className='colOneWeekScheduler'>
          <Switch defaultChecked={this.props.defaultChecked}
                  onChange={(checked) => this.props.onSwitchDay(checked)}
                  checkedChildren={this.props.lineName}
                  unCheckedChildren={this.props.lineName}/>
        </th>*/}
        <th className='colWeekScheduler'>
          <TimePicker disabled={!this.props.defaultChecked}
                      onChange={(moment) => this.props.onStartTimeChange(moment.valueOf())}
                      value={moment(this.props.startTime).utcOffset(0)}
                      format={'HH:mm'} />
        </th>
        <th className='colWeekScheduler'>
          <TimePicker disabled={!this.props.defaultChecked}
                      onChange={(moment) => this.props.onEndTimeChange(moment.valueOf()+1)}
                      value={moment(this.props.endTime-1).utcOffset(0)}
                      format={'HH:mm'}/>
        </th>
      </tr>
    );
  }
}
