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
import SceneEditorCursor from './SceneEditorCursor';
import SceneEditorDurationMarque from './SceneEditorDurationMarque';

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
        type: 'scene',
        duration: 60000,
      },
      isFetching: true,
      scaling: 90000,
      interval: 0,
      mediaControls: 'pause',
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
            name: nextProps.mediaById[this.state.mediaEdit.id].name,
            duration: nextProps.mediaById[this.state.mediaEdit.id].duration,
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
          const startTimeOffset = relation.startTimeOffset;
          const duration = relation.duration ? relation.duration : 0;
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

  componentDidUpdate(prevProps, prevState) {
    this.listDrop();
    this.editorHeight = document.getElementById('editor-positions').offsetHeight;
    this.editorWidth = document.getElementById('editor-positions').offsetWidth;
    this.editorDurationWidth = document.getElementById('editor-duration-menu').offsetWidth / 24 * 22 - 7;

    //Met à jour la durée de la scène
    const currentDuration = this.calculateCurrentDuration();
    if (prevState.mediaEdit.duration != currentDuration) {
      this.setState({
        mediaEdit: {
          ...this.state.mediaEdit,
          duration: currentDuration,
        }
      });
    }
  }

  mediaDeleted = [];
  editorHeight = 0;
  editorWidth = 0;
  editorDurationWidth = 0;
  haveDrag = [];

  timer;
  startTime = 0;

  calculateCurrentDuration() {
    var duration = 0;
    for (var i = 0; i < this.state.mediaInScene.length; i++) {
      const relation = this.state.mediaInScene[i];
      if ((relation.duration.value + relation.startTimeOffset.value) > duration) {
        duration = relation.duration.value + relation.startTimeOffset.value;
      }
    }
    return duration;
  }

  dropEvent = (event, ui) => {
    const duration = this.props.mediaById[ui.draggable.attr("id")].duration ? this.props.mediaById[ui.draggable.attr("id")].duration : 60000;
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
    newMedias[this.state.mediaSelected] = {
      ...this.state.mediaInScene[this.state.mediaSelected],
      ...changedFields,
    };
    if (changedFields.duration)
      newMedias[this.state.mediaSelected].duration = {value: changedFields.duration.value * 1000};
    if (changedFields.startTimeOffset)
      newMedias[this.state.mediaSelected].startTimeOffset = {value: changedFields.startTimeOffset.value * 1000};
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

  tick = () => {
    if (this.state.interval >= this.state.mediaEdit.duration) {
      clearInterval(this.timer);
      this.setState({
        mediaControls: 'pause',
      });
    } else {
      this.setState({
        interval: Date.now() - this.startTime,
      });
    }
  }

  render() {
    var screenSparationsDivs = [];
    var durationElements = [];
    for (var i = 0; i < this.state.mediaInScene.length; i++) {
      let idTemp = i;
      const media = this.props.mediaById[this.state.mediaInScene[idTemp].id];
      const relation = this.state.mediaInScene[idTemp];

      // Séparation de l'écran
      const shade = (this.state.mediaInScene[idTemp].zIndex.value  + 3) * 8 % 100;
      if (((relation.startTimeOffset.value <= (this.state.interval)) &&
          (relation.startTimeOffset.value + relation.duration.value >= (this.state.interval))) ||
          (relation.duration.value == 0)) {
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
            mediaControls={!isNaN(this.state.mediaControls) ? String((this.state.mediaControls - relation.startTimeOffset.value) % media.duration) : this.state.mediaControls}
            offset={relation.startTimeOffset.value}
           />
         );
       }

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
                <li>{this.state.mediaInScene[idTemp].startTimeOffset.value / 1000} : Décalage (s)</li>
                <li>{this.state.mediaInScene[idTemp].duration.value == 0 ? <span>&infin;</span> : this.state.mediaInScene[idTemp].duration.value / 1000}: Durée (s)</li>
              </ul>
              <Button title="Réinitialiser la durée" size="small" shape="circle" icon="reload"
                onClick={() => {
                  var newMediaInScene = this.state.mediaInScene;
                  newMediaInScene[idTemp].duration.value = media.duration ? media.duration : 60000;
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

    const currentDuration = require('millisec')(this.state.interval).format('hh [h] : mm [m] : ss [s]');

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
            <Col span="4"><h4>Médias</h4></Col>
            <Col offset='6' span="7">
              <Button onClick={() => {
                  clearInterval(this.timer);
                  this.setState({
                    interval: 0,
                    mediaControls: 'pause',
                  }, () => this.setState({mediaControls: '0'}));
                }} icon='step-backward' />
              <Button onClick={() => {
                  clearInterval(this.timer);
                  this.setState({
                    mediaControls: 'pause',
                  });
                }} icon='pause' />
              <Button onClick={() => {
                  this.setState({
                    mediaControls: 'play',
                  }, () => {
                    this.startTime = Date.now() - this.state.interval;
                    clearInterval(this.timer);
                    this.timer = setInterval(this.tick, 50);
                  });
                }} icon='caret-right' />
                <span className='timerDisplayer'>{currentDuration}</span>
            </Col>
            <Col offset='1' span="6">Échelle en seconde : <InputNumber onChange={(val) => {
              this.setState({
                scaling: val * 1000
              });
            }} size="small" min={1} step={0.001} value={this.state.scaling / 1000} /></Col>
          </Row>
          <Row>
            <Col offset='2' span='22' className="editor-cursor-container" onMouseDown={(e) => {
                var newPosition = Math.round(e.nativeEvent.offsetX / this.editorDurationWidth * this.state.scaling);
                clearInterval(this.timer);
                this.setState({
                  interval: newPosition,
                  mediaControls: 'pause',
                }, () => this.setState({mediaControls: String(newPosition)}));
              }}>
              <SceneEditorDurationMarque x={2+Math.round((this.state.mediaEdit.duration) / this.state.scaling * this.editorDurationWidth)} />
              <SceneEditorCursor
                backgroundColor='green'
                cursorWidth={5}
                scaling={this.state.scaling}
                editorDurationWidth={this.editorDurationWidth}
                height={7 + this.state.mediaInScene.length * 53}
                x={Math.round((this.state.interval) / this.state.scaling * this.editorDurationWidth)}
                onDragStop={(newStart) =>
                  this.setState({
                    interval: newStart,
                    mediaControls: newStart.toString(),
                  })
                }
                onDragStart={() =>
                  this.setState({
                    mediaControls: 'pause'
                  })
                }
              />
            </Col>
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
