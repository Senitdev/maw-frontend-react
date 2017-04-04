import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/locale/fr.js';

import { Row, Col, TimePicker, Input, Button, Layout } from 'antd';
import moment from 'moment';
import Datetime from 'react-datetime';

import MediaListContainer from '../MediaListContainer';
import Calendar from './Calendar';

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
export default class CalendarEditorContainer extends Component {

  // ask for `router` from context
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    isFetchingDetails: PropTypes.bool.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaByType: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mediaInCalendar: [],
      mediaSelected: "-1",
      isFetching: true,
      calendarEdit: {
        id: -1,
        name: '',
        type: 'agenda',
        duration: 0,
        ratioNumerator: 16,
        ratioDenominator: 9,
      },
      minTime: "07:00:00",
      maxTime: "20:00:00",
    };
  }

  componentWillMount() {
    const idCalendar = Number(this.props.params.idAgenda);
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
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        if (relation.hostMediaId == this.state.calendarEdit.id) {
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
      this.setState({
        [calendarOption]: newTime,
      });
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
      mediaSelected: "-1"
    });
  }

  getIndexByIdFull = (idFull) => this.state.mediaInCalendar.findIndex((e) => e.idFull === idFull);

  submitChange = () => {
    const idCalendar = Number(this.props.params.idAgenda);
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

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider width="auto"><MediaListContainer /></Layout.Sider>
        <Layout.Content>

          <Calendar
            defaultDuration={defaultDuration}
            mediaInCalendar={this.state.mediaInCalendar}
            mediaSelected={this.state.mediaSelected}
            mediaById={this.props.mediaById}
            minTime={this.state.minTime}
            maxTime={this.state.maxTime}
            eventReceive={(event) => {
              this.setState({
                mediaInCalendar: this.state.mediaInCalendar.concat([{
                  idFull: event._id,
                  id: event.idMedia,
                  startTimeOffset: event.start.unix(),
                  duration: event.end == null ? defaultDuration(event.allDay) : event.end.unix() - event.start.unix(),
                  idRelation: -1,
                }]),
                mediaSelected: event._id,
              });
            }}
            eventClick={(eventId) => {
              if (this.state.mediaSelected != eventId)
                this.setState({
                  mediaSelected: eventId,
                });
            }}
            eventResize={(idEvent, duration) => {
              const id = this.getIndexByIdFull(idEvent);

              var newMedia = this.state.mediaInCalendar.slice();
              newMedia[id].duration = duration;

              this.setState({
                mediaInCalendar: newMedia
              });
            }}
            eventDrop={(idEvent, startTimeOffset, duration) => {
              const id = this.getIndexByIdFull(idEvent);

              var newMedia = this.state.mediaInCalendar.slice();
              newMedia[id].startTimeOffset = startTimeOffset;
              newMedia[id].duration = duration;

              this.setState({
                mediaInCalendar: newMedia
              });
            }}
            eventAfterRender={(event) => {
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
            }}
          />
      </Layout.Content>
      <Layout.Sider width={250} id="calendar-container">
        <div>
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
            <br />
          <Button
            style={{padding: '5px', display: 'block', margin: '10px auto'}}
            disabled={this.state.calendarEdit.name == ''}
            onClick={this.submitChange}
            loading={this.state.isFetching}
            title="Il faut un nom avant de pouvoir sauvegarder"
            type="primary" size="large">Sauvegarder</Button>
        </div>
        <hr />
        <Row style={{paddingTop: '5px'}}>
          <Col span="12">
            <span>Heure de début: </span>
          </Col>
          <Col span="12">
            <TimePicker
              defaultValue={moment('07:00', format)}
              format={format}
              onChange={(moment) => this.onChangeHour(moment, 'minTime')} />
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span>Heure de fin: </span>
          </Col>
          <Col span="12">
            <TimePicker
              defaultValue={moment('20:00', format)}
              format={format}
              onChange={(m) => {
                var minTime = $('#calendar').fullCalendar('option', 'minTime');
                this.onChangeHour(moment(minTime, 'HH:mm:ss').isBefore(m) ? m : moment.duration(minTime).add(1, 'H'), 'maxTime');
              }} />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col span="24" className="calendar-details">
            {this.state.mediaSelected == "-1" ?
              <div>Cliquez sur une entrée dans l'agenda pour modifier ces informations.</div>
              :
            <div>
              <Row>
                <h3>{this.props.mediaById[eventSelected.id].name}</h3>
              </Row>
              <Row>
                Début:
                <Datetime
                  utc
                  value={moment.unix(eventSelected.startTimeOffset)}
                  onChange={(val) => {
                    var newMedia = this.state.mediaInCalendar.slice();
                    newMedia[idEventSelected].startTimeOffset = (val.unix());
                    this.setState({
                      mediaInCalendar: newMedia
                    });
                  }} />
              </Row>
              <Row>
                Fin:
                <Datetime
                  utc
                  value={moment.unix(eventSelected.startTimeOffset + eventSelected.duration)}
                  isValidDate={(current) => current.isAfter(moment.unix(eventSelected.startTimeOffset).subtract(1, 'day'))}
                  onChange={(val) => {
                    if (val.isAfter(moment.unix(eventSelected.startTimeOffset))) {
                      var newMedia = this.state.mediaInCalendar.slice();
                      newMedia[idEventSelected].duration = val.unix() - newMedia[idEventSelected].startTimeOffset;
                      this.setState({
                        mediaInCalendar: newMedia
                      });
                    }
                  }} />
              </Row>
              <Row>
                <Button
                  onClick={() => {
                    this.removeMediaInCalendar(idEventSelected);
                  }}
                  type="danger">
                    Supprimer ce média
                </Button>
              </Row>
            </div>
            }
          </Col>
        </Row>
      </Layout.Sider>
    </Layout>
    );
  }
}
