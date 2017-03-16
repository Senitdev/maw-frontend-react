import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/locale/fr.js';

import { Row, Col, Badge, TimePicker, Input, Button, Icon, InputNumber, Spin } from 'antd';
import moment from 'moment';

import './CalendarContainer.scss';

const format = 'HH:mm';
var defaultDuration = (allDay) => {return allDay ? 86400 : 7200;};

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
        type: 'agenda'
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
          left:   'title',
          center: 'month agendaWeek agendaDay',
          right:  'today prev,next'
        },
        height: 'auto',
        defaultTimedEventDuration: moment.duration(defaultDuration(false), 'seconds'),
        editable: true,
        droppable: true,
        businessHours: {
            dow: [ 1, 2, 3, 4, 5, 6 ],
            start: '7:00',
            end: '20:00',
        },
        minTime: '07:00:00',
        maxTime: '20:00:00',
        eventOverlap: false,
        eventReceive: (event) => {
          this.setState({
            mediaInCalendar: this.state.mediaInCalendar.concat([{
              idFull: event._id,
              id: event.idMedia,
              startTimeOffset: event.start.unix() - 3600,
              duration: defaultDuration(event.allDay),
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
          newMedia[idEventSelected].startTimeOffset = event.start.unix() - 3600;
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

  onChangeHour = (time, dateString, calendarOption) => {
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
          ...m,
          startTimeOffset: m.startTimeOffset * 1000,
          duration: m.duration * 1000,
        })
      );

      this.props.actions.featPatchOrCreateFromEditor(this.mediaDeleted, newMediasWithMS, this.state.calendarEdit)
      .then((mediaId) => {
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
      <div id="calendar-container">
        <Row className="calendar-details">
          <Col span="11">
            <Row>
              <Col span="6">
                Heure de début :
              </Col>
              <Col span="6">
                <TimePicker
                  defaultValue={moment('07:00', format)}
                  format={format}
                  onChange={(moment, timeString) => this.onChangeHour(moment, timeString, 'minTime')} />
              </Col>
              <Col span="12">
                <Input
                  style={{marginRight: '20px'}}
                  value={this.state.calendarEdit.name}
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
            </Row>
            <Row>
              <Col span="6">
                Heure de fin :
              </Col>
              <Col span="6">
                <TimePicker
                  defaultValue={moment('20:00', format)}
                  format={format}
                  onChange={(moment, timeString) => this.onChangeHour(moment, timeString, 'maxTime')} />
              </Col>
              <Col span="12">
                <Button
                  disabled={this.state.calendarEdit.name == ''}
                  onClick={this.submitChange}
                  style={{float: 'right'}}
                  type="primary" size="large">Sauvegarder</Button>
              </Col>
            </Row>
            <Badge status="default" text="Propriétés de l'agenda" />
          </Col>
          <Col span="12" offset="1">
            {this.state.mediaSelected == -1 &&
              <div>Cliquez sur une entrée dans l'agenda pour modifier ces informations.</div>
            }
            {eventSelected &&
            <div>
              <Row>
                <Col span="14">
                  <h3>{this.props.mediaById[eventSelected.id].name}</h3>
                </Col>
                <Col span="10">
                  <Button
                    onClick={() => {
                      this.removeMediaInCalendar(idEventSelected);
                      $('#calendar').fullCalendar('removeEvents', eventSelected.idFull);
                    }}
                    style={{float: 'right'}} type="danger">
                      Supprimer ce média
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span="3">
                  Heures :
                </Col>
                <Col span="6">
                  <InputNumber disabled={eventFull.allDay} size="small" min={0} value={Math.floor((eventSelected.duration) / 3600)}
                    onChange={(val) => {
                      var newDuration = val * 3600 + eventSelected.duration % 3600;
                      eventFull.end = moment.unix(eventFull.start.unix() + newDuration - 3600);
                      $('#calendar').fullCalendar('updateEvent', eventFull);

                      var newMedia = this.state.mediaInCalendar;
                      newMedia[idEventSelected].duration = newDuration;
                      this.setState({
                        mediaInCalendar: newMedia
                      });
                    }}
                  />
                </Col>
                <Col span="3">
                  Minutes :
                </Col>
                <Col span="6">
                  <InputNumber disabled={eventFull.allDay} size="small" min={0} max={59} value={Math.floor((eventSelected.duration) % 3600 / 60)}
                    onChange={(val) => {
                      const newDuration = val * 60 + Math.floor(eventSelected.duration / 3600) * 3600;
                      eventFull.end = moment.unix(eventFull.start.unix() + newDuration - 3600);
                      $('#calendar').fullCalendar('updateEvent', eventFull);

                      var newMedia = this.state.mediaInCalendar;
                      newMedia[idEventSelected].duration = newDuration;
                      this.setState({
                        mediaInCalendar: newMedia
                      });
                    }}
                  />
                </Col>
                <Col span="3">
                  Décalage :
                </Col>
                <Col span="3">
                  {eventSelected.startTimeOffset}
                </Col>
              </Row>
            </div>
            }
            <Badge status="default" text="Planification du média" />
          </Col>
        </Row>
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
      </div>
    );
  }
}
