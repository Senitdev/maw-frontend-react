import React, { Component, PropTypes } from 'react';
import Rnd from 'react-rnd';
import { Button, Row, Col } from 'antd';

export default class SceneEditorDuration extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    content: PropTypes.element.isRequired,
    editorDurationWidth: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    mediaInSceneLength: PropTypes.number.isRequired,
    moveMediaInScene: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDragStop: PropTypes.func.isRequired,
    onResizeStop: PropTypes.func.isRequired,
    scaling: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    this.rnd.updatePosition({
      x: nextProps.x,
    });
    this.rnd.updateSize({
      width: nextProps.width,
    });
  }

  rnd;

  render() {

    return (
      <Row className="editor-duration">
      <Col span="1" className="editor-duration-buttons">
        <Button
          disabled={this.props.id == 0}
          onClick={() => {
            this.props.moveMediaInScene(this.props.id, -1);
          }}
          type="dashed" shape="circle" icon="caret-up" size="small" />
        <Button
          disabled={this.props.id == this.props.mediaInSceneLength -1}
          onClick={() => {
            this.props.moveMediaInScene(this.props.id, 1);
          }}
          type="dashed" shape="circle" icon="caret-down" size="small" />
      </Col>
      <Col span="23" className="editor-duration-container">
        <Rnd
          ref={(c) => { this.rnd = c; }}
          initial={{
            x: this.props.x,
            y: 0,
            width: this.props.width,
            height: 44,
          }}
          resizeGrid={[this.props.editorDurationWidth / (this.props.scaling / scale), 1]}
          moveGrid={[this.props.editorDurationWidth / (this.props.scaling / scale), 1]}
          style={{backgroundColor: this.props.backgroundColor}}
          className="editor-separation-element"
          minWidth={1}
          minHeight={44}
          maxHeight={45}
          bounds={'parent'}
          moveAxis="x"
          isResizable={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          }}
          onClick={this.props.onClick}
          onDragStop={(event, ui) => {
            const newStart = Math.round((ui.position.left / this.props.editorDurationWidth * this.props.scaling) / scale) * scale;

            this.props.onDragStop(newStart);
          }}
          onResizeStop={(direction, styleSize, clientSize) => {
            const newDuration = Math.round((clientSize.width / this.props.editorDurationWidth * this.props.scaling) / scale) * scale;

            this.props.onResizeStop(newDuration);
          }}
        >
          {this.props.content}
        </Rnd>
      </Col>
      </Row>
    );
  }
}
