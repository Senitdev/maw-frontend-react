import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import { Input, Row, Col, Icon } from 'antd';

import './MediaList.scss';

@connect((state) => {
  const { mediaById, mediaByType } = state[displayManagementName];

  const images = mediaByType['image'].items.map((id) =>
    <Col key={id.toString()} className="gutter-row" span={8}>
      <div className="gutter-box"><Icon type="video-camera" /><br />{mediaById[id].name}</div>
    </Col>
  );

  const videos = mediaByType['video'].items.map((id) =>
    <Col key={id.toString()} className="gutter-row" span={8}>
      <div className="gutter-box"><Icon type="video-camera" /><br />{mediaById[id].name}</div>
    </Col>
  );


  return {
    mediaByType,
    images,
    videos
  };

}, (dispatch) => ({
  actions: bindActionCreators(displayManagementActions, dispatch)
}))
export default class MediaListContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    images: PropTypes.array.isRequired,
    mediaByType: PropTypes.object.isRequired,
    videos: PropTypes.array.isRequired,
  };

  componentDidMount() {
    if (this.props.images.length == 0)
      this.props.actions.fetchMedia('image');
    if (this.props.videos.length == 0)
      this.props.actions.fetchMedia('video');
  }

  render() {
    return (
      <div className="media-list-container">
        <Row justify="center" align="top">
          <Col offset={1} span={6}><h2>Media</h2></Col>
          <Col span={16}><Input.Search
            placeholder="Recherche"
            onSearch={(value) => console.log(value)}
          /></Col>
        </Row>
        <Row className="group-media-list" gutter={16}>
          <Col offset={1} span={23}><h3>Vidéos</h3></Col>
          {this.props.videos}
        </Row>
        <Row className="group-media-list" gutter={16}>
          <Col offset={1} span={23}><h3>Images</h3></Col>
          {this.props.images}
        </Row>
      </div>
    );
  }
}
