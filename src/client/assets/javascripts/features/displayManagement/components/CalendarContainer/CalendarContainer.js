import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/locale/fr.js';

import { Row, Col, Badge, TimePicker, Input, Button, Icon, Spin } from 'antd';
import moment from 'moment';
import Datetime from 'react-datetime';

import './CalendarContainer.scss';

const format = 'HH:mm';
var defaultDuration = (allDay) => {allDay ? 86400 : 7200;};

@connect((state) => {
  const { mediaById, file, scene, agenda, relationsById, isFetchingDetails } = state[displayManagementName];

  const mediaByType = { file, scene, agenda };

  return {
    mediaByType,
    mediaById,
    relationsById,
    isFetchingDetails: isFetchingDetails != undefined ? isFetchingDetails : true
  };

}, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class CalendarContainer extends Component {

  // ask for `router` from context
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    idAgenda: PropTypes.string.isRequired,
    isFetchingDetails: PropTypes.bool.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaByType: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mediaInCalendar: [],
      mediaSelected: -1,
      isFetching: true,
      calendarEdit: {
        id: -1,
        name: '',
        ratioNumerator: 16,
        ratioDenominator: 9,
        type: 'agenda',
        duration: 0
      }
    };
  }

  componentWillMount() {
    const idCalendar = Number(this.props.idAgenda);
    this.setState({
      calendarEdit: {
        ...this.state.calendarEdit,
        id: !isNaN(idCalendar) ? idCalendar : -1
      }
    });

    this.props.actions.fetchMediaList('file');
    this.props.actions.fetchMediaList('scene');
    if (idCalendar >= 0)
      this.props.actions.fetchMediaDetails(idCalendar);
    else
      this.setState({
        isFetching: false
      });
  }

  componentDidMount() {
    var thisReact = this;
    $(document).ready(() => {
      $('#calendar').fullCalendar({
        locale: 'fr',
        header: {
          left:   '',
          center: 'month agendaWeek agendaDay',
          right:  'today prev title next'
        },
        height: 'auto',
        defaultTimedEventDuration: moment.duration(defaultDuration(false), 'seconds'),
        allDaySlot: false,
        editable: true,
        droppable: true,
        timezone: 'UTC',
        businessHours: {
            dow: [ 1, 2, 3, 4, 5, 6 ],
            start: '7:00',
            end: '20:00',
        },
        minTime: '07:00:00',
        maxTime: '20:00:00',
        eventOverlap: false,
        eventReceive: (event) => {
          if (event.allDay) {
            event.allDay = false;
            var minTime = $('#calendar').fullCalendar('option', 'minTime');
            var maxTime = $('#calendar').fullCalendar('option', 'maxTime');
            const start = event.start.unix();
            event.start = moment.unix(event.start.unix()).add(moment.duration(minTime));
            $('#calendar').fullCalendar('updateEvent', event);
            event.end = moment.unix(start).add(moment.duration(maxTime));
            $('#calendar').fullCalendar('updateEvent', event);

          }
          this.setState({
            mediaInCalendar: this.state.mediaInCalendar.concat([{
              idFull: event._id,
              id: event.idMedia,
              startTimeOffset: event.start.unix(),
              //duration: defaultDuration(event.allDay),
              duration: event.end == null ? defaultDuration(event.allDay) : event.end.unix() - event.start.unix(),
              idRelation: -1,
            }]),
            mediaSelected: event._id,
          }, () => $('#calendar').fullCalendar('rerenderEvents'));
        },
        eventClick: function(event) {
          if (thisReact.state.mediaSelected != event._id) {
            thisReact.setState({
              mediaSelected: event._id,
            }, () => $('#calendar').fullCalendar('rerenderEvents'));
          }
        },
        eventRender: function(event, element) {
          if (event._id == thisReact.state.mediaSelected)
            element.addClass('selected');
        },
        eventResize: function(event) {
          const idEventSelected = thisReact.getIndexByIdFull(event._id);

          var newMedia = thisReact.state.mediaInCalendar;
          newMedia[idEventSelected].duration = event.end.unix() - event.start.unix();

          thisReact.setState({
            mediaInCalendar: newMedia
          });
        },
        eventDrop: function(event) {
          const idEventSelected = thisReact.getIndexByIdFull(event._id);

          var newMedia = thisReact.state.mediaInCalendar;
          newMedia[idEventSelected].startTimeOffset = event.start.unix();
          newMedia[idEventSelected].duration = event.end == null ? defaultDuration(event.allDay) : event.end.unix() - event.start.unix();

          thisReact.setState({
            mediaInCalendar: newMedia
          });
        },
        eventAfterRender: (event) => {
          if (event.idRelation) {
            var id = this.state.mediaInCalendar.findIndex((e) => e.idRelation === event.idRelation);
            if (this.state.mediaInCalendar[id] && !this.state.mediaInCalendar[id].idFull) {
              var newMediaInCalendar = this.state.mediaInCalendar;
              newMediaInCalendar[id].idFull = event._id;
              this.setState({
                ...this.state.mediaInCalendar,
                [id]: {
                  ...this.state.mediaInCalendar[id],
                  idFull: event._id
                }
              });
            }
          }
        },
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mediaById) {
      if (nextProps.mediaById[this.state.calendarEdit.id]) {
        this.setState({
          calendarEdit: {
            ...this.state.calendarEdit,
            name: nextProps.mediaById[this.state.calendarEdit.id].name
          }
        });
      }
    }
    if (!nextProps.isFetchingDetails && this.state.isFetching) {
      var mediaInCalendar = [];
      var eventsTemp = [];
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        if (relation.hostMediaId == this.state.calendarEdit.id) {
          const start = moment.unix(relation.startTimeOffset / 1000);
          const end = moment.unix((relation.startTimeOffset + relation.duration) / 1000);
          const allDay = (relation.duration % defaultDuration(true) == 0 && start.format(format) === '00:00');
          eventsTemp.push({
            title: nextProps.mediaById[relation.guestMediaId].name,
            start: start,
            end: end,
            idMedia: relation.guestMediaId,
            startTimeOffset: relation.startTimeOffset / 1000,
            duration: relation.duration / 1000,
            idRelation: relation.id,
            allDay: allDay,
          });
          mediaInCalendar.push({
              idFull: null,
              id: relation.guestMediaId,
              startTimeOffset: relation.startTimeOffset / 1000,
              duration: relation.duration / 1000,
              idRelation: relation.id,
          });
        }
      }
      this.setState({
        isFetching: false,
        mediaInCalendar: mediaInCalendar
      }, () => {
        for (var i = 0; i < eventsTemp.length; i++) {
          const eventTemp = eventsTemp[i];
          $('#calendar').fullCalendar('renderEvent', eventTemp, true);
        }
      });
    }
  }

  mediaDeleted = [];

  onChangeHour = (time, calendarOption) => {
    if (time) {
      var newTime = "24:00";
      if (time.hours() < 23) {
        newTime = time.hours() + ":";
        if (time.minutes() < 30)
          newTime = newTime + "00";
        else
          newTime = newTime + "30";
      }
      $('#calendar').fullCalendar('option', calendarOption, newTime);
    }
  }

  removeMediaInCalendar = (id) => {
    // Liste des relations supprimées
    if (this.state.mediaInCalendar[id].idRelation >= 0)
      this.mediaDeleted.push(this.state.mediaInCalendar[id].idRelation);

    var newMediaInCalendar = this.state.mediaInCalendar;
    newMediaInCalendar.splice(id, 1);

    this.setState({
      mediaInCalendar: newMediaInCalendar,
      mediaSelected: -1
    });
  }

  getIndexByIdFull = (idFull) => this.state.mediaInCalendar.findIndex((e) => e.idFull === idFull);

  submitChange = () => {
    const idCalendar = Number(this.props.idAgenda);
    this.setState({
      calendarEdit: {
        ...this.state.calendarEdit,
        id: !isNaN(idCalendar) ? idCalendar : -1
      }
    }, () => {

      var newMediasWithMS = this.state.mediaInCalendar.slice();
      newMediasWithMS = newMediasWithMS.map((m) =>
        ({
          id: m.id,
          idRelation: m.idRelation,
          startTimeOffset: (m.startTimeOffset) * 1000,
          duration: (m.duration) * 1000,
        })
      );

      this.props.actions.featPatchOrCreateFromEditor(this.mediaDeleted, newMediasWithMS, this.state.calendarEdit)
      .then(() => {
        this.context.router.push('/display-management/agenda/');
      });
    });
  }
  render() {
    const idEventSelected = this.getIndexByIdFull(this.state.mediaSelected);
    const eventSelected = this.state.mediaInCalendar[idEventSelected];

    if (idEventSelected >= 0)
      var eventFull = $('#calendar').fullCalendar('clientEvents', eventSelected.idFull)[0];
    return (
      <Row className="calendar-container">
        <Col span='19'>
          <Row>
            <Row>
              <Col span="6" offset="1">
                <span>Heure de début: </span>
                <TimePicker
                  defaultValue={moment('07:00', format)}
                  format={format}
                  onChange={(moment) => this.onChangeHour(moment, 'minTime')} />
              </Col>
              <Col span="4">
                <span>Heure de fin: </span>
                <TimePicker
                  defaultValue={moment('20:00', format)}
                  format={format}
                  onChange={(m) => {
                    var minTime = $('#calendar').fullCalendar('option', 'minTime');
                    this.onChangeHour(moment(minTime, 'HH:mm:ss').isBefore(m) ? m : moment.duration(minTime).add(1, 'H'), 'maxTime');
                  }} />
              </Col>
              <Col span="9">
                <Input
                  style={{marginRight: '20px'}}
                  value={this.state.calendarEdit.name}
                  onPressEnter={this.submitChange}
                  onChange={(e) => {
                    this.setState({
                      calendarEdit: {
                        ...this.state.calendarEdit,
                        name: e.target.value
                      }
                    });
                  }}
                  placeholder="Indiquez un nom d'agenda" />
              </Col>
              <Col span="4">
                <Button
                  disabled={this.state.calendarEdit.name == ''}
                  onClick={this.submitChange}
                  style={{float: 'right'}}
                  type="primary" size="large">Sauvegarder</Button>
              </Col>
            </Row>
          </Row>
          <Row>
            {this.state.mediaInCalendar.length == 0 &&
              <div id="drop-empty-calendar">
                <span>
                  <Icon type="arrow-down" />
                </span>
                <br />
                <span>
                  Déplacez des médias dans l'agenda !
                </span>
                <br />
                <Spin style={{margin: '5px'}} spinning={this.state.isFetching} />
              </div>
            }
            <div id="calendar" />
          </Row>
        </Col>

        <Col span="4" offset="1" className="calendar-details">
          {this.state.mediaSelected == -1 &&
            <div>Cliquez sur une entrée dans l'agenda pour modifier ces informations.</div>
          }
          {eventSelected &&
          <div>
            <Row>
              <h3>{this.props.mediaById[eventSelected.id].name}</h3>
            </Row>
            <Row>
              Début: <Datetime utc value={moment((eventSelected.startTimeOffset) * 1000)} onChange={(val) => {

                        eventFull.start = val;
                        eventFull.allDay = false;

                        $('#calendar').fullCalendar('updateEvent', eventFull);

                        var newMedia = this.state.mediaInCalendar.slice();
                        newMedia[idEventSelected].startTimeOffset = (val.unix());
                        this.setState({
                          mediaInCalendar: newMedia
                        });
                      }} />
            </Row>
            <Row>
              Fin: <Datetime utc value={moment((eventSelected.startTimeOffset + eventSelected.duration) * 1000)} onChange={(val) => {

                        eventFull.end = val;
                        eventFull.allDay = false;
                        $('#calendar').fullCalendar('updateEvent', eventFull);

                        var newMedia = this.state.mediaInCalendar.slice();
                        newMedia[idEventSelected].duration = val.unix() - newMedia[idEventSelected].startTimeOffset;
                        this.setState({
                          mediaInCalendar: newMedia
                        });
                      }} />
            </Row>
            <Row>
              <Button
                onClick={() => {
                  this.removeMediaInCalendar(idEventSelected);
                  $('#calendar').fullCalendar('removeEvents', eventSelected.idFull);
                }}
                type="danger">
                  Supprimer ce média
              </Button>
            </Row>
            <Badge status="default" text="Planification du média" />
          </div>
          }
        </Col>
      </Row>
    );
  }
}
