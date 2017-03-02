import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import { Layout, Button, Input, Icon, Spin } from 'antd';

import SceneEditorForm from './SceneEditorForm';

import './SceneEditorContainer.scss';

@connect((state) => {
  const { mediaById, file, scene, agenda, relationsById } = state[displayManagementName];

  const mediaByType = { file, scene, agenda };

  return {
    mediaByType,
    mediaById,
    relationsById
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
      mediaEdit: {
        id: -1,
        name: ''
      },
      isFetching: true,
    };
  }

  componentWillMount() {
    const idScene = Number(this.props.params.idScene);
    this.setState({
      mediaEdit: {
        ...this.state.mediaEdit,
        id: !isNaN(idScene) ? idScene : -1
      }
    });

    this.props.actions.fetchMediaList('file');
    this.props.actions.fetchMediaList('scene');
    this.props.actions.fetchMediaList('agenda');
    if (idScene >= 0)
      this.props.actions.fetchMediaDetails(idScene);
    else
      this.setState({
        isFetching: false
      });
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
            idRelation: -1, // Id le relation déjà existante (-1 si aucune)
          }])
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mediaById) {
      if (nextProps.mediaById[this.state.mediaEdit.id]) {
        this.setState({
          mediaEdit: {
            ...this.state.mediaEdit,
            name: nextProps.mediaById[this.state.mediaEdit.id].name
          }
        });
      }
    }
    if (nextProps.relationsById) {
      var mediaInScene = [];
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        mediaInScene.push({
          id: relation.guestMediaId,
          boxLeft: {value: relation.boxLeft},
          boxTop: {value: relation.boxTop},
          boxWidth: {value: relation.boxWidth},
          boxHeight: {value: relation.boxHeight},
          guestLeft: {value: relation.guestLeft},
          guestTop: {value: relation.guestTop},
          guestWidth: {value: relation.guestWidth},
          guestHeight: {value: relation.guestHeight},
          startTimeOffset: {value: relation.startTimeOffset},
          duration: {value: relation.duration},
          idRelation: relation.id, // Id le relation déjà existante
        });
      }
      this.setState({
        mediaInScene: mediaInScene,
        isFetching: false
      });
    }
  }

  mediaDeleted = [];

  selecteMediaInScene = (id) => {
    if (id != this.state.selecteMedia) {
      this.setState({
        mediaSelected: id
      });
    }
  }

  removeMediaInScene = (id) => {
    // Liste des relations supprimées
    if (this.state.mediaInScene[id].idRelation >= 0)
      this.mediaDeleted.push(this.state.mediaInScene[id].idRelation);

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

  changeName = (e) => {
    const { value } = e.target;
    this.setState({
      mediaEdit: {
        ...this.state.mediaEdit,
        name: value
      }
    });
  }

  submitChange = () => {
    // this.mediaDeleted : contient les id des relations à supprimer
    // this.state.mediaInScene contient les relations. l'attribut idRelation contient l'id à modifier. -1 si ajout
    // this.state.mediaEdit: {id: id de la scene. -1 si ajout, name: nom}
    // send(this.mediaDeleted, this.state.mediaInScene, this.state.mediaEdit);
    console.log(this.mediaDeleted, this.state.mediaInScene, this.state.mediaEdit);
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
              <div style={{padding: '5px 5px 0px 5px'}}>
                <Input
                  value={this.state.mediaEdit.name}
                  onChange={this.changeName}
                  placeholder="Nom de la scène" />
                <Button onClick={this.submitChange} style={{display: 'block', margin: '5px auto'}} type="primary" size="large">Sauvegarder</Button>
              </div>
              <br />
              <h3>Médias dans la scène <Spin spinning={this.state.isFetching} /></h3>
              {
                this.state.mediaInScene.length == 0 ?
                  <div id="drop-empty-container">
                    <span>
                      <Icon type="arrow-down" />
                    </span>
                    <br />
                    <span>
                      Déplacez des médias ici !
                    </span>
                  </div>
                :
                  <ul>
                    {mediaListLi}
                  </ul>
              }
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
