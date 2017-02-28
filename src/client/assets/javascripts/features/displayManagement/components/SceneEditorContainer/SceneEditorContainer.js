import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import { Layout, Button } from 'antd';

import SceneEditorForm from './SceneEditorForm';

import './SceneEditorContainer.scss';

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
    params: PropTypes.object.isRequired,
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
    this.props.actions.fetchMediaDetails(Number(this.props.params.idScene));
  }

  componentDidMount() {
    $("#scene-editor-list").droppable({
      drop: (event, ui) => {
        this.setState({
          mediaInScene: this.state.mediaInScene.concat([{
            id: ui.draggable.attr("id"),
            boxLeft: {value: 0},
            boxTop: {value: 0},
            boxWidth: {value: 0},
            boxHeight: {value: 0},
            guestLeft: {value: 0},
            guestTop: {value: 0},
            guestWidth: {value: 0},
            guestHeight: {value: 0},
            startTimeOffset: {value: 0},
            duration: {value: -1},
          }])
        });
      }
    });
  }

  selecteMediaInScene = (id) => {
    if (id != this.state.selecteMedia) {
      this.setState({
        mediaSelected: id
      });
    }
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

  handleFormChange = (changedFields) => {
    var newMedias = this.state.mediaInScene;
    newMedias[this.state.mediaSelected] = {...this.state.mediaInScene[this.state.mediaSelected], ...changedFields};
    this.setState({
      mediaInScene: newMedias,
    });
  }

  changeDuration = (e) => {
    var newMedias = this.state.mediaInScene;
    newMedias[this.state.mediaSelected].duration.value = e.target.checked ? 0 : -1;
    this.setState({
      mediaInScene: newMedias,
    });
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

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Layout>
            <Layout.Sider id="scene-editor-list">
              <Button type="primary" size="large">Sauvegarder</Button>
              <br />
              <h3>Médias dans la scène</h3>
              <ul>
                {mediaListLi}
              </ul>
            </Layout.Sider>
            <Layout.Content>
              { this.state.mediaSelected >= 0 &&
                <SceneEditorForm
                  onChange={this.handleFormChange}
                  mediaData={this.state.mediaInScene[this.state.mediaSelected]}
                  changeDuration={this.changeDuration}
                />
              }
            </Layout.Content>
          </Layout>
        </Layout.Content>
      </Layout>
    );
  }
}
