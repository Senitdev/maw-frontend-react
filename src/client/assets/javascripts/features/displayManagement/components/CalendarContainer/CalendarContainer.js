import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/locale/fr.js';

import { Affix, Row, Col, Badge, TimePicker } from 'antd';
import moment from 'moment';

import './CalendarContainer.scss';

export default class CalendarContainer extends Component {
  componentDidMount() {
    $('#calendar').fullCalendar({
      locale: 'fr',
			header: {
				left: '',
				center: '',
				right: ''
			},
      height: 'auto',
      defaultView: 'agendaWeek',
			editable: true,
			droppable: true,
      businessHours: {
          dow: [ 1, 2, 3, 4, 5, 6 ],
          start: '7:00',
          end: '20:00',
      },
      minTime: '07:00:00',
      maxTime: '20:00:00'
    });

    // Suppression des numéros des jours (affichage seulement de lun., etc)
    $('#calendar').find('.fc-head').find('.fc-day-header').find('span').each(function() {
      $(this).html($(this).html().substring(0, 4));
    });
    $('#calendar').find('.fc-header-toolbar').remove();

  }

  onChangeHour = (time, dateString, calendarOption) => {
    var newTime = time.hours() + ":";
    if (time.minutes() < 30)
      newTime = newTime + "00";
    else
      newTime = newTime + "30";
    $('#calendar').fullCalendar('option', calendarOption, newTime);
    $('#calendar').find('.fc-header-toolbar').remove();
  }

  render() {
    const format = 'HH:mm';

    return (
      <div id="calendar-container">
        <Row className="calendar-details">
          <Col span="11">
            <Row>
              <Col span="6">
                Heure de début :
              </Col>
              <Col span="18">
                <TimePicker
                  defaultValue={moment('07:00', format)}
                  format={format}
                  onChange={(moment, timeString) => this.onChangeHour(moment, timeString, 'minTime')} />
              </Col>
            </Row>
            <Row>
              <Col span="6">
                Heure de fin :
              </Col>
              <Col span="18">
                <TimePicker
                  defaultValue={moment('20:00', format)}
                  format={format}
                  onChange={(moment, timeString) => this.onChangeHour(moment, timeString, 'maxTime')} />
              </Col>
            </Row>
            <Affix className="calendar-details-affix" target={() => this.container} offsetBottom={0}>
              <Badge status="default" text="Propriétés de l'agenda" />
            </Affix>
          </Col>
          <Col span="11" offset="2">
            <Affix className="calendar-details-affix" target={() => this.container} offsetBottom={0}>
              <Badge status="default" text="Planification du média" />
            </Affix>
          </Col>
        </Row>
        <div id="calendar" />
      </div>
    );
  }
}
