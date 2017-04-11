import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';

import { Layout, Button, Input, Icon, Row, Col } from 'antd';

import SceneEditorForm from './SceneEditorForm';
import SceneEditorViewPort from './SceneEditorViewPort';
import SceneEditorTimeline from './SceneEditorTimeline';

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
      mediaInScene: {},
      mediaSelected: undefined,
      mediaEdit: {
        id: -1,
        name: '',
        type: 'scene',
        duration: 60000,
        ratioNumerator: 16,
        ratioDenominator: 9,
      },
      isFetching: true,
      scaling: 100000,
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
      var mediaInScene = {};
      var maxScale = this.state.scaling;
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        if (relation.hostMediaId == this.state.mediaEdit.id) {
          const startTimeOffset = relation.startTimeOffset;
          const duration = relation.duration ? relation.duration : 0;
          const end = startTimeOffset + duration;
          if (end > maxScale)
            maxScale = end;

          mediaInScene[relation.id] = {
            id: relation.guestMediaId,
            boxLeft: relation.boxLeft,
            boxTop: relation.boxTop,
            boxWidth: relation.boxWidth,
            boxHeight: relation.boxHeight,
            guestLeft: relation.guestLeft,
            guestTop: relation.guestTop,
            guestWidth: relation.guestWidth,
            guestHeight: relation.guestHeight,
            startTimeOffset: startTimeOffset,
            duration: duration,
            zIndex: relation.zIndex,
            idRelation: relation.id, // Id le relation déjà existante
            ratio: true,
          };
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
    this.editorDurationWidth = document.getElementById('editor-duration-menu').offsetWidth;

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
  tmpIdForNewRelation = -1;

  timer;
  startTime = 0;

  calculateCurrentDuration() {
    var duration = 0;
    Object.keys(this.state.mediaInScene).forEach((key) => {
      const relation = this.state.mediaInScene[key];
      if ((relation.duration + relation.startTimeOffset) > duration) {
        duration = relation.duration + relation.startTimeOffset;
      }
    });
    return duration;
  }

  dropEvent = (event, ui) => {
    const duration = this.props.mediaById[ui.draggable.attr("id")].duration ? this.props.mediaById[ui.draggable.attr("id")].duration : 60000;
    //const zIndex = this.state.mediaInScene.length > 0 ? Math.max(...this.state.mediaInScene.map((o) => o.zIndex.value)) + 1 : 0;
    this.setState({
      mediaInScene: {
        ...this.state.mediaInScene,
        [this.tmpIdForNewRelation]: {
          id: ui.draggable.attr("id"),
          boxLeft: 0,
          boxTop: 0,
          boxWidth: 100,
          boxHeight: 100,
          guestLeft: 0,
          guestTop: 0,
          guestWidth: 100,
          guestHeight: 100,
          startTimeOffset: 0,
          duration: duration,
          zIndex: 0,
          idRelation: this.tmpIdForNewRelation, // Id le relation déjà existante (négative si aucune)
          ratio: true,
        }
      },
      scaling: duration > this.state.scaling ? duration : this.state.scaling
    }, () => this.tmpIdForNewRelation -= 1);
  }

  listDrop = () => {
    $("#scene-editor-list, #editor-positions").unbind('droppable');
    $("#scene-editor-list, #editor-positions").droppable({
      drop: this.dropEvent,
    });
  }

  selecteMediaInScene = (idRelation) => {
    if (idRelation != this.state.mediaSelected) {
      this.setState({
        mediaSelected: idRelation
      });
    }
  }

  /* fonction d'aide. Permet de supprimer un clé dans un object de façon immutable
   * TODO: mettre ça dans une classe OUTIL commune à toute l'app.
   */
  removeByKey (myObj, deleteKey) {
    return Object.keys(myObj)
      .filter((key) => key !== deleteKey)
      .reduce((result, current) => {
        result[current] = myObj[current];
        return result;
    }, {});
  }

  removeMediaInScene = (idRelation) => {
    // Liste des relations supprimées
    if (idRelation >= 0)
      this.mediaDeleted.push(idRelation);

    this.setState({
      mediaInScene: this.removeByKey(this.state.mediaInScene, String(idRelation)),
      mediaSelected: undefined,
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
    // this.state.mediaInScene contient les relations indexé par idRelation
    // this.state.mediaEdit: {id: id de la scene. -1 si ajout, name: nom}
    var relationsToSave = {};
    Object.keys(this.state.mediaInScene).forEach((key) => {
      const relation = this.state.mediaInScene[key];
      relationsToSave[key] = {
        id: key,
        guestMediaId: relation.id,
        duration: relation.duration,
        startTimeOffset: relation.startTimeOffset,
        boxLeft: relation.boxLeft,
        boxTop: relation.boxTop,
        boxWidth: relation.boxWidth,
        boxHeight: relation.boxHeight,
        guestLeft: relation.guestLeft,
        guestTop: relation.guestTop,
        guestWidth: relation.guestWidth,
        guestHeight: relation.guestHeight,
        zIndex: relation.zIndex,
      };
    });
    this.setState({
      mediaSelected: undefined
    });
    //return;
    this.props.actions.featPatchOrCreateFromEditor(this.mediaDeleted, relationsToSave, this.state.mediaEdit)
    .then(() => {
      this.context.router.push('/display-management/scene/');
    });
  }

  handleFormChange = (changedFields) => {
    this.updateRelation(this.state.mediaSelected, changedFields);
  }

  updateRelation = (idRelation, keyToChange) => {
    var updatedRelation = { ...this.state.mediaInScene[idRelation] };
    Object.keys(keyToChange).forEach((key) => {
      updatedRelation[key] = keyToChange[key];
    });
    this.setState({
      mediaInScene: {
        ...this.state.mediaInScene,
        [idRelation]: {
          ...updatedRelation
        }
      }
    });
  }

  changeScaling = (pourcent) => {
    this.setState({
      scaling: Math.round((this.state.scaling * pourcent)/1000)*1000,
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

  playScene = () => {
    this.setState({
      mediaControls: 'play',
    }, () => {
      this.startTime = Date.now() - this.state.interval;
      clearInterval(this.timer);
      this.timer = setInterval(this.tick, 50);
    });
  }

  pauseScene = (mouse, callback) => {
    clearInterval(this.timer);
    this.setState({
      mediaControls: 'pause'
    }, callback);
  }

  rewindScene = () => {
    clearInterval(this.timer);
    this.setState({
      interval: 0,
      mediaControls: 'pause',
    }, () => this.setState({mediaControls: '0'}));
  }

  setSceneInterval = (x) => {
    const computedX = Math.round(x / this.editorDurationWidth * this.state.scaling);
    this.pauseScene(undefined, () =>
      this.setState({
        interval: computedX,
        mediaControls: String(computedX),
      }));
  };

  render() {
    var screenSparationsDivs = [];

    Object.keys(this.state.mediaInScene).forEach((key) => {
      const media = this.props.mediaById[this.state.mediaInScene[key].id];
      const relation = this.state.mediaInScene[key];

      // Séparation de l'écran
      if (((relation.startTimeOffset <= (this.state.interval)) &&
          (relation.startTimeOffset + relation.duration >= (this.state.interval))) ||
          (relation.duration == 0)) {
        screenSparationsDivs.push(
          <SceneEditorViewPort
            key={key}
            zIndex={relation.zIndex}
            editorHeight={this.editorHeight}
            editorWidth={this.editorWidth}
            ratio={relation.ratio}
            x={relation.boxLeft / 100 * this.editorWidth}
            y={relation.boxTop / 100 * this.editorHeight}
            width={relation.boxWidth / 100 * this.editorWidth}
            height={relation.boxHeight / 100 * this.editorHeight}
            onClick={() => {
              if (this.state.mediaSelected != key)
                this.selecteMediaInScene(key);
            }}
            onResizeStop={(newHeight, newWidth) => {
              const newBoxHeight = newHeight + relation.boxTop > 100 ? 100 - relation.boxTop : newHeight;
              const newBoxWidth = newWidth + relation.boxLeft > 100 ? 100 - relation.boxLeft : newWidth;

              this.setState({
                mediaInScene: {
                  ...this.state.mediaInScene,
                  [key]: {
                    ...relation,
                    boxHeight: newBoxHeight,
                    boxWidth: newBoxWidth,
                  }
                }
              });
            }}
            onDragStop={(newX, newY) => {
              this.setState({
                mediaInScene: {
                  ...this.state.mediaInScene,
                  [key]: {
                    ...relation,
                    boxTop: newY,
                    boxLeft: newX,
                  }
                }
              });
            }}
            media={media}
            mediaControls={!isNaN(this.state.mediaControls) ? String((this.state.mediaControls - relation.startTimeOffset) % media.duration) : this.state.mediaControls}
            offset={relation.startTimeOffset}
           />
         );
       }
     });

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider width="auto"><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Row>
            <Col id="editor-positions" span="24">
              { Object.keys(this.state.mediaInScene).length == 0 ?
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
          <SceneEditorTimeline
            scene={this.state.mediaEdit}
            relations={this.state.mediaInScene}
            medias={this.props.mediaById}
            scaling={this.state.scaling}
            onChangeScaling={(val) => {
              this.setState({
                scaling: val
              });
            }}
            editorDurationWidth={this.editorDurationWidth}
            interval={this.state.interval}
            setSceneInterval={this.setSceneInterval}
            playScene={this.playScene}
            pauseScene={this.pauseScene}
            rewindScene={this.rewindScene}
            changeScaling={this.changeScaling}
            onClick={(idRelation) => {
              if (this.state.mediaSelected != idRelation) {
                this.selecteMediaInScene(idRelation);
              }
            }}
            updateRelation={this.updateRelation}

          />

        </Layout.Content>
        <Layout.Sider width={250}>
          <div style={{padding: '0 5px 5px 5px'}}>
            <Input
              value={this.state.mediaEdit.name}
              onChange={this.changeName}
              onPressEnter={this.submitChange}
              placeholder="Indiquez un nom de scène" />
            <Button
              loading={this.state.isFetching}
              style={{padding: '5px', display: 'block', margin: '10px auto'}}
              disabled={this.state.mediaEdit.name == ''}
              onClick={this.submitChange}
              type="primary" size="large" title="Il faut un nom avant de pouvoir sauvegarder">Sauvegarder</Button>
          </div>
          <hr />
          { this.state.mediaSelected == undefined ?
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
              />
            </div>
          }

        </Layout.Sider>
      </Layout>
    );
  }
}
