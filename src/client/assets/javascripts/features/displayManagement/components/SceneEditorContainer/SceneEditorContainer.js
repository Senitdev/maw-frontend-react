import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import { Form, Layout, Button } from 'antd';

import { SceneEditorForm } from './SceneEditorForm';

import './SceneEditorContainer.scss';

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
export default class SceneEditorContainer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    mediaById: PropTypes.object.isRequired,
    mediaByType: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mediaInScene: [],
      mediaSelected: -1,
    };
  }

  componentWillMount() {
    this.props.actions.fetchMediaList('file');
    this.props.actions.fetchMediaList('scene');
    this.props.actions.fetchMediaList('agenda');
  }

  componentDidMount() {
    $("#scene-editor-list").droppable({
      drop: (event, ui) => {
        this.setState({
          mediaInScene: this.state.mediaInScene.concat([{
            id: ui.draggable.attr("id"),
            boxLeft: 0,
            boxTop: 0,
            boxWidth: 0,
            boxHeight: 0,
            guestLeft: 0,
            guestTop: 0,
            guestWidth: 0,
            guestHeight: 0,
            startTimeOffset: 0,
            duration: -1,
          }])
        });
      }
    });
  }

  selecteMediaInScene = (id) => {
    if (id != this.state.selecteMedia)
      this.setState({
        mediaSelected: id
      });
  }

  removeMediaInScene = (id) => {
    var newMedias = this.state.mediaInScene;
    newMedias.splice(id, 1);

    var newMediaSelected = this.state.mediaSelected;
    if (id == this.state.mediaSelected)
      newMediaSelected = -1;
    else if (id < this.state.mediaSelected) {
      newMediaSelected--;
    }

    this.setState({
      mediaInScene: newMedias,
      mediaSelected: newMediaSelected
    });
  }

  submitMediaData = (err, values) => {
    if (!err) {
      var newMedias = this.state.mediaInScene;
      newMedias[this.state.mediaSelected].boxHeight = values.box_height;
      newMedias[this.state.mediaSelected].boxLeft = values.box_left;
      newMedias[this.state.mediaSelected].boxTop = values.box_top;
      newMedias[this.state.mediaSelected].boxWidth = values.box_width;
      newMedias[this.state.mediaSelected].duration = values.duration;
      newMedias[this.state.mediaSelected].guestHeight = values.guest_height;
      newMedias[this.state.mediaSelected].guestLeft = values.guest_left;
      newMedias[this.state.mediaSelected].guestTop = values.guest_top;
      newMedias[this.state.mediaSelected].guestWidth = values.guest_width;
      newMedias[this.state.mediaSelected].startTimeOffset = values.start_time_offset;
      this.setState({
        mediaInScene: newMedias,
      });
    }
  }

  render() {
    var mediaListLi = [];
    for (var i = 0; i < this.state.mediaInScene.length; i++) {
      let idTemp = i;
      var className = idTemp == this.state.mediaSelected ? 'selected' : '';
      mediaListLi.push(
        <li key={idTemp} className={className}>
          <a
            onClick={() => this.selecteMediaInScene(idTemp)}
            title={this.props.mediaById[this.state.mediaInScene[idTemp].id].name}
            >
              {this.props.mediaById[this.state.mediaInScene[idTemp].id].name}
            </a>
          <Button type="danger" icon="delete" size="small" onClick={() => this.removeMediaInScene(idTemp)} />
        </li>
      );
    }

    const EditorForm = Form.create()(SceneEditorForm);

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Layout>
            <Layout.Sider id="scene-editor-list">
              <h3>Médias dans la scène</h3>
              <ul>
                {mediaListLi}
              </ul>
            </Layout.Sider>
            <Layout.Content>
              { this.state.mediaSelected >= 0 &&
                <EditorForm
                  validateFields={this.submitMediaData}
                  mediaData={this.state.mediaInScene[this.state.mediaSelected]}
                />
              }
            </Layout.Content>
          </Layout>
        </Layout.Content>
      </Layout>
    );
  }
}
