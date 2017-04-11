import React, { Component, PropTypes } from 'react';

import { Button, Row, Col, Icon, Switch, Tooltip } from 'antd';
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
    maxZindex: 0,
    magnetIsActive: false,
    magnetX: -1,
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
      });
    }
  }

  getCurrentFormatedTick = () => millisec(this.props.interval).format('hh [h] : mm [m] : ss [s]');

  updateCurrentMagnetX = (magnetX) => this.setState({magnetX: magnetX});

  render() {

    const sceneDuration       = this.props.scene.duration;
    const scaling             = this.props.scaling;
    const editorDurationWidth = this.props.editorDurationWidth;
    const relations           = this.props.relations;
    const medias              = this.props.medias;
    const timeInterval        = this.props.interval;
    const maxZindex           = this.state.maxZindex + 2;
    var items                 = [];
    var rnd                   = {};

    Object.keys(relations).forEach((key) => {

      items.push(
        <SceneEditorTimelineItem
          ref={(ref) => rnd[relations[key].idRelation] = ref}
          key={key}
          media={medias[relations[key].id]}
          editorDurationWidth={editorDurationWidth}
          relation={relations[key]}
          scale={100}
          scaling={scaling}
          onClick={this.props.onClick}
          updateRelation={this.props.updateRelation}
          maxZindex={maxZindex}
          itemsRef={rnd}
          magnetIsActive={this.state.magnetIsActive}
          setCurrentMagnetX={this.updateCurrentMagnetX}
        />
      );
    });

    return (
      <div id="editor-duration-menu">
        <Row>
          <Col span='2'>
            <Tooltip title="Active/désactive le magnetisme lors des déplacements des éléments dans la timeline.">
              <Switch onChange={(checked) => this.setState({magnetIsActive: checked})}
                      defaultChecked={false}
                      checkedChildren={<Icon type="lock" />}
                      unCheckedChildren={<Icon type="unlock" />} />
            </Tooltip>
          </Col>
          <Col offset='6' span="9">
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
            height={7 + 50*(maxZindex)}
            x={Math.round((timeInterval) / scaling * editorDurationWidth)}
            onDrag={(offsetX) => this.props.setSceneInterval(offsetX)}
          />
        </Row>
        <Row className='timeline' style={{height: 50*(maxZindex) + 'px', backgroundSize: editorDurationWidth + 'px 50px'}}>
          {items}
          {this.state.magnetX > -1 ? <div className='magnet' style={{height: 50*maxZindex + 'px', marginLeft: this.state.magnetX-1 + 'px'}} /> : null}
        </Row>
      </div>
    );
  }
}