import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaListContainer from '../MediaListContainer';
import { actionCreators as displayManagementActions, NAME as displayManagementName } from '../../';

import $ from 'jquery';
import '../../../../utils/jquery-ui.min';

import { Layout, Button, Input, Icon, Spin, Tabs, Row, Col } from 'antd';

import Rnd from 'react-rnd';

import SceneEditorForm from './SceneEditorForm';

import { FileViewer } from '../MediaViewers/FileViewer';

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
      for (var index in nextProps.relationsById) {
        const relation = nextProps.relationsById[index];
        if (relation.hostMediaId == this.state.mediaEdit.id)
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

  componentDidUpdate() {
    this.listDrop();
    this.editorHeight = document.getElementById('editor-positions').clientHeight;
    this.editorWidth = document.getElementById('editor-positions').clientWidth;
  }

  mediaDeleted = [];
  editorHeight = 0;
  editorWidth = 0;
  haveDrag = [];
  rnd = [];

  dropEvent = (event, ui) => {
    this.setState({
      mediaInScene: this.state.mediaInScene.concat([{
        id: ui.draggable.attr("id"),
        boxLeft: {value: 0},
        boxTop: {value: 0},
        boxWidth: {value: 100},
        boxHeight: {value: 100},
        guestLeft: {value: 0},
        guestTop: {value: 0},
        guestWidth: {value: 0},
        guestHeight: {value: 0},
        startTimeOffset: {value: 0},
        //duration: {value: this.state.mediaById[ui.draggable.attr("id")].duration},
        duration: {value: -1},
        idRelation: -1, // Id le relation déjà existante (-1 si aucune)
      }])
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
    var newMedias = this.state.mediaInScene;
    newMedias[this.state.mediaSelected] = {...this.state.mediaInScene[this.state.mediaSelected], ...changedFields};
    this.setState({
      mediaInScene: newMedias,
    });
    if (this.rnd[this.state.mediaSelected])
      this.rnd[this.state.mediaSelected].updatePosition({ x: this.state.mediaInScene[this.state.mediaSelected].boxLeft.value / 100 * this.editorWidth, y: this.state.mediaInScene[this.state.mediaSelected].boxTop.value / 100 * this.editorHeight });
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
    this.props.actions.featPatchOrCreateFromEditor(this.mediaDeleted, this.state.mediaInScene, this.state.mediaEdit)
    .then((mediaId) => {
      if (this.state.mediaEdit.id < 0)
        this.context.router.push('/display-management/scene/' + mediaId);
    });
  }

  moveMediaInScene = (id, deplacement) => {
    var newMedias = this.state.mediaInScene.slice();

    newMedias[id] = this.state.mediaInScene[id + deplacement];
    newMedias[id + deplacement] = this.state.mediaInScene[id];

    this.rnd[id].updatePosition({
      x: this.state.mediaInScene[id + deplacement].boxLeft.value / 100 * this.editorWidth,
      y: this.state.mediaInScene[id + deplacement].boxTop.value / 100 * this.editorHeight
    });
    this.rnd[id + deplacement].updatePosition({
      x: this.state.mediaInScene[id].boxLeft.value / 100 * this.editorWidth,
      y: this.state.mediaInScene[id].boxTop.value / 100 * this.editorHeight
    });

    this.setState({
      mediaInScene: newMedias,
    });
  }

  render() {
    var mediaListLi = [];
    var screenSparationsDivs = [];
    var durationElements = [];
    for (var i = 0; i < this.state.mediaInScene.length; i++) {
      let idTemp = i;
      const media = this.props.mediaById[this.state.mediaInScene[idTemp].id];
      var className = idTemp == this.state.mediaSelected ? 'selected' : '';
      mediaListLi.push(
        <li key={idTemp} className={className}>
          <a
            onClick={() => this.selecteMediaInScene(idTemp)}
            title={media.name}
            >
              {media.name}
            </a>
          <Button type="danger" icon="delete" size="small" onClick={() => this.removeMediaInScene(idTemp)} />
        </li>
      );

      // Séparation de l'écran
      const shade = (idTemp + 3) * 8 % 100;
      screenSparationsDivs.push(
        <Rnd
          key={idTemp}
          style={{backgroundColor: '#' + shade + shade + shade}}
          ref={(c) => { this.rnd[idTemp] = c; }}
          initial={{
            x: this.state.mediaInScene[idTemp].boxLeft.value / 100 * this.editorWidth,
            y: this.state.mediaInScene[idTemp].boxTop.value / 100 * this.editorHeight,
            width: this.state.mediaInScene[idTemp].boxWidth.value / 100 * this.editorWidth,
            height: this.state.mediaInScene[idTemp].boxHeight.value / 100 * this.editorHeight,
          }}
          className="editor-position"
          minWidth={1}
          minHeight={1}
          bounds={'parent'}
          moveAxis="both"
          onClick={() => {
            if (this.state.mediaSelected != idTemp)
              this.setState({mediaSelected: idTemp});
          }}
          onResizeStop={(direction, styleSize, clientSize) => {
            var newMediaInScene = this.state.mediaInScene;
            const newHeight = Math.round(clientSize.height / this.editorHeight * 100);
            const newWidth = Math.round(clientSize.width / this.editorWidth * 100);

            newMediaInScene[idTemp].boxHeight.value = newHeight + newMediaInScene[idTemp].boxTop.value > 100 ? 100 - newMediaInScene[idTemp].boxTop.value : newHeight;
            newMediaInScene[idTemp].boxWidth.value = newWidth + newMediaInScene[idTemp].boxLeft.value > 100 ? 100 - newMediaInScene[idTemp].boxLeft.value : newWidth;

            this.setState({
              mediaInScene: newMediaInScene
            });
            if (this.rnd[idTemp])
              this.rnd[idTemp].updateSize({
                width: newMediaInScene[idTemp].boxWidth.value / 100 * this.editorWidth,
                height: newMediaInScene[idTemp].boxHeight.value / 100 * this.editorHeight,
              });
            }}
          onDragStart={() => {
            this.haveDrag[idTemp] = false;
          }}
          onDrag={() => {
            this.haveDrag[idTemp] = true;
          }}
          onDragStop={(event, ui) => {
            if (this.haveDrag[idTemp]) {
              var newMediaInScene = this.state.mediaInScene;
              newMediaInScene[idTemp].boxTop.value = Math.round(ui.position.top / this.editorHeight * 100);
              newMediaInScene[idTemp].boxLeft.value = Math.round(ui.position.left / this.editorWidth * 100);
              this.setState({
                mediaInScene: newMediaInScene
              });
            }
          }}
        >
          <h4>{media.name}</h4>
          <FileViewer file={media} />
        </Rnd>
      );

      // Editeur des durées et z-index
      const duree = this.state.mediaInScene[idTemp].duration.value == -1 ? media.duration : this.state.mediaInScene[idTemp].duration.value;
      durationElements.push(
        <Row key={idTemp} className="editor-duration">
        <Col span="1" className="editor-duration-buttons">
          <Button
            disabled={idTemp == 0}
            onClick={() => {
              this.moveMediaInScene(idTemp, -1);
            }}
            type="dashed" shape="circle" icon="caret-up" size="small" />
          <Button
            disabled={idTemp == this.state.mediaInScene.length -1}
            onClick={() => {
              this.moveMediaInScene(idTemp, 1);
            }}
            type="dashed" shape="circle" icon="caret-down" size="small" />
        </Col>
        <Col span="23">
          <Rnd
            initial={{
              x: this.state.mediaInScene[idTemp].startTimeOffset.value,
              y: 0,
              width: Math.max(duree, 150),
              height: 44,
            }}
            style={{backgroundColor: '#' + shade + shade + shade}}
            className="editor-separation-element"
            minWidth={1}
            minHeight={44}
            maxHeight={44}
            bounds={'parent'}
            moveAxis="x"
            onDragStop={(event, ui) => {
              var newMediaInScene = this.state.mediaInScene;
              newMediaInScene[idTemp].startTimeOffset.value = ui.position.left;
              this.setState({
                mediaInScene: newMediaInScene
              });
            }}
            onResizeStop={(direction, styleSize, clientSize) => {
              var newMediaInScene = this.state.mediaInScene;
              newMediaInScene[idTemp].duration.value = clientSize.width;
              this.setState({
                mediaInScene: newMediaInScene
              });
            }}
          >
            <ul>
              <li>{media.name}</li>
              <li>{this.state.mediaInScene[idTemp].startTimeOffset.value} : Décalage (s)</li>
              <li>{duree}: Durée (s)</li>
            </ul>
            <Button size="small" shape="circle" icon="reload"
              onClick={() => {
                var newMediaInScene = this.state.mediaInScene;
                newMediaInScene[idTemp].duration.value = -1;
                this.setState({
                  mediaInScene: newMediaInScene
                });
              }}
            />
          </Rnd>
        </Col>
        </Row>
      );
    }

    return (
      <Layout className="display-management-content-layout">
        <Layout.Sider width="auto"><MediaListContainer /></Layout.Sider>
        <Layout.Content id="scene-list-container">
          <Tabs
            style={{height: '100%', display: 'flex', flexDirection: 'column'}}
            defaultActiveKey="2"
            onChange={() => setTimeout(this.listDrop, 800)}
            tabBarExtraContent={
              <div style={{display: 'flex'}}>
                <Input
                  style={{marginRight: '20px'}}
                  value={this.state.mediaEdit.name}
                  onChange={this.changeName}
                  placeholder="Nom de la scène" />
                <Button onClick={this.submitChange} type="primary" size="large">Sauvegarder</Button>
              </div>
            }
          >
          <Tabs.TabPane tab="Éditeur avancé" key="1">
          <Layout style={{height: '100%'}}>
            <Layout.Sider id="scene-editor-list">
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="Éditeur graphique" key="2">
            <Row>
              <Col id="editor-positions" span="24">
                <div>
                {screenSparationsDivs}
                </div>
              </Col>
            </Row>
            <Row id="editor-duration-menu">
              <Col span="12"><h4>Médias</h4></Col>
            </Row>
            {durationElements}
          </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </Layout>
    );
  }
}
