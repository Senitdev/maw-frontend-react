import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import { Input, Row, Col, Icon, Tooltip } from 'antd';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';

import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.min.css';
import './MediaList.scss';

import { MediaTypes } from 'models/displayManagement';

@connect((state) => {
  const { mediaById, file, scene, agenda } = state[displayManagementName];

  const mediaByType = { file, scene, agenda };

  return {
    mediaByType,
    mediaById
  };

}, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class MediaListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaByType: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentDidMount() {
    this.props.actions.fetchMediaList('file');
    this.props.actions.fetchMediaList('scene');
    this.props.actions.fetchMediaList('agenda');
  }

  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  render() {
    $(document).ready(function() {
      $('#media-list-container .media-gutter-box').each(function() {
        // make the event draggable using jQuery UI
        $(this).draggable({
          zIndex: 999,
          revert: true,      // will cause the event to go back to its
          revertDuration: 0  //  original position after the drag
        });
      });
    });

    const reg = new RegExp(this.state.searchText, 'gi');

    const medias = [];
    const groupsMedia = [];
    var count = 0;

    for (let key of Object.keys(MediaTypes)) {
      medias[MediaTypes[key].key] = this.props.mediaByType[MediaTypes[key].key].items.map((id) => {

        const tooltipPlacement = count % 3 == 0 ? 'left' : (count % 3 == 2 ? 'right' : 'top');
        count++;

        const dataEvent = '{"idMedia": ' + id + ', "stick": true, "title": "' + this.props.mediaById[id].name + '"}';

        if (!this.state.searchText || this.props.mediaById[id].name.match(reg))
          return (
            <Col key={id.toString()} className="gutter-row" span={8}>
              <Tooltip
                mouseEnterDelay={1}
                placement={tooltipPlacement}
                title={this.props.mediaById[id].name}>
                <div
                  className="media-gutter-box"
                  id={id}
                  data-event={dataEvent}
                  >
                  <Icon type="user" />
                  <br />
                  {this.props.mediaById[id].name}
                </div>
              </Tooltip>
            </Col>
          );
        else
          return null;
      });

      groupsMedia.push(
        <Row className="group-media-list" gutter={16} key={MediaTypes[key].key}>
          <Col offset={1} span={23}><h3>{MediaTypes[key].name}</h3></Col>
          {medias[MediaTypes[key].key]}
        </Row>
      );
    }

    return (
      <div id="media-list-container" className="media-list-container">
        <Row justify="center" align="top">
          <Col offset={1} span={6}><h2>Media</h2></Col>
          <Col span={16}><Input.Search
            placeholder="Recherche"
            onChange={this.onInputChange}
          /></Col>
        </Row>
        {groupsMedia}
      </div>
    );
  }
}
