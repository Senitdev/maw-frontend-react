import React, { Component, PropTypes } from 'react';

import { Button, Row, Col, Icon } from 'antd';
import millisec from 'millisec';

import SceneEditorTimelineCursor from './SceneEditorTimelineCursor';
import SceneEditorTimelineDurationMarque from './SceneEditorTimelineDurationMarque';
import SceneEditorTimelineItem from './SceneEditorTimelineItem';

export default class SceneEditorTimeline extends Component {

  static propTypes = {
    changeScaling: PropTypes.func.isRequired,
    editorDurationWidth: PropTypes.number.isRequired,
    interval: PropTypes.number.isRequired,
    medias: PropTypes.object.isRequired,
    onChangeScaling: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    pauseScene: PropTypes.func.isRequired,
    playScene: PropTypes.func.isRequired,
    relations: PropTypes.object.isRequired,
    rewindScene: PropTypes.func.isRequired,
    scaling: PropTypes.number.isRequired,
    scene: PropTypes.object.isRequired,
    setSceneInterval: PropTypes.func.isRequired,
    updateRelation: PropTypes.func.isRequired,
  }

  state = {
    DOMitemsDimensions: {},
    newLayer: 0,
    maxZindex: 0,
  }

  componentDidUpdate(prevProps) {
    if (!(prevProps.relations === this.props.relations)) {
      var maxZindex = 0;
      Object.keys(this.props.relations).forEach((key) => {
        if (this.props.relations[key].zIndex > maxZindex)
          maxZindex = this.props.relations[key].zIndex;
      });

      this.setState({
        maxZindex: maxZindex,
        newLayer: 0,
      });
    }
  }

  getCurrentFormatedTick = () => millisec(this.props.interval).format('hh [h] : mm [m] : ss [s]');

  render() {

    const sceneDuration       = this.props.scene.duration;
    const scaling             = this.props.scaling;
    const editorDurationWidth = this.props.editorDurationWidth;
    const relations           = this.props.relations;
    const medias              = this.props.medias;
    const timeInterval        = this.props.interval;
    const maxZindex           = this.state.maxZindex + this.state.newLayer;
    var items                 = [];

    Object.keys(relations).forEach((key) => {

      var previousRelation = null;
      var nextRelation = null;
      var maxPrevious = -1;
      var maxNext = Number.MAX_VALUE;
      Object.keys(relations).forEach((keySearch) => {
        if (key != keySearch)
          if (relations[key].zIndex == relations[keySearch].zIndex) {
            const previousTemp = relations[keySearch].duration + relations[keySearch].startTimeOffset;
            if (previousTemp <= relations[key].startTimeOffset) {
              if (previousTemp > maxPrevious) {
                maxPrevious = previousTemp;
                previousRelation = relations[keySearch];
              }
            } else if (relations[keySearch].startTimeOffset > relations[key].startTimeOffset + relations[key].duration) {
              if (relations[keySearch].startTimeOffset < maxNext) {
                maxNext = relations[keySearch].startTimeOffset;
                nextRelation = relations[keySearch];
              }
            }
          }
      });

      console.log(relations[key], previousRelation, nextRelation);

      items.push(
        <SceneEditorTimelineItem
          key={key}
          media={medias[relations[key].id]}
          editorDurationWidth={editorDurationWidth}
          relation={relations[key]}
          previousRelation={previousRelation}
          nextRelation={nextRelation}
          scale={100}
          scaling={scaling}
          onClick={this.props.onClick}
          updateRelation={this.props.updateRelation}
          rightLastElement={0}
        />
      );
    });

    return (
      <div id="editor-duration-menu">
        <Row>
          <Col offset='8' span="9">
            <Button onClick={this.props.rewindScene} icon='step-backward' />
            <Button onClick={this.props.pauseScene} icon='pause' />
            <Button onClick={this.props.playScene} icon='caret-right' />
            <span className='timerDisplayer'>{this.getCurrentFormatedTick()}</span>
          </Col>
          <Col offset='2' span="5">
            <Button icon='minus-circle-o' onClick={() => this.props.changeScaling(0.9)}/>
            <span> <Icon type="search" /> {scaling / 1000}[s] </span>
            <Button icon='plus-circle-o' onClick={() => this.props.changeScaling(1.1)}/>
          </Col>
        </Row>
        <Row>
          <SceneEditorTimelineDurationMarque
            sceneDuration={sceneDuration}
            scaling={scaling}
            editorDurationWidth={editorDurationWidth}
          />
          <SceneEditorTimelineCursor
            backgroundColor='green'
            cursorWidth={5}
            scaling={scaling}
            editorDurationWidth={editorDurationWidth}
            height={7 + 50*(maxZindex+1)}
            x={Math.round((timeInterval) / scaling * editorDurationWidth)}
            onDrag={(offsetX) => this.props.setSceneInterval(offsetX)}
          />
        </Row>
        <Row className='timeline' style={{height: 50*(maxZindex+1) + 'px', backgroundSize: editorDurationWidth + 'px 50px'}}>
          {items}
        </Row>
        <Row>
          <Button
            style={{marginTop: '5px'}}
            icon="plus"
            onClick={() => {
              this.setState({
                newLayer: 1,
              });
            }}>
            ajoute une couche
          </Button>
        </Row>
      </div>
    );
  }
}
