import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';

export default class CalendarContainer extends Component {
  componentDidMount() {
    $('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'week'
			},
      height: 'auto',
      defaultView: 'agendaWeek',
			editable: true,
			droppable: true, // this allows things to be dropped onto the calendar
    });
  }

  render() {
    return <div id="calendar" />;
  }
}
