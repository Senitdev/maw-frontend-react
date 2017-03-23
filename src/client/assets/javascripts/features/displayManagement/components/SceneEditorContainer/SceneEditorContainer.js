import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';

import { Layout, Button, Input, Icon, Row, Col, InputNumber } from 'antd';

import SceneEditorForm from './SceneEditorForm';
import SceneEditorViewPort from './SceneEditorViewPort';
import SceneEditorDuration from './SceneEditorDuration';

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

  // ask for `router` from context
  static contextTypes = {
    router: React.PropTypes.object
  }

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
        name: '',
        type: 'scene'
      },
      isFetching: true,
      scaling: 60,
    };
  }

  componentWillMount() {
    const idScene = Number(this.props.params.idScene);
    this.setState({
      mediaEdit: {
        ...this.state.mediaEdit,
        id: !isNaN(idScene) ? idScene : -1,
      },
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
      var maxScale = this.state.scaling;
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        if (relation.hostMediaId == this.state.mediaEdit.id) {
          const startTimeOffset = relation.startTimeOffset / 1000;
          const duration = relation.duration ? relation.duration / 1000 : 0;
          const end = startTimeOffset + duration;
          if (end > maxScale)
            maxScale = end;

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
            startTimeOffset: {value: startTimeOffset},
            duration: {value: duration},
            zIndex: {value: relation.zIndex},
            idRelation: relation.id, // Id le relation déjà existante
          });
        }
      }
      this.setState({
        mediaInScene: mediaInScene,
        isFetching: false,
        scaling: maxScale
      });
    }
  }

  componentDidUpdate() {
    this.listDrop();
    this.editorHeight = document.getElementById('editor-positions').clientHeight;
    this.editorWidth = document.getElementById('editor-positions').clientWidth;
    this.editorDurationWidth = document.getElementById('editor-duration-menu').clientWidth / 24 * 23 - 6;
  }

  mediaDeleted = [];
  editorHeight = 0;
  editorWidth = 0;
  editorDurationWidth = 0;
  haveDrag = [];

  dropEvent = (event, ui) => {
    const duration = this.props.mediaById[ui.draggable.attr("id")].duration ? this.props.mediaById[ui.draggable.attr("id")].duration / 1000 : 0;
    this.setState({
      mediaInScene: this.state.mediaInScene.concat([{
        id: ui.draggable.attr("id"),
        boxLeft: {value: 0},
        boxTop: {value: 0},
        boxWidth: {value: 100},
        boxHeight: {value: 100},
        guestLeft: {value: 0},
        guestTop: {value: 0},
        guestWidth: {value: 100},
        guestHeight: {value: 100},
        startTimeOffset: {value: 0},
        duration: {value: duration},
        zIndex: {value: this.state.mediaInScene.length > 0 ? this.state.mediaInScene[this.state.mediaInScene.length - 1].zIndex.value + 1 : 0},
        idRelation: -1, // Id le relation déjà existante (-1 si aucune)
      }]),
      scaling: duration > this.state.scaling ? duration : this.state.scaling
    });
  }

  listDrop = () => {
    $("#scene-editor-list, #editor-positions").unbind('droppable');
    $("#scene-editor-list, #editor-positions").droppable({
      drop: this.dropEvent,
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
    var newMedias = this.state.mediaInScene.slice();
    newMedias[this.state.mediaSelected] = {...this.state.mediaInScene[this.state.mediaSelected], ...changedFields};
    this.setState({
      mediaInScene: newMedias,
    });
  }

  changeDuration = (e) => {
    var newMedias = this.state.mediaInScene.slice();
    newMedias[this.state.mediaSelected].duration.value = e.target.value == 1 ? 1 : 0;
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

    var newMediasWithMS = this.state.mediaInScene.slice();
    newMediasWithMS = newMediasWithMS.map((m) =>
      ({
        ...m,
        startTimeOffset: {value: m.startTimeOffset.value * 1000},
        duration: {value: m.duration.value * 1000},
      })
    );

    this.setState({
      mediaSelected: -1
    });

    this.props.actions.featPatchOrCreateFromEditor(this.mediaDeleted, newMediasWithMS, this.state.mediaEdit)
    .then(() => {
      this.context.router.push('/display-management/scene/');
    });
  }

  render() {
    var screenSparationsDivs = [];
    var durationElements = [];
    for (var i = 0; i < this.state.mediaInScene.length; i++) {
      let idTemp = i;
      const media = this.props.mediaById[this.state.mediaInScene[idTemp].id];

      // Séparation de l'écran
      const shade = (this.state.mediaInScene[idTemp].zIndex.value  + 3) * 8 % 100;
      screenSparationsDivs.push(
        <SceneEditorViewPort
          key={idTemp}
          zIndex={this.state.mediaInScene[idTemp].zIndex.value + 10}
          backgroundColor={'#' + shade + shade + shade}
          editorHeight={this.editorHeight}
          editorWidth={this.editorWidth}
          x={this.state.mediaInScene[idTemp].boxLeft.value / 100 * this.editorWidth}
          y={this.state.mediaInScene[idTemp].boxTop.value / 100 * this.editorHeight}
          width={this.state.mediaInScene[idTemp].boxWidth.value / 100 * this.editorWidth}
          height={this.state.mediaInScene[idTemp].boxHeight.value / 100 * this.editorHeight}
          onClick={() => {
            if (this.state.mediaSelected != idTemp)
              this.setState({mediaSelected: idTemp});
          }}
          onResizeStop={(newHeight, newWidth) => {
            var newMediaInScene = this.state.mediaInScene;
            newMediaInScene[idTemp].boxHeight.value = newHeight + newMediaInScene[idTemp].boxTop.value > 100 ? 100 - newMediaInScene[idTemp].boxTop.value : newHeight;
            newMediaInScene[idTemp].boxWidth.value = newWidth + newMediaInScene[idTemp].boxLeft.value > 100 ? 100 - newMediaInScene[idTemp].boxLeft.value : newWidth;

            this.setState({
              mediaInScene: newMediaInScene
            });
          }}
          onDragStop={(newX, newY) => {
            var newMediaInScene = this.state.mediaInScene;
            newMediaInScene[idTemp].boxTop.value = newY;
            newMediaInScene[idTemp].boxLeft.value = newX;
            this.setState({
              mediaInScene: newMediaInScene
            });
          }}
          media={media}
         />
      );

      // Editeur des durées et z-index
      const duree = (this.state.mediaInScene[idTemp].duration.value == 0 ? this.state.scaling - this.state.mediaInScene[idTemp].startTimeOffset.value : this.state.mediaInScene[idTemp].duration.value);
      durationElements.push(
        <SceneEditorDuration
          key={idTemp}
          id={idTemp}
          backgroundColor={'#' + shade + shade + shade}
          editorDurationWidth={this.editorDurationWidth}
          mediaInSceneLength={this.state.mediaInScene.length}
          moveMediaInScene={(id, deplacement) => {
            var newMedias = this.state.mediaInScene.slice();
            const temp = newMedias[id].zIndex.value;
            newMedias[id].zIndex.value = newMedias[id + deplacement].zIndex.value;
            newMedias[id + deplacement].zIndex.value = temp;

            this.setState({
              mediaInScene: newMedias,
            });
          }}
          x={Math.round(this.state.mediaInScene[idTemp].startTimeOffset.value / this.state.scaling * this.editorDurationWidth)}
          width={Math.max(Math.round(duree / this.state.scaling * this.editorDurationWidth), 30)}
          scaling={this.state.scaling}
          onClick={() => {
            if (this.state.mediaSelected != idTemp)
              this.setState({mediaSelected: idTemp});
          }}
          onDragStop={(newStart) => {
            var newMediaInScene = this.state.mediaInScene;
            newMediaInScene[idTemp].startTimeOffset.value = newStart;
            if (newMediaInScene[idTemp].startTimeOffset.value + newMediaInScene[idTemp].duration.value > this.state.scaling)
              newMediaInScene[idTemp].duration.value = this.state.scaling - newMediaInScene[idTemp].startTimeOffset.value;

            this.setState({
              mediaInScene: newMediaInScene
            });
          }}
          onResizeStop={(newDuration) => {
            var newMediaInScene = this.state.mediaInScene;
            newMediaInScene[idTemp].duration.value = newDuration;
            if (newMediaInScene[idTemp].startTimeOffset.value + newMediaInScene[idTemp].duration.value > this.state.scaling)
              newMediaInScene[idTemp].duration.value = this.state.scaling - newMediaInScene[idTemp].startTimeOffset.value;

            this.setState({
              mediaInScene: newMediaInScene
            });
          }}
          content={
            <div>
              <ul>
                <li>{media.name}</li>
                <li>{this.state.mediaInScene[idTemp].startTimeOffset.value} : Décalage (s)</li>
                <li>{this.state.mediaInScene[idTemp].duration.value == 0 ? <span>&infin;</span> : this.state.mediaInScene[idTemp].duration.value}: Durée (s)</li>
              </ul>
              <Button title="Réinitialiser la durée" size="small" shape="circle" icon="reload"
                onClick={() => {
                  var newMediaInScene = this.state.mediaInScene;
                  newMediaInScene[idTemp].duration.value = media.duration ? media.duration / 1000 : 0;
                  this.setState({
                    mediaInScene: newMediaInScene
                  });
                }}
              />
            </div>
          }
        />
      );
    }

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider width="auto"><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Row>
            <Col id="editor-positions" span="24">
              { this.state.mediaInScene.length == 0 ?
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
                  <div>
                    {screenSparationsDivs}
                  </div>
              }
            </Col>
          </Row>
          <Row id="editor-duration-menu">
            <Col span="12"><h4>Médias</h4></Col>
            <Col span="12">Échelle en seconde : <InputNumber onChange={(val) => {
              this.setState({
                scaling: val
              });
            }} size="small" min={1} value={this.state.scaling} /></Col>
          </Row>
          {durationElements}
        </Layout.Content>
        <Layout.Sider width={250}>
          <div style={{padding: '0 5px 5px 5px'}}>
            <Input
              value={this.state.mediaEdit.name}
              onChange={this.changeName}
              placeholder="Indiquez un nom de scène" />
            <Button
              loading={this.state.isFetching}
              style={{padding: '5px', display: 'block', margin: '10px auto'}}
              disabled={this.state.mediaEdit.name == ''}
              onClick={this.submitChange}
              type="primary" size="large" title="Il faut un nom avant de pouvoir sauvegarder">Sauvegarder</Button>
          </div>
          <hr />
          { this.state.mediaSelected == -1 ?
            <div>Cliquez sur un média pour modifier ces informations.</div>
          :
            <div>
              <h2 style={{padding: '5px', wordBreak: 'break-word'}}>
                {this.props.mediaById[this.state.mediaInScene[this.state.mediaSelected].id].name}
                <Button
                  style={{float: 'right'}}
                  type="danger" icon="delete" size="small"
                  onClick={() => this.removeMediaInScene(this.state.mediaSelected)} />
              </h2>
              <SceneEditorForm
                onChange={this.handleFormChange}
                mediaData={this.state.mediaInScene[this.state.mediaSelected]}
                changeDuration={this.changeDuration}
              />
            </div>
          }

        </Layout.Sider>
      </Layout>
    );
  }
}
