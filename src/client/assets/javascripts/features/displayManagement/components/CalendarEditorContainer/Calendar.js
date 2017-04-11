import React, { Component, PropTypes } from 'react';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/locale/fr.js';

import { Icon } from 'antd';
import moment from 'moment';

const format = 'HH:mm';

export default class Calendar extends Component {

  // ask for `router` from context
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    defaultDuration: PropTypes.func.isRequired,
    eventAfterRender: PropTypes.func.isRequired,
    eventClick: PropTypes.func.isRequired,
    eventDrop: PropTypes.func.isRequired,
    eventReceive: PropTypes.func.isRequired,
    eventResize: PropTypes.func.isRequired,
    maxTime: PropTypes.string.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaInCalendar: PropTypes.array.isRequired,
    mediaSelected: PropTypes.string.isRequired,
    minTime: PropTypes.string.isRequired,
  };

  componentDidMount() {
    $(document).ready(() => {
      $('#calendar').fullCalendar({
        locale: 'fr',
        header: {
          left:   '',
          center: 'month agendaWeek agendaDay',
          right:  'today prev title next'
        },
        height: 'auto',
        defaultTimedEventDuration: moment.duration(this.props.defaultDuration(false), 'seconds'),
        allDaySlot: false,
        editable: true,
        droppable: true,
        timezone: 'UTC',
        businessHours: {
            dow: [ 1, 2, 3, 4, 5, 6 ],
            start: '7:00',
            end: '20:00',
        },
        minTime: this.props.minTime,
        maxTime: this.props.maxTime,
        eventOverlap: false,
        eventReceive: (event) => {
          if (event.allDay) {
            event.allDay = false;
            const start = event.start.unix();
            event.start = moment.unix(start).add(moment.duration(this.props.minTime));
            $('#calendar').fullCalendar('updateEvent', event);

            event.end = moment.unix(start).add(moment.duration(this.props.maxTime));
            $('#calendar').fullCalendar('updateEvent', event);
          }
          this.props.eventReceive(event);
        },
        eventClick: (event) => {
          this.props.eventClick(event._id);
        },
        eventRender: (event, element) => {
          if (event._id == this.props.mediaSelected)
            element.addClass('selected');
          if (event.editable == false)
            element.addClass('reccuring');
        },
        eventResize: (event) => {
          this.props.eventResize(event._id, event.end.unix() - event.start.unix());
        },
        eventDrop: (event) => {
          this.props.eventDrop(event._id, event.start.unix(), event.end == null ? this.props.defaultDuration(event.allDay) : event.end.unix() - event.start.unix());
        },
        eventAfterRender: this.props.eventAfterRender,
        viewRender: () => this.updateView(this.props),
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.maxTime != nextProps.maxTime)
      $('#calendar').fullCalendar('option', 'maxTime', nextProps.maxTime);
    if (this.props.minTime != nextProps.minTime)
      $('#calendar').fullCalendar('option', 'minTime', nextProps.minTime);
  }

  componentDidUpdate() {
    this.updateView(this.props);
  }

  updateView = (p) => {
    // Je récupère tous les events déjà présent pour le mettre à jour => updateEvents
    // S'il y a des nouveaux events, je dois les créer => renderEvents
    var eventsTemp = $('#calendar').fullCalendar('clientEvents', (e) => typeof e.editable === "undefined" || e.editable == true); // On sélectionne que ceux éditable (ceux de basses, pas ceux créer pour la répétition)
    var eventsRemoveTemp = eventsTemp.map((e) => e._id);
    var eventsRenderTemp = [];
    var eventsRenderReccuringTemp = [];

    var view = $('#calendar').fullCalendar('getView');
    var viewStart;
    var viewEnd;
    if (view.start) {
      viewStart = view.start.unix();
      viewEnd = view.end.unix();
    }

    for (var i = 0; i < p.mediaInCalendar.length; i++) {
      const media = p.mediaInCalendar[i];
      var added = false;

      var start = moment.unix(media.startTimeOffset);
      var end = moment.unix(media.startTimeOffset + media.duration);
      var allDay = (media.duration % this.props.defaultDuration(true) == 0 && start.format(format) === '00:00');

      // If Reccuring
      if (view.start && media.repetitionDelay > 0) {
        const s = viewStart >= media.startTimeOffset ? viewStart - (viewStart - media.startTimeOffset) % media.repetitionDelay : media.startTimeOffset + media.repetitionDelay;
        const e = media.endTimeOffset > 0 && media.endTimeOffset < viewEnd ? media.endTimeOffset : viewEnd;

        for (var startTimeOffsetReccuring = s; startTimeOffsetReccuring < e; startTimeOffsetReccuring += media.repetitionDelay) {
          eventsRenderReccuringTemp.push({
            id: media.idFull,
            editable: false,
            title: p.mediaById[media.id].name,
            start: moment.unix(startTimeOffsetReccuring),
            end: moment.unix(startTimeOffsetReccuring + media.duration),
            allDay: allDay,
            idRelation: media.idRelation
          });
        }
      }

      for (var j = 0; j < eventsTemp.length; j++) {
        if (eventsTemp[j]._id == media.idFull) {
          eventsTemp[j].title = p.mediaById[media.id].name;
          eventsTemp[j].start = start;
          eventsTemp[j].end = end;
          eventsTemp[j].allDay = allDay;
          added = true;

          // On supprimer dans ce tableau l'id pour ainsi supprimer les autres non ajoutés
          var id = eventsRemoveTemp.indexOf(eventsTemp[j]._id);
          if (id > -1)
            eventsRemoveTemp.splice(id, 1);
        }
      }

      if (!added) {
        eventsRenderTemp.push({
          title: p.mediaById[media.id].name,
          start: start,
          end: end,
          allDay: allDay,
          idRelation: media.idRelation,
        });
      }
    }

    $('#calendar').fullCalendar('renderEvents', eventsRenderTemp, true);
    $('#calendar').fullCalendar('updateEvents', eventsTemp);
    $('#calendar').fullCalendar('removeEvents', (e) => eventsRemoveTemp.indexOf(e._id) > -1);
    $('#calendar').fullCalendar('removeEvents', (e) => e.editable == false);
    $('#calendar').fullCalendar('renderEvents', eventsRenderReccuringTemp, true);
  }

  render() {
    return (
      <div>
        {this.props.mediaInCalendar.length == 0 &&
          <div id="drop-empty-calendar">
            <span>
              <Icon type="arrow-down" />
            </span>
            <br />
            <span>
              Déplacez des médias dans l'agenda !
            </span>
          </div>
        }
        <div id="calendar" />
      </div>
    );
  }
}
